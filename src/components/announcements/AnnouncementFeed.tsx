import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Image as ImageIcon,
  Video,
  FileText,
  Pin,
  MessageCircle,
  Send,
  Trash2,
  Share2,
  Sparkles,
  Filter,
  CheckCircle2,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MediaRenderer } from '../common/MediaRenderer';
import { Announcement } from '../../types';

export const AnnouncementFeed: React.FC = () => {
  const {
    currentUser,
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    addComment,
    branding,
    users,
    quizzes,
    assignments,
    setUserClass,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Filter kelas untuk siswa & guru: default ke kelas siswa yang sedang aktif
  // Filter kelas untuk siswa & guru: default ke aliran kelas siswa yang sedang aktif
  const defaultClassFilter = currentUser?.role === 'siswa' && currentUser?.kelas ? 'Aliran-Saya' : 'Semua';
  const [classFilter, setClassFilter] = useState<string>(defaultClassFilter);

  // New announcement form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Announcement['category']>('Umum');
  const [targetClass, setTargetClass] = useState('Umum');
  const [selectedForwardClasses, setSelectedForwardClasses] = useState<string[]>(['Umum']);
  const [photoUrl, setPhotoUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkLabel, setLinkLabel] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  // Comment input per announcement
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  const canCreate = currentUser?.role === 'guru' || currentUser?.isAdmin;
  const availableClassesList = ['Umum', 'VII A', 'VII B', 'VII C', 'VIII A', 'VIII B', 'VIII C', 'IX A', 'IX B', 'IX C'];

  const toggleForwardClass = (cls: string) => {
    if (cls === 'Umum') {
      setSelectedForwardClasses(['Umum']);
      setTargetClass('Umum');
      return;
    }

    let updated = selectedForwardClasses.filter(c => c !== 'Umum');
    if (updated.includes(cls)) {
      updated = updated.filter(c => c !== cls);
      if (updated.length === 0) {
        updated = ['Umum'];
      }
    } else {
      updated.push(cls);
    }
    setSelectedForwardClasses(updated);
    setTargetClass(updated.join(', '));
  };

  // Filter announcements based on category & class
  const filteredAnnouncements = announcements.filter(a => {
    // 1. Kategori filter
    if (activeCategory !== 'Semua' && a.category !== activeCategory) {
      return false;
    }

    const isTargetingUmum =
      !a.targetClass ||
      a.targetClass.toLowerCase().includes('umum') ||
      a.targetClass.toLowerCase().includes('semua') ||
      a.targetClasses?.some(c => c.toLowerCase().includes('umum') || c.toLowerCase().includes('semua'));

    // Khusus Siswa: hanya melihat kelasnya sendiri dan pengumuman Umum
    if (currentUser?.role === 'siswa') {
      const myClass = currentUser.kelas || 'VII A';
      const isTargetingMyClass =
        Boolean(a.targetClass && a.targetClass.includes(myClass)) ||
        Boolean(a.targetClasses && a.targetClasses.includes(myClass));

      if (classFilter === 'Aliran-Saya' || classFilter === 'Semua') {
        return isTargetingUmum || isTargetingMyClass;
      }
      if (classFilter === 'Umum') {
        return isTargetingUmum;
      }
      if (classFilter === myClass) {
        return isTargetingMyClass;
      }
      return isTargetingUmum || isTargetingMyClass;
    }

    // Untuk Guru / Admin
    if (classFilter === 'Semua') {
      return true;
    }
    if (classFilter === 'Umum') {
      return isTargetingUmum;
    }

    if (a.targetClass && a.targetClass.includes(classFilter)) return true;
    if (a.targetClasses && a.targetClasses.includes(classFilter)) return true;

    return false;
  });

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !currentUser) return;

    const finalTargetClass = selectedForwardClasses.includes('Umum')
      ? 'Umum'
      : selectedForwardClasses.join(', ');

    // Di pengumuman dan forum menggunakan USN (Nama Asli)
    addAnnouncement({
      authorId: currentUser.id,
      authorName: currentUser.usn || currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatar,
      authorMapel: currentUser.mapel || (currentUser.isAdmin ? 'Admin Sekolah' : 'Guru'),
      title,
      content,
      category,
      targetClass: finalTargetClass,
      targetClasses: selectedForwardClasses,
      photoUrl: photoUrl.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      linkUrl: linkUrl.trim() || undefined,
      linkLabel: linkLabel.trim() || undefined,
      attachedFileName: attachedFileName.trim() || undefined,
      isPinned,
    });

    // Reset
    setTitle('');
    setContent('');
    setSelectedForwardClasses(['Umum']);
    setTargetClass('Umum');
    setPhotoUrl('');
    setVideoUrl('');
    setLinkUrl('');
    setLinkLabel('');
    setAttachedFileName('');
    setIsPinned(false);
    setShowCreateModal(false);
  };

  const handleSendComment = (announcementId: string) => {
    const text = commentInputs[announcementId]?.trim();
    if (!text || !currentUser) return;
    addComment(announcementId, text);
    setCommentInputs(prev => ({ ...prev, [announcementId]: '' }));
    // Automatically expand comments
    setExpandedComments(prev => ({ ...prev, [announcementId]: true }));
  };

  const categories = ['Semua', 'Umum', 'Tugas', 'Ujian', 'Kegiatan', 'Prestasi', 'Cerdas Cermat'];

  return (
    <div className="space-y-6">
      
      {/* School Hero Banner Card (Customizable by Admin) */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm border border-slate-200 group">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/30 z-10" />
        <img
          src={branding.heroBannerUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80'}
          alt={branding.schoolName}
          className="w-full h-48 sm:h-56 object-cover object-center group-hover:scale-102 transition-transform duration-700"
        />
        <div className="absolute inset-0 z-20 p-6 sm:p-8 flex flex-col justify-between text-white">
          <div className="flex items-center justify-between">
            <span
              className="text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md border border-white/20 text-white"
            >
              PINTAR - SMPI AL-AKBAR
            </span>
            <span className="text-xs text-white/80 font-medium">
              SMP Islam Al-Akbar • T.A. {branding.academicYear}
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-xs">
              {branding.schoolName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl font-normal drop-shadow-xs italic">
              "{branding.schoolMotto}"
            </p>
          </div>

          {/* Mini Stats Ribbon */}
          <div className="flex items-center gap-4 text-xs font-medium text-white/90 pt-1 border-t border-white/10">
            <span>👥 {users.filter(u => u.role === 'siswa').length} Siswa Terdaftar</span>
            <span>👨‍🏫 {users.filter(u => u.role === 'guru').length} Guru Mapel</span>
            <span>📝 {quizzes.length} Kuis Aktif</span>
            <span>📂 {assignments.length} Tugas Terbuka</span>
          </div>
        </div>
      </div>

      {/* Composer trigger box for teachers/admins */}
      {canCreate ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center space-x-3">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={currentUser?.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
            />
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex-1 text-left px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs sm:text-sm font-medium border border-slate-200 transition-colors flex items-center justify-between"
            >
              <span>Bagikan pengumuman baru & pilih kelas tujuan yang ingin diteruskan...</span>
              <Plus className="w-4 h-4 text-slate-400 shrink-0" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 font-medium text-slate-600"
            >
              <ImageIcon className="w-4 h-4 text-emerald-500" />
              <span>Unggah Foto</span>
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 font-medium text-slate-600"
            >
              <Video className="w-4 h-4 text-red-500" />
              <span>Sematkan Video</span>
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 font-medium text-slate-600"
            >
              <FileText className="w-4 h-4 text-blue-500" />
              <span>Lampirkan Dokumen</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center space-x-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
              style={{ backgroundColor: branding.primaryColor }}
            >
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Portal Pengumuman Khusus Siswa: <span className="text-emerald-700 font-extrabold">{currentUser?.kelas ? `Kelas ${currentUser.kelas}` : 'Umum'}</span>
              </p>
              <p className="text-[11px] text-slate-600">
                Aliran pengumuman disesuaikan otomatis dengan kelas yang Anda pilih saat login. Anda hanya melihat materi yang diteruskan untuk kelas Anda dan pengumuman umum.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-emerald-300 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500">Kelas Aktif:</span>
              <select
                value={currentUser?.kelas || 'VII A'}
                onChange={(e) => {
                  const newCls = e.target.value;
                  setUserClass(newCls);
                  setClassFilter('Aliran-Saya');
                }}
                className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-300 cursor-pointer outline-hidden hover:bg-emerald-100 transition-colors"
                title="Klik untuk langsung mengganti kelas Anda"
              >
                <option value="VII A">VII A</option>
                <option value="VII B">VII B</option>
                <option value="VII C">VII C</option>
                <option value="VIII A">VIII A</option>
                <option value="VIII B">VIII B</option>
                <option value="VIII C">VIII C</option>
                <option value="IX A">IX A</option>
                <option value="IX B">IX B</option>
                <option value="IX C">IX C</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Class Selector Bar: Tampilan kelas berbeda sesuai announcement kelas itu */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pilih Aliran Kelas:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {currentUser?.role === 'siswa' ? (
              // Siswa hanya melihat aliran kelasnya sendiri dan pengumuman Umum
              <>
                <button
                  type="button"
                  onClick={() => setClassFilter('Aliran-Saya')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    classFilter === 'Aliran-Saya'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <span>⭐ Aliran Saya ({currentUser.kelas || 'VII A'} & Umum)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setClassFilter(currentUser.kelas || 'VII A')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    classFilter === (currentUser.kelas || 'VII A')
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>Khusus {currentUser.kelas || 'VII A'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setClassFilter('Umum')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    classFilter === 'Umum'
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <span>Pengumuman Umum</span>
                </button>
              </>
            ) : (
              // Guru & Admin dapat memantau seluruh kelas
              <>
                <button
                  type="button"
                  onClick={() => setClassFilter('Semua')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    classFilter === 'Semua'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semua Aliran
                </button>

                <button
                  type="button"
                  onClick={() => setClassFilter('Umum')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    classFilter === 'Umum'
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  Umum
                </button>

                {['VII A', 'VII B', 'VII C', 'VIII A', 'VIII B', 'VIII C', 'IX A', 'IX B', 'IX C'].map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setClassFilter(cls)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      classFilter === cls
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-150 border border-slate-200'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
              style={activeCategory === cat ? { backgroundColor: branding.primaryColor } : {}}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 whitespace-nowrap font-medium">
          {filteredAnnouncements.length} Pengumuman ({classFilter === 'Aliran-Saya' ? 'Aliran Terpadu' : classFilter === 'Umum' ? 'Pengumuman Umum' : classFilter === 'Semua' ? 'Semua Aliran' : `Kelas ${classFilter}`})
        </span>
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white rounded-3xl border border-emerald-100 p-10 sm:p-14 text-center shadow-xs">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto mb-4 flex items-center justify-center shadow-inner">
              <Megaphone className="w-8 h-8 text-emerald-600" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
              Pengumuman Kosong Sementara
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-3">
              Belum Ada Pengumuman yang Diterbitkan
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
              Arsip pengumuman saat ini telah dikosongkan. Ustadz dan Ustadzah SMPI AL-AKBAR dapat membuat pengumuman baru dengan foto maupun video pembelajaran menggunakan formulir di atas.
            </p>
            {canCreate && (
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-transform active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Unggah Pengumuman Pertama</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          filteredAnnouncements.map((ann) => {
            const isAuthorOrAdmin =
              currentUser?.id === ann.authorId || currentUser?.isAdmin;
            const commentsOpen = expandedComments[ann.id] ?? false;

            return (
              <article
                key={ann.id}
                className={`bg-white rounded-2xl border transition-all shadow-xs overflow-hidden ${
                  ann.isPinned ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
                }`}
              >
                {/* Header */}
                <div className="p-4 sm:p-5 pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={ann.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                        alt={ann.authorName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            {ann.authorName}
                          </h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {ann.authorMapel || 'Guru'}
                          </span>
                          {ann.isPinned && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                              <Pin className="w-2.5 h-2.5" /> Disematkan
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(ann.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          • Target: <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">🎯 {ann.targetClasses?.length ? ann.targetClasses.join(', ') : (ann.targetClass || 'Umum')}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {ann.category}
                      </span>
                      {isAuthorOrAdmin && (
                        <button
                          type="button"
                          onClick={() => deleteAnnouncement(ann.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Hapus Pengumuman"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="mt-3">
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {ann.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed whitespace-pre-line">
                      {ann.content}
                    </p>
                  </div>

                  {/* Multimedia (Photos, Videos, External Links, File Attachment) */}
                  <MediaRenderer
                    photoUrl={ann.photoUrl}
                    videoUrl={ann.videoUrl}
                    linkUrl={ann.linkUrl}
                    linkLabel={ann.linkLabel}
                    attachedFileName={ann.attachedFileName}
                    attachedFileUrl={ann.attachedFileUrl}
                  />
                </div>

                {/* Footer action bar */}
                <div className="px-4 sm:px-5 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedComments(prev => ({
                        ...prev,
                        [ann.id]: !commentsOpen,
                      }))
                    }
                    className="flex items-center gap-1.5 font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{ann.comments.length} Komentar Kelas</span>
                  </button>

                  <span className="text-[11px] text-slate-400">
                    Sistem Notifikasi PINTAR Terintegrasi
                  </span>
                </div>

                {/* Comments Section */}
                <div className="p-4 sm:p-5 pt-3 bg-slate-50/40 border-t border-slate-100 space-y-3">
                  {/* Comments list */}
                  {ann.comments.length > 0 && (
                    <div className="space-y-2.5">
                      {ann.comments.map((comm) => (
                        <div key={comm.id} className="flex items-start space-x-2.5 text-xs">
                          <img
                            src={comm.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80'}
                            alt={comm.authorName}
                            className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                          />
                          <div className="flex-1 bg-white p-2.5 rounded-xl border border-slate-200">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">
                                {comm.authorName}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(comm.createdAt).toLocaleTimeString('id-ID', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-slate-700 mt-1 leading-relaxed">
                              {comm.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add comment input */}
                  {currentUser ? (
                    <div className="flex items-center space-x-2 pt-1">
                      <img
                        src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80'}
                        alt={currentUser.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                      />
                      <input
                        type="text"
                        value={commentInputs[ann.id] || ''}
                        onChange={(e) =>
                          setCommentInputs(prev => ({
                            ...prev,
                            [ann.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSendComment(ann.id);
                          }
                        }}
                        placeholder="Tulis tanggapan atau pertanyaan tentang materi ini..."
                        className="flex-1 px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendComment(ann.id)}
                        disabled={!commentInputs[ann.id]?.trim()}
                        className="p-2 rounded-xl text-white disabled:opacity-40 transition-transform active:scale-95"
                        style={{ backgroundColor: branding.primaryColor }}
                        title="Kirim Komentar"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic text-center">
                      Silakan login terlebih dahulu untuk memberikan tanggapan kelas.
                    </p>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Modal Buat Pengumuman Baru (Khusus Guru & Admin) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Buat Pengumuman Kelas Baru</h3>
                  <p className="text-[11px] text-slate-500">Pilih kelas yang ingin diteruskan pengumumannya</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Judul Pengumuman *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Petunjuk Ujian Tengah Semester & Video Pembahasan"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden bg-white"
                >
                  <option value="Umum">Umum</option>
                  <option value="Tugas">Tugas</option>
                  <option value="Ujian">Ujian</option>
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Prestasi">Prestasi</option>
                  <option value="Cerdas Cermat">Cerdas Cermat</option>
                </select>
              </div>

              {/* Fitur Guru: Pilih mau diteruskan buat kelas apa announcementnya */}
              <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-extrabold text-emerald-950">
                    🎯 Teruskan Pengumuman Untuk Kelas Apa Saja? *
                  </label>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    Pilih satu atau beberapa kelas
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {availableClassesList.map((cls) => {
                    const isSelected = selectedForwardClasses.includes(cls);
                    return (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => toggleForwardClass(cls)}
                        className={`px-3 py-2 rounded-xl font-bold text-xs transition-all border flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs scale-102'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                        }`}
                      >
                        <span>{cls}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 ml-1 text-white shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-emerald-800 mt-2 font-medium">
                  📢 Pengumuman akan langsung tampil di beranda portal santri yang memilih kelas ini saat login: <span className="font-bold underline">{selectedForwardClasses.join(', ')}</span>.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Isi Pesan / Instruksi Pembelajaran *
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan detail materi, instruksi tugas, atau informasi pengumuman..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              {/* Multimedia section */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <p className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Lampiran Multimedia (Foto & Video)
                </p>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">URL Foto / Gambar</label>
                    <span className="text-[10px] text-slate-400">Bisa gunakan Unsplash / link gambar langsung</span>
                  </div>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                  {/* Preset photo pills */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] text-slate-400">Contoh Cepat:</span>
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80')}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      🧪 Lab Sains
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80')}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      🏫 Kampus Sekolah
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">URL Video (YouTube / MP4)</label>
                    <span className="text-[10px] text-slate-400">Sematkan video pembelajaran</span>
                  </div>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                  {/* Preset video pills */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] text-slate-400">Contoh Cepat:</span>
                    <button
                      type="button"
                      onClick={() => setVideoUrl('https://www.youtube.com/watch?v=E7wJTI-1dvQ')}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      ▶ Video Parabola Matematika
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">Tautan Link Eksternal (Opsional)</label>
                    <span className="text-[10px] text-slate-400">Link Google Drive, Website, atau Sumber Belajar</span>
                  </div>
                  <div className="space-y-1.5">
                    <input
                      type="url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://drive.google.com/... atau https://..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                    <input
                      type="text"
                      value={linkLabel}
                      onChange={(e) => setLinkLabel(e.target.value)}
                      placeholder="Label Tombol Link (Contoh: Buka Lembar Kerja Siswa Google Drive)"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-hidden text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lampiran Dokumen (Opsional)
                  </label>
                  <input
                    type="text"
                    value={attachedFileName}
                    onChange={(e) => setAttachedFileName(e.target.value)}
                    placeholder="Contoh: Modul_Pembelajaran_Fungsi_Kuadrat.pdf"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Pin switch */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="rounded-sm text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span className="font-semibold text-slate-700">Sematkan di bagian teratas (Pin)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white font-bold shadow-sm transition-transform active:scale-95"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  Terbitkan Pengumuman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
