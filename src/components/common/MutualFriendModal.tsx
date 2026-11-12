import React from 'react';
import { Sparkles, Heart, MessageCircle, X, PartyPopper } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MutualFriendModal: React.FC = () => {
  const {
    currentUser,
    mutualFriendCelebration,
    clearMutualCelebration,
    setActiveTab,
  } = useApp();

  if (!mutualFriendCelebration || !currentUser) {
    return null;
  }

  const handleStartChat = () => {
    clearMutualCelebration();
    setActiveTab('chat');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative bg-gradient-to-b from-amber-50 via-white to-emerald-50/60 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-emerald-300 text-center overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Playful Floating Confetti Dots */}
        <div className="absolute top-3 left-4 w-3 h-3 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
        <div className="absolute top-8 right-6 w-3 h-3 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
        <div className="absolute top-16 left-8 w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
        <div className="absolute bottom-8 right-8 w-3 h-3 rounded-full bg-pink-400 animate-ping" />
        <div className="absolute bottom-10 left-6 w-2.5 h-2.5 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: '0.5s' }} />

        {/* Close Button */}
        <button
          type="button"
          onClick={clearMutualCelebration}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-slate-600 border border-slate-200 transition-colors shadow-xs"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Cute Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black shadow-xs mb-4">
          <PartyPopper className="w-4 h-4 text-amber-600 animate-bounce" />
          <span>MUTUALAN SUKSES!</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        </div>

        {/* Gemes Headline */}
        <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight leading-tight">
          yeyy kita berteman! 🎉✨
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium max-w-xs mx-auto leading-relaxed">
          Alhamdulillah! Sekarang kalian sudah saling mutualan berteman di portal <strong className="text-emerald-800">PINTAR - SMPI AL-AKBAR</strong>.
        </p>

        {/* Cute Avatars with Heart Connector */}
        <div className="my-6 flex items-center justify-center gap-3 sm:gap-4">
          {/* Current User */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                alt={currentUser.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-emerald-400 shadow-md transform hover:rotate-3 transition-transform"
              />
              <span className="absolute -bottom-1 -right-1 text-base">⭐</span>
            </div>
            <p className="font-extrabold text-xs text-slate-900 mt-2 max-w-[100px] truncate">
              {currentUser.displayName || currentUser.name}
            </p>
            <p className="text-[10px] text-slate-500 font-medium max-w-[100px] truncate">
              {currentUser.usn || currentUser.name}
            </p>
          </div>

          {/* Pulsing Animated Heart */}
          <div className="flex flex-col items-center px-1">
            <div className="w-10 h-10 rounded-full bg-pink-100 border border-pink-200 flex items-center justify-center text-pink-500 shadow-xs animate-pulse">
              <Heart className="w-6 h-6 fill-pink-500 text-pink-500" />
            </div>
            <span className="text-[9px] font-bold text-pink-600 mt-1 uppercase tracking-wider">
              Sahabat
            </span>
          </div>

          {/* Friend User */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={mutualFriendCelebration.friendAvatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80'}
                alt={mutualFriendCelebration.friendName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-amber-400 shadow-md transform hover:-rotate-3 transition-transform"
              />
              <span className="absolute -bottom-1 -right-1 text-base">✨</span>
            </div>
            <p className="font-extrabold text-xs text-slate-900 mt-2 max-w-[100px] truncate">
              {mutualFriendCelebration.friendDisplayName}
            </p>
            <p className="text-[10px] text-slate-500 font-medium max-w-[100px] truncate">
              {mutualFriendCelebration.friendUsn}
            </p>
          </div>
        </div>

        {/* Fun Note */}
        <div className="bg-white/80 rounded-2xl p-3 border border-emerald-100 text-slate-700 text-xs shadow-2xs mb-6">
          <p className="font-semibold text-emerald-900">
            Kini kalian bisa saling berkirim pesan akademik, berdiskusi kuis, dan bermain Cerdas Cermat bareng!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleStartChat}
            className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Kirim Pesan Chat Sekarang 💬</span>
          </button>
          <button
            type="button"
            onClick={clearMutualCelebration}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            Yeyy! Senang Berteman ✨
          </button>
        </div>

      </div>
    </div>
  );
};
