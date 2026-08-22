import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";
import { Send, Image as ImageIcon, ArrowLeft } from "lucide-react";

// Initialize socket exactly once
const socket = io("https://findrly.onrender.com");

const Chat = () => {
  const { claimId } = useParams();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/messages/${claimId}`);
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Join room for real-time updates
    socket.emit("join_claim_room", claimId);

    // Listener for incoming messages
    socket.on("receive_message", (messageObj) => {
      setMessages((prev) => [...prev, messageObj]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [claimId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !imageFile) return;

    setSending(true);
    try {
      const formData = new FormData();
      if (newMessage.trim()) formData.append("content", newMessage);
      if (imageFile) formData.append("image", imageFile);

      const { data } = await api.post(`/messages/${claimId}`, formData, {
         headers: { "Content-Type": "multipart/form-data" }
      });

      // Emit through socket for real-time
      socket.emit("send_message", { claimId, messageObj: data });

      setNewMessage("");
      setImageFile(null);
    } catch (error) {
      console.error("Error sending message", error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
     <div className="flex justify-center p-24">
       <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
     </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto h-[80vh] flex flex-col glass-panel overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-md border-b border-white/10 p-4 flex items-center gap-4 relative z-10">
        <Link to="/dashboard" className="text-slate-400 hover:text-white transition">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-white">TrustTrace Secure Chat</h2>
          <p className="text-xs text-slate-400">End-to-End communication for Claim #{claimId.slice(-6)}</p>
        </div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 my-10 italic">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMine = msg.sender._id === user._id;
            return (
              <div key={index} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                <span className={`text-xs text-slate-500 mb-1 mx-2`}>
                  {isMine ? "You" : msg.sender.name}
                </span>
                
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                  isMine 
                  ? "bg-blue-600/90 text-white rounded-tr-sm shadow-[0_4px_15px_rgba(37,99,235,0.2)]" 
                  : "bg-white/10 text-slate-200 rounded-tl-sm border border-white/10"
                }`}>
                  {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                  
                  {msg.image && (
                    <img 
                      src={`http://localhost:5000${msg.image}`} 
                      alt="Chat Attachment" 
                      className="mt-2 rounded-lg max-w-full h-auto border border-white/10 shadow-lg object-contain max-h-64"
                    />
                  )}
                </div>
                <span className={`text-[10px] text-slate-600 mt-1 mx-2`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="bg-slate-800/80 backdrop-blur-md border-t border-white/10 p-4">
        {imageFile && (
          <div className="mb-3 flex items-center gap-2 bg-blue-500/20 text-blue-300 w-max px-3 py-1 rounded text-sm border border-blue-500/30">
            <ImageIcon size={16} /> Attached: {imageFile.name}
            <button onClick={() => setImageFile(null)} className="ml-2 font-bold text-blue-200 hover:text-white">&times;</button>
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <label className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer transition text-slate-400 hover:text-blue-400">
            <ImageIcon size={24} />
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </label>
          
          <input 
            type="text" 
            placeholder="Type your message..." 
            className="glass-input flex-grow"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          
          <button 
            type="submit" 
            disabled={sending || (!newMessage.trim() && !imageFile)}
            className="glass-button-primary !px-4 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Send size={24} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
