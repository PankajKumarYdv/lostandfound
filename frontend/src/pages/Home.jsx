import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Search, MapPin, Clock } from "lucide-react";

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await api.get("/items");
        setItems(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching items", error);
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="text-center py-12 space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 drop-shadow-sm">
          Find What You Lost.
          <br />
          Return What You Found.
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
          TrustTrace connects honest finders with rightful owners through a
          secure, verified claim process. Build your honesty score today.
        </p>
      </div>

      <div className="glass-panel p-6 mb-8 flex gap-4 max-w-3xl mx-auto">
        <div className="relative flex-grow">
          <Search className="absolute right-3 top-4 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, description, or category..."
            className="glass-input w-full pl-10 "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.filter(
            (item) =>
              item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              item.category.toLowerCase().includes(searchQuery.toLowerCase()),
          ).length === 0 ? (
            <div className="col-span-full text-center text-slate-400 py-12 glass-panel">
              No available items matched your search.
            </div>
          ) : (
            items
              .filter(
                (item) =>
                  item.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  item.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  item.category
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
              )
              .map((item) => (
                <div
                  key={item._id}
                  className="glass-panel overflow-hidden group hover:border-white/20 transition-colors"
                >
                  <div className="h-48 bg-slate-800 relative overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={`http://localhost:5000${item.images[0]}`}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        No Image Available
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-emerald-500/90 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="text-xl font-bold text-white line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2">
                      {item.description}
                    </p>

                    <div className="pt-4 flex items-center justify-between border-t border-white/5">
                      <div className="flex items-center text-xs text-slate-400 gap-1">
                        <Clock size={14} />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                      <Link
                        to={`/item/${item._id}`}
                        className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition flex items-center gap-1"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
