import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Hash,
  User as UserIcon,
  Search,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Info,
  Clock,
  UserPlus,
  UserCheck,
  Users,
  Heart,
  PartyPopper,
  Link as LinkIcon,
  Copy,
  Check,
  X,
  MessageCircle,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, ChatMessage } from '../../types';

export const AcademicChat: React.FC = () => {
  const {
    currentUser,
    users,
    chatMessages,
    sendChatMessage,
    branding,
    sendFriendRequest,
    acceptFriendRequest,
    cancelFriendRequest,
    removeFriend,
    addFriendByLink,
  } = useApp();

  // Channels
  const channels = [
    { id: 'pai-tahfidz', name: 'Forum PAI & Tahfidz', desc: 'Bimbingan tajwid, hafalan Al-Qur’an, dan fikih ibadah' },
    { id: 'matematika', name: 'Forum Matematika SMP', desc: 'Konsultasi aljabar, bilangan bulat, dan geometri SMP' },
    { id: 'ipa-terpadu', name: 'Forum IPA Terpadu SMP', desc: 'Praktikum sains mikroskopis, fisika, dan biologi SMP' },
    { id: 'umum', name: 'Forum Umum SMPI AL-AKBAR', desc: 'Informasi akademik dan kegiatan santri terpadu' },
    { id: 'bimbingan-konseling', name: 'Bimbingan Konseling (BK)', desc: 'Konsultasi pembinaan akhlak & motivasi belajar' },
  ];

  // Active target: either a channel ID or direct user ID
  const [selectedType, setSelectedType] = useState<'channel' | 'dm'>('channel');
  const [selectedId, setSelectedId] = useState<string>('matematika');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [contactTab, setContactTab] = useState<'semua' | 'teman' | 'permintaan' | 'saluran'>('semua');

  // Fitur Tambahan: Search di dalam chat percakapan aktif (In-Thread Search)
  const [threadSearchOpen, setThreadSearchOpen] = useState(false);
  const [threadSearchQuery, setThreadSearchQuery] = useState('');

  // Fitur Tambahan: Pop-up Profil Orang Lain saat diklik di chat umum
  const [viewingProfileUser, setViewingProfileUser] = useState<User | null>(null);

  // Fitur Tambahan: Tambah Teman via Link modal
  const [showAddFriendLinkModal, setShowAddFriendLinkModal] = useState(false);
  const [inputFriendLink, setInputFriendLink] = useState('');
  const [linkAddMessage, setLinkAddMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (!threadSearchQuery) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, selectedId, selectedType, threadSearchQuery]);

  // Messages for active conversation
  const rawMessages = chatMessages.filter(msg => {
    if (selectedType === 'channel') {
      return msg.channelId === selectedId;
    } else {
      return (
        (msg.senderId === currentUser?.id && msg.receiverId === selectedId) ||
        (msg.senderId === selectedId && msg.receiverId === currentUser?.id)
      );
    }
  });

  // Filter messages by in-thread search if query exists
  const currentMessages = threadSearchQuery.trim()
    ? rawMessages.filter(m => m.content.toLowerCase().includes(threadSearchQuery.toLowerCase()))
    : rawMessages;

  const selectedUser = selectedType === 'dm' ? users.find(u => u.id === selectedId) : null;
  const selectedChannel = selectedType === 'channel' ? channels.find(c => c.id === selectedId) : null;

  // Filter users
  const contactUsers = users.filter(u => {
    if (u.id === currentUser?.id) return false;
    if (!searchQuery) return true;
    return (
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.mapel && u.mapel.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.kelas && u.kelas.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // Friend lists
  const myFriends = contactUsers.filter(u => currentUser?.friends?.includes(u.id));
  const incomingRequests = contactUsers.filter(u => currentUser?.friendRequestsReceived?.includes(u.id));
  const outgoingRequests = contactUsers.filter(u => currentUser?.friendRequestsSent?.includes(u.id));

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !currentUser) return;

    sendChatMessage({
      senderId: currentUser.id,
      senderName: currentUser.displayName || currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar,
      senderClassOrMapel: currentUser.role === 'guru' ? currentUser.mapel : currentUser.kelas,
      channelId: selectedType === 'channel' ? selectedId : undefined,
      receiverId: selectedType === 'dm' ? selectedId : undefined,
      content: inputText.trim(),
    });

    setInputText('');
  };

  const myFriendLink = currentUser
    ? `${window.location.origin}/?add-friend=${currentUser.id}`
    : '';

  const handleCopyMyFriendLink = () => {
    if (navigator.clipboard && myFriendLink) {
      navigator.clipboard.writeText(myFriendLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleAddFriendViaLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputFriendLink.trim()) return;
    const res = addFriendByLink(inputFriendLink);
    setLinkAddMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      setTimeout(() => {
        setShowAddFriendLinkModal(false);
        setInputFriendLink('');
        setLinkAddMessage(null);
      }, 1800);
    }
  };

  const quickStarters = [
    'Assalamu’alaikum, mohon izin konsultasi materi pelajaran.',
    'Bolehkah saya minta petunjuk tugas modul berikutnya?',
    'Terima kasih banyak atas penjelasannya!',
  ];

  return (
    <div className="space-y-4">
      
      {/* Top Banner: Chat Title & Notice */}
      <div className="bg-emerald-50/90 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-emerald-950">
                Chat
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                hubungi warga sekolah
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              Komunikasi santri dan guru SMPI AL-AKBAR. Klik foto profil teman untuk melihat bio bubble status atau tambah teman melalui link!
            </p>
          </div>
        </div>

        {/* Friend Tools: Link berteman & Counter */}
        {currentUser && (
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <button
              type="button"
              onClick={handleCopyMyFriendLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-100/70 border border-emerald-200 font-bold shadow-2xs transition-all active:scale-95"
              title="Salin tautan unik untuk mengajak teman lain berteman dengan Anda"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Tautan Disalin!' : 'Salin Tautan Berteman'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowAddFriendLinkModal(true);
                setLinkAddMessage(null);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-2xs transition-transform active:scale-95"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>+ Tambah via Link</span>
            </button>

            <div className="flex items-center gap-2 font-bold bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
              <span className="text-slate-700">{myFriends.length} Teman</span>
              {incomingRequests.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black animate-pulse">
                  {incomingRequests.length} Baru!
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
        
        {/* Left 4 cols: Contacts & Friends Tabs */}
        <div className="md:col-span-4 border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
          
          {/* Search bar */}
          <div className="p-3 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari warga sekolah, teman, mapel..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-100 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 mt-2.5 overflow-x-auto pb-0.5">
              <button
                type="button"
                onClick={() => setContactTab('semua')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                  contactTab === 'semua'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Warga Sekolah
              </button>
              <button
                type="button"
                onClick={() => setContactTab('teman')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  contactTab === 'teman'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>Teman ({myFriends.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setContactTab('permintaan')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  contactTab === 'permintaan'
                    ? 'bg-amber-500 text-slate-900 shadow-2xs'
                    : incomingRequests.length > 0
                    ? 'bg-amber-100 text-amber-900 font-black'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>Permintaan</span>
                {incomingRequests.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">
                    {incomingRequests.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setContactTab('saluran')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                  contactTab === 'saluran'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Forum Mapel
              </button>
            </div>
          </div>

          {/* Contact Lists */}
          <div className="flex-1 overflow-y-auto p-2 space-y-3">
            
            {/* View: Channels */}
            {(contactTab === 'saluran' || contactTab === 'semua') && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center justify-between">
                  <span>Saluran Forum Mapel</span>
                  <span className="text-[9px] text-emerald-700 font-semibold">Grup Terbuka</span>
                </p>
                <div className="space-y-1">
                  {channels.map(c => {
                    const isActive = selectedType === 'channel' && selectedId === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedType('channel');
                          setSelectedId(c.id);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center space-x-2.5 transition-colors ${
                          isActive
                            ? 'text-white font-bold shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100 font-medium'
                        }`}
                        style={isActive ? { backgroundColor: branding.primaryColor } : {}}
                      >
                        <Hash className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <div className="truncate">
                          <span className="truncate block leading-tight">{c.name}</span>
                          <span className={`text-[10px] truncate block ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                            {c.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* View: Pending Friend Requests */}
            {(contactTab === 'permintaan' || (contactTab === 'semua' && incomingRequests.length > 0)) && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-amber-700 px-2 mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Permintaan Berteman Masuk ({incomingRequests.length})</span>
                </p>
                {incomingRequests.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-100">
                    Tidak ada permintaan berteman baru.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {incomingRequests.map(u => (
                      <div
                        key={u.id}
                        className="p-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl flex items-center justify-between gap-2 shadow-2xs"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-amber-300"
                          />
                          <div className="truncate">
                            <p className="truncate font-black text-xs text-slate-900 leading-tight">
                              {u.displayName || u.name}
                            </p>
                            <p className="text-[10px] text-slate-600 truncate">
                              {u.usn || u.name} • {u.role === 'guru' ? u.mapel : u.kelas}
                            </p>
                          </div>
                        </div>

                        {/* Accept Button triggers gemes celebration! */}
                        <button
                          type="button"
                          onClick={() => acceptFriendRequest(u.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] shrink-0 shadow-xs transition-transform active:scale-95 flex items-center gap-1"
                          title="Terima dan jadi mutualan berteman!"
                        >
                          <PartyPopper className="w-3 h-3" />
                          <span>Terima 🎉</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* View: Mutual Friends (Teman Saya) */}
            {contactTab === 'teman' && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                  Daftar Teman Mutualan ({myFriends.length})
                </p>
                {myFriends.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-600">Belum ada teman mutualan.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Buka tab "Warga Sekolah" dan klik "Tambah Teman" untuk mengajak teman!</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {myFriends.map(u => {
                      const isActive = selectedType === 'dm' && selectedId === u.id;
                      return (
                        <div
                          key={u.id}
                          className={`p-2.5 rounded-xl border transition-colors flex items-center justify-between gap-2 ${
                            isActive
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedType('dm');
                              setSelectedId(u.id);
                            }}
                            className="flex items-center space-x-2 truncate flex-1 text-left"
                          >
                            <img
                              src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                              alt={u.name}
                              className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-emerald-300"
                            />
                            <div className="truncate">
                              <p className={`truncate font-extrabold text-xs leading-tight ${isActive ? 'text-white' : 'text-slate-900'}`}>
                                {u.displayName || u.name}
                              </p>
                              <p className={`text-[10px] truncate ${isActive ? 'text-emerald-100' : 'text-slate-500'}`}>
                                {u.usn || u.name} • {u.role === 'guru' ? u.mapel : u.kelas}
                              </p>
                            </div>
                          </button>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                            isActive ? 'bg-white/20 text-white' : 'bg-pink-100 text-pink-700 border border-pink-200'
                          }`}>
                            <Heart className="w-2.5 h-2.5 fill-current" />
                            <span>Mutualan</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* View: Warga Sekolah (Direct Messaging & Friend System) */}
            {(contactTab === 'semua') && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center justify-between">
                  <span>Warga Sekolah (Guru & Siswa)</span>
                  <span className="text-[9px] text-slate-400">Hubungi langsung</span>
                </p>
                <div className="space-y-1">
                  {contactUsers.map(u => {
                    const isActive = selectedType === 'dm' && selectedId === u.id;
                    const isMutual = currentUser?.friends?.includes(u.id);
                    const isSent = currentUser?.friendRequestsSent?.includes(u.id);
                    const isReceived = currentUser?.friendRequestsReceived?.includes(u.id);

                    return (
                      <div
                        key={u.id}
                        className={`p-2 rounded-xl border transition-colors flex flex-col gap-1.5 ${
                          isActive
                            ? 'bg-emerald-50/90 border-emerald-300 shadow-2xs'
                            : 'bg-white hover:bg-slate-50/80 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          {/* User info clickable to chat */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedType('dm');
                              setSelectedId(u.id);
                            }}
                            className="flex items-center space-x-2 truncate flex-1 text-left"
                          >
                            <img
                              src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                              alt={u.name}
                              className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                            />
                            <div className="truncate">
                              {/* Nama Panggilan on top */}
                              <p className="truncate leading-tight font-extrabold text-xs text-slate-900">
                                {u.displayName || u.name}
                              </p>
                              {/* Nama Asli underneath without "USN:" */}
                              <p className="text-[10px] truncate text-slate-500 font-medium">
                                {u.usn || u.name} • {u.role === 'guru' ? `Guru ${u.mapel}` : `Siswa ${u.kelas}`}
                              </p>
                            </div>
                          </button>

                          {/* Role tag */}
                          <span
                            className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-sm shrink-0 ml-1.5 ${
                              u.role === 'guru'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {u.role}
                          </span>
                        </div>

                        {/* Friendship Action Footer */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                          {isMutual ? (
                            <span className="font-extrabold text-pink-600 flex items-center gap-1">
                              <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
                              <span>Teman Mutualan ✨</span>
                            </span>
                          ) : isReceived ? (
                            <button
                              type="button"
                              onClick={() => acceptFriendRequest(u.id)}
                              className="font-black text-emerald-700 hover:text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs"
                            >
                              <PartyPopper className="w-3 h-3 text-emerald-600" />
                              <span>Terima Pertemanan 🎉</span>
                            </button>
                          ) : isSent ? (
                            <div className="flex items-center gap-1 text-slate-400">
                              <span>Menunggu Persetujuan...</span>
                              <button
                                type="button"
                                onClick={() => cancelFriendRequest(u.id)}
                                className="text-red-500 hover:underline"
                              >
                                (Batal)
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => sendFriendRequest(u.id)}
                              className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline"
                            >
                              <UserPlus className="w-3 h-3 text-emerald-600" />
                              <span>+ Tambah Teman</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedType('dm');
                              setSelectedId(u.id);
                            }}
                            className="font-bold text-slate-500 hover:text-emerald-700"
                          >
                            Buka Chat 💬
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right 8 cols: Active Chat Thread */}
        <div className="md:col-span-8 flex flex-col h-[600px] bg-white">
          
          {/* Thread Header */}
          <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-white/80">
            <div className="flex items-center space-x-3">
              {selectedType === 'channel' ? (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  <Hash className="w-5 h-5" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => selectedUser && setViewingProfileUser(selectedUser)}
                  className="relative group transition-transform active:scale-95"
                  title="Klik untuk melihat profil & bio status WhatsApp"
                >
                  <img
                    src={selectedUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                    alt={selectedUser?.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-400 shadow-xs group-hover:ring-emerald-600"
                  />
                  <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-emerald-600 text-white text-[8px]">
                    💬
                  </span>
                </button>
              )}

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Nama Panggilan on top */}
                  {selectedType === 'channel' ? (
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                      {selectedChannel?.name}
                    </h4>
                  ) : (
                    <button
                      type="button"
                      onClick={() => selectedUser && setViewingProfileUser(selectedUser)}
                      className="text-left font-extrabold text-xs sm:text-sm text-slate-900 leading-tight hover:text-emerald-700 hover:underline"
                    >
                      {selectedUser?.displayName || selectedUser?.name}
                    </button>
                  )}

                  {selectedType === 'dm' && currentUser?.friends?.includes(selectedUser?.id || '') && (
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-pink-100 text-pink-700 border border-pink-200 flex items-center gap-1">
                      <Heart className="w-2.5 h-2.5 fill-pink-500" /> Mutualan
                    </span>
                  )}
                </div>

                {/* Nama Asli underneath without "USN:" */}
                <p className="text-[11px] text-slate-500 font-medium">
                  {selectedType === 'channel'
                    ? selectedChannel?.desc
                    : selectedUser?.role === 'guru'
                    ? `${selectedUser.usn || selectedUser.name} • Guru Mapel ${selectedUser.mapel}`
                    : `${selectedUser?.usn || selectedUser?.name} • Kelas ${selectedUser?.kelas}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Search message button (Cari Pesan) */}
              <button
                type="button"
                onClick={() => {
                  setThreadSearchOpen(prev => !prev);
                  if (threadSearchOpen) setThreadSearchQuery('');
                }}
                className={`p-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border ${
                  threadSearchOpen || threadSearchQuery
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
                title="Cari Pesan dalam Percakapan ini"
              >
                <Search className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Cari Pesan</span>
              </button>

              <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Tersambung
              </span>
            </div>
          </div>

          {/* In-Thread Search Input Bar */}
          {threadSearchOpen && (
            <div className="px-4 py-2 bg-emerald-50/70 border-b border-emerald-200 flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-700 shrink-0" />
              <input
                type="text"
                autoFocus
                value={threadSearchQuery}
                onChange={(e) => setThreadSearchQuery(e.target.value)}
                placeholder="Cari kata kunci pesan di percakapan ini..."
                className="flex-1 bg-white px-3 py-1.5 rounded-xl text-xs border border-emerald-300 outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              {threadSearchQuery && (
                <button
                  type="button"
                  onClick={() => setThreadSearchQuery('')}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <span className="text-[11px] font-bold text-emerald-900 shrink-0">
                {currentMessages.length} hasil
              </span>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
            {currentMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center p-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 shadow-xs">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <p className="font-bold text-slate-700 text-sm">Belum ada pesan dalam percakapan ini.</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-sm">
                  Kirimkan pertanyaan, sapaan santun, atau konsultasi akademik untuk warga sekolah SMPI AL-AKBAR.
                </p>
              </div>
            ) : (
              currentMessages.map(msg => {
                const isMe = msg.senderId === currentUser?.id;
                const senderUser = users.find(u => u.id === msg.senderId);

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Foto Profil Pengirim Lain + Bio Bubble WhatsApp */}
                    {!isMe && (
                      <div className="flex flex-col items-center shrink-0 max-w-[85px]">
                        <button
                          type="button"
                          onClick={() => senderUser && setViewingProfileUser(senderUser)}
                          className="relative group transition-transform active:scale-90"
                          title="Klik foto untuk melihat profil & bio status"
                        >
                          <img
                            src={msg.senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80'}
                            alt={msg.senderName}
                            className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-emerald-300 group-hover:ring-emerald-500 shadow-2xs"
                          />
                        </button>

                        {/* WhatsApp-style Bubble Chat Bio di bawah PP */}
                        {senderUser?.bio && (
                          <div className="mt-1 relative flex flex-col items-center max-w-[85px]">
                            <div className="w-1.5 h-1.5 bg-emerald-100 rotate-45 border-l border-t border-emerald-300 -mb-0.5 z-10" />
                            <div
                              onClick={() => senderUser && setViewingProfileUser(senderUser)}
                              className="px-1.5 py-0.5 rounded-lg bg-emerald-50 border border-emerald-300 text-[8px] text-emerald-950 font-bold shadow-2xs text-center leading-tight cursor-pointer line-clamp-2 hover:bg-emerald-100 transition-colors"
                              title={`Bio: ${senderUser.bio}`}
                            >
                              💭 {senderUser.bio}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] flex-wrap">
                        {/* Nama Panggilan on top/front */}
                        <button
                          type="button"
                          onClick={() => (senderUser || currentUser) && setViewingProfileUser(senderUser || currentUser)}
                          className="font-extrabold text-slate-900 hover:text-emerald-700 hover:underline cursor-pointer"
                        >
                          {isMe ? (currentUser?.displayName || currentUser?.name || msg.senderName) : (senderUser?.displayName || msg.senderName)}
                        </button>
                        {/* Nama Asli without USN prefix */}
                        {(senderUser?.usn || (isMe && currentUser?.usn)) && (
                          <span className="text-[10px] text-slate-500 font-medium">
                            ({isMe ? currentUser?.usn : senderUser?.usn})
                          </span>
                        )}
                        {msg.senderClassOrMapel && (
                          <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-sm font-semibold">
                            {msg.senderClassOrMapel}
                          </span>
                        )}
                        <span className="text-slate-400">
                          {new Date(msg.timestamp).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div
                        className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                          isMe
                            ? 'text-white font-medium rounded-tr-xs'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                        }`}
                        style={isMe ? { backgroundColor: branding.primaryColor } : {}}
                      >
                        {msg.content}
                      </div>
                    </div>

                    {/* Foto Profil Pengguna Sendiri (isMe) + Bio Bubble WhatsApp */}
                    {isMe && (
                      <div className="flex flex-col items-center shrink-0 max-w-[85px]">
                        <button
                          type="button"
                          onClick={() => currentUser && setViewingProfileUser(currentUser)}
                          className="relative group transition-transform active:scale-90"
                          title="Klik foto untuk melihat profil & bio status Anda"
                        >
                          <img
                            src={currentUser?.avatar || msg.senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80'}
                            alt={currentUser?.name || msg.senderName}
                            className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-emerald-500 group-hover:ring-emerald-600 shadow-2xs"
                          />
                        </button>

                        {/* WhatsApp-style Bubble Chat Bio di bawah PP pengguna saat mengirim pesan */}
                        {currentUser?.bio && (
                          <div className="mt-1 relative flex flex-col items-center max-w-[85px]">
                            <div className="w-1.5 h-1.5 bg-emerald-100 rotate-45 border-l border-t border-emerald-300 -mb-0.5 z-10" />
                            <div
                              onClick={() => currentUser && setViewingProfileUser(currentUser)}
                              className="px-1.5 py-0.5 rounded-lg bg-emerald-50 border border-emerald-300 text-[8px] text-emerald-950 font-bold shadow-2xs text-center leading-tight cursor-pointer line-clamp-2 hover:bg-emerald-100 transition-colors"
                              title={`Bio Anda: ${currentUser.bio}`}
                            >
                              💭 {currentUser.bio}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Academic Starters */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0">
            <span className="text-slate-500 shrink-0 font-medium">Bantuan Kalimat:</span>
            {quickStarters.map((starter, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputText(starter)}
                className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50 hover:border-emerald-300 whitespace-nowrap shrink-0 transition-colors shadow-2xs font-medium"
              >
                {starter}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ketik pesan untuk ${selectedType === 'channel' ? selectedChannel?.name : (selectedUser?.displayName || selectedUser?.name)}...`}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 text-xs sm:text-sm focus:bg-white border border-transparent focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 rounded-xl font-bold text-white disabled:opacity-40 shadow-xs transition-transform active:scale-95 flex items-center gap-1.5"
              style={{ backgroundColor: branding.primaryColor }}
            >
              <span>Kirim</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

      {/* MODAL 1: Tambah Teman via Link */}
      {showAddFriendLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <LinkIcon className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Tambah Teman Melalui Link</h3>
                  <p className="text-[11px] text-slate-500">Ketikkan tautan atau User ID teman sekolah</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddFriendLinkModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFriendViaLinkSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tempel Tautan atau ID Teman:
                </label>
                <input
                  type="text"
                  required
                  value={inputFriendLink}
                  onChange={(e) => setInputFriendLink(e.target.value)}
                  placeholder="https://.../?add-friend=user-siswa-0 atau user-siswa-0"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              {linkAddMessage && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${
                  linkAddMessage.isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  {linkAddMessage.text}
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <p className="font-bold text-slate-800">💡 Tautan Berteman Anda Sendiri:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={myFriendLink}
                    className="flex-1 bg-white px-2 py-1 rounded-lg border border-slate-200 text-[10px] text-slate-500 font-mono select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyMyFriendLink}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] shrink-0"
                  >
                    {copiedLink ? 'Tersalin!' : 'Salin'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddFriendLinkModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-transform active:scale-95"
                >
                  Kirim Permintaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Profil Pengguna Lain Saat Diklik di Chat (dengan Bio Bubble WhatsApp Style) */}
      {viewingProfileUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-emerald-100 text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <button
              type="button"
              onClick={() => setViewingProfileUser(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Avatar & Bio Speech Bubble */}
            <div className="flex flex-col items-center mt-2">
              <div className="relative">
                <img
                  src={viewingProfileUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                  alt={viewingProfileUser.name}
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-emerald-400 shadow-md"
                />
                <span className={`absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow-xs ${
                  viewingProfileUser.role === 'guru'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-400 text-amber-950'
                }`}>
                  {viewingProfileUser.role}
                </span>
              </div>

              {/* Bio WhatsApp Bubble Chat tepat di bawah Foto Profil (PP) */}
              <div className="mt-3 relative flex flex-col items-center max-w-[260px]">
                <div className="w-2.5 h-2.5 bg-emerald-100 rotate-45 border-l border-t border-emerald-300 -mb-1 z-10" />
                <div className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 text-xs text-emerald-950 font-semibold shadow-xs text-center leading-relaxed">
                  💭 "{viewingProfileUser.bio || 'Belajar dengan tekun di SMPI AL-AKBAR ✨'}"
                </div>
              </div>
            </div>

            {/* User Identity: Nama Panggilan di atas, Nama Asli di bawah tanpa 'USN:' */}
            <div className="mt-4">
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                {viewingProfileUser.displayName || viewingProfileUser.name}
              </h3>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">
                {viewingProfileUser.usn || viewingProfileUser.name}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {viewingProfileUser.role === 'guru'
                  ? `Guru Pengampu • ${viewingProfileUser.mapel || 'Mata Pelajaran'}`
                  : `Santri Aktif • Kelas ${viewingProfileUser.kelas || 'Siswa'}`}
              </p>
            </div>

            {/* Actions: Chat & Friendship */}
            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedType('dm');
                  setSelectedId(viewingProfileUser.id);
                  setViewingProfileUser(null);
                }}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Mulai Chat Pribadi</span>
              </button>

              {currentUser && currentUser.id !== viewingProfileUser.id && (
                <div>
                  {currentUser.friends?.includes(viewingProfileUser.id) ? (
                    <div className="py-2 rounded-xl bg-pink-50 text-pink-700 border border-pink-200 text-xs font-extrabold flex items-center justify-center gap-1.5">
                      <Heart className="w-4 h-4 fill-pink-500" />
                      <span>Sudah Teman Mutualan ✨</span>
                    </div>
                  ) : currentUser.friendRequestsReceived?.includes(viewingProfileUser.id) ? (
                    <button
                      type="button"
                      onClick={() => {
                        acceptFriendRequest(viewingProfileUser.id);
                        setViewingProfileUser(null);
                      }}
                      className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <PartyPopper className="w-4 h-4" />
                      <span>Terima Permintaan Berteman! 🎉</span>
                    </button>
                  ) : currentUser.friendRequestsSent?.includes(viewingProfileUser.id) ? (
                    <div className="py-2 text-xs text-slate-400 font-medium">
                      Permintaan berteman sudah dikirim (Menunggu...)
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        sendFriendRequest(viewingProfileUser.id);
                        setViewingProfileUser(null);
                      }}
                      className="w-full py-2 rounded-xl border border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-bold text-xs flex items-center justify-center gap-1"
                    >
                      <UserPlus className="w-4 h-4 text-emerald-600" />
                      <span>+ Tambah Sebagai Teman</span>
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

