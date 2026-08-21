import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Award, Trophy, Medal } from "lucide-react";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await api.get("/users/leaderboard");
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leaderboard", error);
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center mb-10 space-y-3">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(250,204,21,0.4)]">
          <Trophy className="text-white" size={32} />
        </div>
        <h2 className="text-4xl font-extrabold text-white tracking-tight">Honesty Leaderboard</h2>
        <p className="text-slate-400 text-lg">Recognizing our most trusted community heroes.</p>
      </div>

      <div className="glass-panel overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {users.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No ranked users yet. Be the first!</div>
            ) : (
              users.map((user, index) => (
                <div 
                  key={user._id} 
                  className={`flex items-center p-6 gap-6 transition hover:bg-white/5 ${index < 3 ? 'bg-white/5' : ''}`}
                >
                  <div className="text-2xl font-bold text-slate-500 w-8 text-center">
                    {index === 0 ? <span className="text-yellow-400 text-3xl">1</span> :
                     index === 1 ? <span className="text-slate-300 text-3xl">2</span> :
                     index === 2 ? <span className="text-amber-600 text-3xl">3</span> :
                     index + 1}
                  </div>
                  
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl uppercase shadow-inner border border-white/20">
                    {user.name.charAt(0)}
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-white">{user.name}</h3>
                    {index === 0 && <p className="text-xs text-yellow-400 font-semibold uppercase tracking-wider flex items-center gap-1 mt-1"><Award size={12}/> Top Finder</p>}
                  </div>
                  
                  <div className="text-right flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                    <Medal className="text-emerald-400" size={20} />
                    <span className="text-xl font-bold text-white">{user.honestyScore}</span>
                    <span className="text-xs text-slate-400 font-medium">pts</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
