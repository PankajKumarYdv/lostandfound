import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { AlertTriangle, UploadCloud, CheckCircle } from "lucide-react";

const PostItem = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    
    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    }

    try {
      await api.post("/items", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post item");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <h2 className="text-3xl font-bold text-white mb-6">Post a Found Item</h2>

      <div className="bg-amber-500/20 border border-amber-500/50 rounded-xl p-4 mb-6 flex gap-4 backdrop-blur-sm shadow-[0_4px_20px_rgba(245,158,11,0.15)]">
        <div className="mt-1">
          <AlertTriangle className="text-amber-400" size={24} />
        </div>
        <div>
          <h3 className="text-amber-400 font-bold">Important Security Warning</h3>
          <p className="text-amber-200/80 text-sm mt-1">
            Do not upload images that reveal serial numbers or unique secret identifiers. Keep them hidden for the verification process to ensure the real owner can prove their claim!
          </p>
        </div>
      </div>

      <div className="glass-panel p-8 relative overflow-hidden">
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300 ml-1">Item Title</label>
            <input 
              type="text" 
              required
              className="glass-input w-full" 
              placeholder="e.g., Black iPhone 13 Pro"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300 ml-1">Description</label>
            <textarea 
              required
              rows="4"
              className="glass-input w-full resize-none" 
              placeholder="Where was it found? What condition is it in? (Remember, don't give away the secret details!)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300 ml-1">Category</label>
            <select 
              className="glass-input w-full appearance-none bg-slate-800/90 text-white focus:bg-slate-800 cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Electronics" className="bg-slate-800 text-white py-2">Electronics</option>
              <option value="Wallets/IDs" className="bg-slate-800 text-white py-2">Wallets & IDs</option>
              <option value="Keys" className="bg-slate-800 text-white py-2">Keys</option>
              <option value="Bags/Luggage" className="bg-slate-800 text-white py-2">Bags & Luggage</option>
              <option value="Jewelry/Watches" className="bg-slate-800 text-white py-2">Jewelry & Watches</option>
              <option value="Other" className="bg-slate-800 text-white py-2">Other</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300 ml-1">Upload Images (Max 3)</label>
            <label className="glass-input w-full border-dashed border-2 flex flex-col items-center justify-center py-8 cursor-pointer hover:bg-white/10 transition group">
              <UploadCloud className="text-slate-400 group-hover:text-blue-400 transition" size={32} />
              <span className="mt-2 text-slate-400 text-sm group-hover:text-slate-300">Click to browse or drag and drop</span>
              <input 
                type="file" 
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => setImages(e.target.files)}
              />
            </label>
            {images && images.length > 0 && (
              <p className="text-emerald-400 text-sm mt-2 flex items-center gap-1">
                <CheckCircle size={14} /> {images.length} file(s) selected
              </p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="glass-button-primary w-full flex justify-center items-center py-4 text-lg mt-4"
          >
            {loading ? (
               <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : "Post Found Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostItem;
