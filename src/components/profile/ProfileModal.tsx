import React, { useState, useRef } from 'react';
import {
  X,
  User as UserIcon,
  Mail,
  Lock,
  GraduationCap,
  BookOpen,
  Award,
  Key,
  CheckCircle2,
  AlertCircle,
  Camera,
  Upload,
  Send,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Clock,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserBadgeList } from '../common/UserBadge';
import { DownloadInstallModal } from '../common/DownloadInstallModal';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    updateUserProfile,
    updateUserPasswordByModerator,
    setUserClass,
    sendAccountBackupToEmail,
    quizAttempts,
    submissions,
    branding,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [usn, setUsn] = useState(currentUser?.usn || currentUser?.name || '');
  const [displayName, setDisplayName] = useState(currentUser?.displayName || currentUser?.name || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [bio, setBio] = useState(currentUser?.bio || 'Belajar tekun di SMPI AL-AKBAR ✨');
  const [kelas, setKelas] = useState(currentUser?.kelas || 'VII A');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  if (!isOpen || !currentUser) return null;

  const myAttempts = quizAttempts.filter(a => a.studentId === currentUser.id);
  const mySubmissions = submissions.filter(s => s.studentId === currentUser.id);

  // Quick avatar suggestions
  const avatarPresets = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  ];

  // Handle local image file upload (ambil foto / upload dari galeri)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      if (dataUrl) {
        setAvatar(dataUrl);
        updateUserProfile(currentUser.id, { avatar: dataUrl });
        setProfileSuccess('Foto profil baru berhasil diunggah!');
        setTimeout(() => setProfileSuccess(''), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usn.trim()) {
      alert('Nama Asli (USN) tidak boleh kosong.');
      return;
    }
    const finalDisplayName = displayName.trim() || usn.trim();
    updateUserProfile(currentUser.id, {
      usn: usn.trim(),
      displayName: finalDisplayName,
      name: finalDisplayName,
      avatar: avatar.trim() || undefined,
      bio: bio.trim() || undefined,
      ...(currentUser.role === 'siswa' ? { kelas } : {}),
    });
    setProfileSuccess('Profil dan pilihan kelas berhasil diperbarui!');
    setTimeout(() => setProfileSuccess(''), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (newPassword.length < 5) {
      setPassError('Kata sandi baru minimal 5 karakter.');
      return;
    }

    updateUserPasswordByModerator(currentUser.id, newPassword);
    setPassSuccess('Kata sandi Anda berhasil langsung diperbarui!');
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPassSuccess(''), 4000);
  };

  const handleSendBackup = () => {
    const res = sendAccountBackupToEmail(currentUser.id);
    setBackupStatus(res.message);
    setTimeout(() => setBackupStatus(null), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative animate-in fade-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-5 border-b border-slate-100">
          
          {/* Avatar with change/upload overlay + Bio Bubble underneath */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative group">
              <img
                src={avatar || currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                alt={currentUser.displayName || currentUser.usn}
                className="w-20 h-20 rounded-2xl object-cover ring-3 ring-emerald-500 shadow-md"
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 text-white rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Upload / Ganti Foto"
              >
                <Camera className="w-6 h-6" />
                <span className="text-[10px] font-bold mt-1">Ganti Foto</span>
              </button>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Bubble chat bio di bawah PP */}
            <div className="mt-2 relative flex flex-col items-center max-w-[170px]">
              <div className="w-2 h-2 bg-emerald-100 rotate-45 border-l border-t border-emerald-300 -mb-1 z-10" />
              <div className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-300 text-[10px] text-emerald-950 font-semibold shadow-2xs text-center leading-tight">
                💭 "{currentUser.bio || bio || 'Belajar tekun di SMPI AL-AKBAR ✨'}"
              </div>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                {currentUser.displayName || currentUser.name}
              </h3>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  currentUser.isAdmin
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : currentUser.role === 'guru'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {currentUser.isAdmin ? 'ADMIN SEKOLAH' : currentUser.role.toUpperCase()}
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-0.5 font-semibold">
              {currentUser.usn || currentUser.name}
            </p>

            <p className="text-xs font-semibold text-slate-700 mt-0.5">
              {currentUser.role === 'guru'
                ? `Guru Mapel: ${currentUser.mapel} • NIP: ${currentUser.nip || '-'}`
                : `Kelas: ${currentUser.kelas} • NISN: ${currentUser.nisn || '-'}`}
            </p>

            {/* Badges: ONLY displayed if user is admin */}
            {currentUser.isAdmin && currentUser.badges && (
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400 font-semibold">Badge Admin:</span>
                <UserBadgeList badges={currentUser.badges} size="xs" forceShowForAdminOnly={true} />
              </div>
            )}
          </div>
        </div>

        {/* Email Privacy Notice (Pengguna lain tidak akan tau email kita) */}
        <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950">
            <p className="font-extrabold">Akun Gmail Anda ({currentUser.email})</p>
            <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
              <strong>Privasi Terjamin:</strong> Pengguna lain (siswa & guru) tidak akan pernah bisa melihat alamat email Gmail Anda. Di forum, tugas, dan chat, yang terlihat hanyalah <strong>Nama Buatan</strong> dan <strong>USN</strong>.
            </p>
          </div>
        </div>

        {/* Feature: Share data otomatis ke email pembuat akun untuk jaga-jaga */}
        <div className="mt-3 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-amber-950">Cadangan Kredensial Akun</p>
              <p className="text-[11px] text-amber-800">
                {currentUser.emailBackupSentAt
                  ? `Salinan terakhir otomatis dikirim pada: ${new Date(currentUser.emailBackupSentAt).toLocaleString('id-ID')}`
                  : 'Salinan otomatis tersimpan di basis data admin sekolah.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSendBackup}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim Salinan ke Gmail</span>
          </button>
        </div>

        {backupStatus && (
          <div className="mt-2 p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{backupStatus}</span>
          </div>
        )}

        {/* Edit USN (Nama Asli) & Nama Buatan Terserah Kita & Ganti Foto */}
        <form onSubmit={handleUpdateProfile} className="mt-5 space-y-3.5 text-xs">
          <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5">
            <UserIcon className="w-4 h-4 text-emerald-600" />
            <span>Pengaturan Identitas & Foto Profil</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Buatan (Terserah Kita)
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Contoh: Sang Penakluk, Ksatria..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Nama panggilan bebas yang tampil di chat & forum
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Asli (USN)
              </label>
              <input
                type="text"
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                required
                placeholder="Nama asli santri / guru"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Nama asli resmi sekolah untuk sertifikat & penilaian
              </span>
            </div>
          </div>

          {/* Opsi Ganti Kelas (Khusus Siswa) */}
          {currentUser.role === 'siswa' && (
            <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200">
              <label className="block font-extrabold text-emerald-950 mb-1">
                🏫 Ganti Kelas Siswa Anda
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5 mt-1">
                {['VII A', 'VII B', 'VII C', 'VIII A', 'VIII B', 'VIII C', 'IX A', 'IX B', 'IX C'].map((cls) => {
                  const isCurrent = kelas === cls;
                  return (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setKelas(cls)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border text-center ${
                        isCurrent
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs scale-102'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-100/50'
                      }`}
                    >
                      {cls}
                    </button>
                  );
                })}
              </div>
              <span className="text-[10px] text-emerald-800 mt-1.5 block font-medium">
                Aliran pengumuman portal Anda akan otomatis disesuaikan dengan kelas yang dipilih.
              </span>
            </div>
          )}

          {/* Input Bio / Status WhatsApp */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Bio / Status Santri (Bentuk Bubble Chat di Bawah Foto)
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Contoh: Belajar tekun, raih ridho Ilahi ✨"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-medium"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Bio ini akan muncul otomatis sebagai bubble chat di bawah foto profil Anda saat teman mengobrol di sistem chat.
            </span>
          </div>

          {/* Quick Avatar options & upload button */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Pilihan Foto Profil (Upload File atau Pilih Cepat)
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Foto dari Perangkat</span>
              </button>

              {avatarPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(preset)}
                  className={`w-8 h-8 rounded-xl overflow-hidden ring-2 transition-transform hover:scale-105 ${
                    avatar === preset ? 'ring-emerald-600 scale-105' : 'ring-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {profileSuccess && (
            <p className="text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {profileSuccess}
            </p>
          )}

          <button
            type="submit"
            className="px-4 py-2 rounded-xl font-bold text-white shadow-xs transition-transform active:scale-95"
            style={{ backgroundColor: branding.primaryColor }}
          >
            Simpan Perubahan Identitas
          </button>
        </form>

        {/* Change password section */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-3 text-xs">
          <div>
            <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs">
              <Key className="w-4 h-4 text-slate-700" />
              <span>Ganti Kata Sandi Akun</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Kata sandi akan tersimpan otomatis oleh guru admin dan disalin ke email Anda.
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Ketik Kata Sandi Baru *
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ketik kata sandi baru (minimal 5 karakter)..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-semibold"
              />
            </div>

            {passError && (
              <p className="text-red-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {passError}
              </p>
            )}

            {passSuccess && (
              <p className="text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" /> {passSuccess}
              </p>
            )}

            <button
              type="submit"
              className="px-4 py-2 rounded-xl font-bold text-white shadow-xs transition-transform active:scale-95"
              style={{ backgroundColor: branding.primaryColor }}
            >
              Langsung Ganti Kata Sandi
            </button>
          </form>
        </div>

        {/* Unduh & Pasang APK PINTAR Banner */}
        <div className="mt-5 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div>
            <p className="font-extrabold text-xs flex items-center gap-1.5">
              <Download className="w-4 h-4 text-amber-300" />
              <span>Unduh Aplikasi PINTAR</span>
            </p>
            <p className="text-[11px] text-emerald-100 mt-0.5">
              Pasang di layar utama HP Android/iPhone atau salin link untuk akses cepat.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowDownloadModal(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shrink-0 shadow-2xs transition-transform active:scale-95"
          >
            Buka Link Unduh
          </button>
        </div>

      </div>

      <DownloadInstallModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />
    </div>
  );
};
