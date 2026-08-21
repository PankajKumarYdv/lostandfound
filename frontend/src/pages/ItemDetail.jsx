import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { ShieldCheck, MapPin, Clock, Info } from "lucide-react";

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Claim Form State
  const [proofDetails, setProofDetails] = useState("");
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await api.get(`/items/${id}`);
        setItem(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching item", error);
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleClaim = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    setClaimLoading(true);
    setClaimMessage("");

    try {
      await api.post("/claims", {
        itemId: id,
        proofDetails,
      });
      setClaimMessage(
        "Claim submitted successfully! The finder will review it shortly.",
      );
      setProofDetails("");
    } catch (err) {
      setClaimMessage(err.response?.data?.message || "Failed to submit claim.");
    } finally {
      setClaimLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-24">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center text-white text-2xl py-24">
        Item not found
      </div>
    );
  }

  const isOwner = user && user._id === item.createdBy._id;

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
      {/* Item Details Column */}
      <div className="space-y-6">
        <div className="glass-panel overflow-hidden">
          <div className="h-[400px] bg-slate-800 flex items-center justify-center p-4">
            {item.images && item.images.length > 0 ? (
              <img
                src={`http://localhost:5000${item.images[0]}`}
                alt={item.title}
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              />
            ) : (
              <span className="text-slate-500 text-lg">No Images Provided</span>
            )}
          </div>
        </div>

        <div className="glass-panel p-8 space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-white">{item.title}</h1>
            <span className="bg-white/10 px-3 py-1 rounded border border-white/10 text-emerald-400 font-bold text-sm tracking-wide">
              {item.category}
            </span>
          </div>

          <div className="flex gap-4 text-sm text-slate-400 pb-4 border-b border-white/10">
            <div className="flex items-center gap-1">
              <Clock size={16} />{" "}
              {new Date(item.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Info size={16} /> Posted by {item.createdBy.name}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Description
            </h3>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {item.description}
            </p>
          </div>
        </div>
      </div>

      {/* Claim Action Column */}
      <div className="space-y-6">
        {!isOwner ? (
          <div className="glass-panel p-8 relative overflow-hidden h-full flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="mb-8 border-l-4 border-blue-500 pl-4">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <ShieldCheck className="text-blue-500" />
                Claim This Item
              </h2>
              <p className="text-slate-400 text-sm">
                If this item belongs to you, provide specific details that only
                the real owner would know. The finder will review your claim.
              </p>
            </div>

            {claimMessage && (
              <div
                className={`p-4 rounded-xl text-sm mb-6 ${claimMessage.includes("success") ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/50" : "bg-red-500/20 text-red-200 border border-red-500/50"}`}
              >
                {claimMessage}
              </div>
            )}

            <form onSubmit={handleClaim} className="space-y-5 relative z-10">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Detailed Proof
                </label>
                <textarea
                  required
                  rows="6"
                  className="glass-input w-full resize-none"
                  placeholder="Describe secret marks, serial numbers, screen wallpaper, or any unique identifier that proves it's yours."
                  value={proofDetails}
                  onChange={(e) => setProofDetails(e.target.value)}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={claimLoading || item.status === "claimed"}
                className={`w-full py-4 rounded-xl text-lg font-bold flex justify-center items-center transition-all ${item.status === "claimed"
                  ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                  : "glass-button-primary"
                  }`}
              >
                {claimLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : item.status === "claimed" ? (
                  "Already Claimed"
                ) : (
                  "Submit Claim for Review"
                )}
              </button>
            </form>

            {!user && (
              <div className="mt-6 text-center text-sm text-slate-400">
                You need to{" "}
                <a href="/login" className="text-blue-400 hover:underline">
                  log in
                </a>{" "}
                to claim this item.
              </div>
            )}

            {user && (
              <div className="mt-6 p-4 border border-blue-500/30 bg-blue-500/10 rounded-xl text-center">
                <p className="text-slate-300 text-sm mb-3">
                  Already submitted a claim?
                </p>
                <button
                  onClick={() => {
                    // Quick hack to fetch user's claims for this item
                    api
                      .get(`/claims/${item._id}`)
                      .then((res) => {
                        // Since /claims/:itemId is restricted to finder, wait!
                        // The REST API to get claims requires finder authorization.
                        // For MVP, we alert the user if they can't get it, or route them to dashboard.
                      })
                      .catch(() => {
                        alert(
                          "Please check your email or dashboard for updates.",
                        );
                      });
                  }}
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                ></button>
                <Link
                  to={`/dashboard`}
                  className="glass-button bg-white/5 py-2 px-4 shadow-none border-blue-500/30 text-blue-400 block w-full text-center"
                >
                  Check your claims / Go to Dashboard
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-panel p-8 text-center flex flex-col items-center justify-center h-full">
            <ShieldCheck className="text-emerald-500 w-16 h-16 mb-4 opacity-70" />
            <h2 className="text-2xl font-bold text-white mb-2">
              You posted this item
            </h2>
            <p className="text-slate-400">
              Check your dashboard to view and review claims submitted by other
              users.
            </p>
            <a
              href="/dashboard"
              className="glass-button bg-white/10 mt-6 block"
            >
              Go to Dashboard
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetail;
