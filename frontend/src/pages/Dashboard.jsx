import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { CopyCheck, ShieldAlert, BadgeCheck, MapPin } from "lucide-react";

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimsData, setClaimsData] = useState({}); // Mapping itemId to its claims
  const [myClaims, setMyClaims] = useState([]);
  const [successModal, setSuccessModal] = useState({
    show: false,
    itemName: "",
  });
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch user's exact posted items securely
        const { data: userItems } = await api.get("/items/my-items");
        setItems(userItems);

        // Fetch claims for each item
        const claimsMap = {};
        for (let item of userItems) {
          try {
            const { data } = await api.get(`/claims/${item._id}`);
            claimsMap[item._id] = data;
          } catch (e) {
            console.error("No claims or restricted", e);
          }
        }
        setClaimsData(claimsMap);

        // Fetch user's own claims
        try {
          const { data } = await api.get("/claims/my-claims");
          setMyClaims(data);
        } catch (e) {
          console.error("Error fetching my claims", e);
        }
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  const handleClaimReview = async (claimId, status, itemId) => {
    try {
      await api.patch(`/claims/${claimId}/status`, { status });
      // Update local state to reflect changes
      setClaimsData((prev) => ({
        ...prev,
        [itemId]: prev[itemId].map(
          (c) =>
            c._id === claimId
              ? { ...c, status }
              : status === "accepted"
                ? { ...c, status: "rejected" }
                : c, // Only one accepted claim
        ),
      }));
      if (status === "accepted") {
        setItems((prev) =>
          prev.map((item) =>
            item._id === itemId ? { ...item, status: "claimed" } : item,
          ),
        );
        const acceptedItem = items.find((i) => i._id === itemId);
        setSuccessModal({
          show: true,
          itemName: acceptedItem?.title || "Item",
        });
        // Update user state context honestyScore safely
        if (user && user.honestyScore !== undefined) {
          const updatedUser = { ...user, honestyScore: user.honestyScore + 10 };
          setUser(updatedUser);
          localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error("Error updating claim", error);
      alert("Failed to update claim.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-24">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-b border-white/10 gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Your Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Manage the items you've found and review claims.
          </p>
        </div>

        <div className="glass-panel px-6 py-4 flex items-center gap-4 border-emerald-500/30 bg-emerald-500/5">
          <BadgeCheck className="text-emerald-400" size={32} />
          <div>
            <p className="text-sm font-medium text-slate-400">Honesty Score</p>
            <p className="text-2xl font-bold text-white">
              {user?.honestyScore}{" "}
              <span className="text-sm text-slate-500">pts</span>
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Posted Items & Claims</h2>

        {items.length === 0 ? (
          <div className="glass-panel p-12 text-center">
            <ShieldAlert className="w-16 h-16 mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl text-white font-semibold">
              You haven't posted any found items
            </h3>
            <Link
              to="/post-item"
              className="inline-block mt-4 glass-button-primary px-6 py-2"
            >
              Post an Item Now
            </Link>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item._id}
              className="glass-panel overflow-hidden border border-white/10 shadow-lg"
            >
              <div className="p-6 bg-slate-800/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    {item.title}
                    {item.status === "claimed" && (
                      <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded border border-emerald-500/30">
                        CLAIMED
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-1 max-w-2xl mt-1">
                    {item.description}
                  </p>
                </div>
                <Link
                  to={`/item/${item._id}`}
                  className="text-sm glass-button py-2 px-4 whitespace-nowrap"
                >
                  View Item Page
                </Link>
              </div>

              <div className="p-6">
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                  Claims Submitted
                </h4>

                {!claimsData[item._id] || claimsData[item._id].length === 0 ? (
                  <p className="text-slate-500 italic text-sm py-2">
                    No claims have been made for this item yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {claimsData[item._id].map((claim) => (
                      <div
                        key={claim._id}
                        className={`p-4 rounded-xl border ${claim.status === "accepted" ? "bg-emerald-500/10 border-emerald-500/30" : claim.status === "rejected" ? "bg-red-500/5 border-red-500/10 opacity-60" : "bg-white/5 border-white/10"} flex flex-col lg:flex-row gap-4`}
                      >
                        <div className="flex-grow">
                          <p className="text-white font-medium mb-1">
                            <span className="text-slate-400 text-sm">
                              Claimant:
                            </span>{" "}
                            {claim.claimantId.name}
                          </p>
                          <div className="bg-black/20 p-3 rounded text-sm text-slate-300 font-mono">
                            {claim.proofDetails}
                          </div>
                        </div>

                        <div className="flex lg:flex-col justify-end items-end gap-2 lg:w-48">
                          <Link
                            to={`/chat/${claim._id}`}
                            className="w-full glass-button !bg-blue-600/50 hover:!bg-blue-500/80 border-blue-500/30 py-2 text-sm text-center"
                          >
                            Open Chat
                          </Link>
                          {claim.status === "pending" &&
                          item.status !== "claimed" ? (
                            <>
                              <button
                                onClick={() =>
                                  handleClaimReview(
                                    claim._id,
                                    "accepted",
                                    item._id,
                                  )
                                }
                                className="w-full glass-button !bg-emerald-600/80 hover:!bg-emerald-500 border-emerald-400/30 py-2 text-sm flex justify-center items-center gap-1"
                              >
                                <CopyCheck size={16} /> Accept & Verify
                              </button>
                              <button
                                onClick={() =>
                                  handleClaimReview(
                                    claim._id,
                                    "rejected",
                                    item._id,
                                  )
                                }
                                className="w-full glass-button !bg-red-600/50 hover:!bg-red-500/80 border-red-500/30 py-2 text-sm"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <div
                              className={`font-bold w-full text-center py-2 rounded ${claim.status === "accepted" ? "text-emerald-400" : claim.status === "rejected" ? "text-red-400" : "text-slate-400"}`}
                            >
                              Status: {claim.status.toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* NEW SECTION: My Submitted Claims */}
      <div className="space-y-6 mt-12 pt-8 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white">Your Submitted Claims</h2>
        {myClaims.length === 0 ? (
          <div className="glass-panel p-8 text-center text-slate-400">
            You haven't submitted any claims yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {myClaims.map((claim) => (
              <div
                key={claim._id}
                className="glass-panel p-6 flex flex-col md:flex-row justify-between items-center gap-4"
              >
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {claim.itemId ? claim.itemId.title : "Unknown Item"}
                  </h3>
                  <p className="text-sm text-slate-400 font-mono bg-black/20 p-2 rounded inline-block mb-2">
                    Proof: {claim.proofDetails}
                  </p>
                  <div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded border ${claim.status === "accepted" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : claim.status === "rejected" ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-white/10 text-slate-300 border-white/10"}`}
                    >
                      STATUS: {claim.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  {claim.itemId && (
                    <Link
                      to={`/item/${claim.itemId._id}`}
                      className="glass-button w-full md:w-auto text-center py-2 px-4 shadow-none"
                    >
                      View Item
                    </Link>
                  )}
                  <Link
                    to={`/chat/${claim._id}`}
                    className="glass-button-primary w-full md:w-auto text-center !px-6 py-2 shadow-none flex items-center justify-center"
                  >
                    Open Chat
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SUCCESS ANIMATED MODAL */}
      {successModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md transition-opacity animate-pulse">
          <div className="glass-panel p-8 max-w-sm w-full flex flex-col items-center text-center transform shadow-2xl border-emerald-500/50 border-2 relative overflow-hidden">
            {/* Radial glow background effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/20 blur-[80px] rounded-full pointer-events-none"></div>

            {/* Bouncing Checkmark */}
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.8)] relative z-10">
              <CopyCheck className="text-white w-10 h-10 animate-bounce" />
            </div>

            <h2 className="text-3xl font-black text-white px-4 mb-2 drop-shadow-lg relative z-10">
              Verified!
            </h2>
            <p className="text-emerald-100 text-base mb-6 relative z-10">
              "{successModal.itemName}" successfully returned.
            </p>

            <div className="bg-black/30 w-full rounded-xl p-4 mb-6 border border-emerald-500/30 relative z-10 shadow-inner">
              <p className="text-slate-300 font-bold tracking-widest text-xs uppercase mb-1">
                Reward Unlocked
              </p>
              <p className="text-emerald-400 text-3xl font-black drop-shadow-md">
                +10 Pts
              </p>
            </div>

            <button
              onClick={() => setSuccessModal({ show: false, itemName: "" })}
              className="glass-button w-full bg-emerald-600/80 hover:bg-emerald-500 border-none text-white font-bold py-3 text-lg z-10 relative"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
