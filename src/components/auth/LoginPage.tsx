import React, { useState, useRef } from 'react';
import {
  GraduationCap,
  BookOpen,
  Mail,
  Lock,
  User as UserIcon,
  Crown,
  Flame,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  School,
  KeyRound,
  Camera,
  Upload,
  Send,
  Eye,
  EyeOff,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandIcon } from '../common/BrandIcon';
import { DownloadInstallModal } from '../common/DownloadInstallModal';

export const LoginPage: React.FC = () => {
  const {
    login,
    register,
    resetPassword,
    branding,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active role tab: 'siswa' or 'guru'
  const [roleTab, setRoleTab] = useState<'siswa' | 'guru'>('siswa');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usn, setUsn] = useState(''); // Nama Asli
  const [displayName, setDisplayName] = useState(''); // Nama Buatan terserah kita
  const [avatar, setAvatar] = useState(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  );
  const [kelas, setKelas] = useState('VII A');
  const [loginClass, setLoginClass] = useState('VII A');
  const [mapel, setMapel] = useState('PAI & Tahfidz');
  const [nisn, setNisn] = useState('');
  const [nip, setNip] = useState('');

  // Forgot password fields
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Status messages
  const [errorMessage, setErrorMessage] = useState('');
  const [regSuccessMessage, setRegSuccessMessage] = useState('');

  const avatarPresets = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  ];

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatar(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const res = login(email, password, roleTab === 'siswa' ? loginClass : undefined);
    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setRegSuccessMessage('');

    if (!usn.trim()) {
      setErrorMessage('Nama Asli (USN) wajib diisi.');
      return;
    }

    if (roleTab === 'siswa' && !kelas) {
      setErrorMessage('Pilih kelas SMP Anda.');
      return;
    }
    if (roleTab === 'guru' && !mapel.trim()) {
      setErrorMessage('Isi mata pelajaran yang diampu.');
      return;
    }

    const finalDisplayName = displayName.trim() || usn.trim();

    const res = register({
      name: finalDisplayName,
      usn: usn.trim(),
      displayName: finalDisplayName,
      email: email.trim(),
      password: password.trim(),
      role: roleTab,
      kelas: roleTab === 'siswa' ? kelas : undefined,
      mapel: roleTab === 'guru' ? mapel.trim() : undefined,
      nisn: nisn.trim() || undefined,
      nip: nip.trim() || undefined,
      avatar: avatar,
    });

    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setForgotSuccess('');

    const res = resetPassword(forgotEmail, forgotNewPass);
    if (res.success) {
      setForgotSuccess('Kata sandi berhasil diperbarui! Silakan masuk kembali.');
      setTimeout(() => {
        setIsForgotMode(false);
        setEmail(forgotEmail);
        setPassword(forgotNewPass);
      }, 1500);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50/40 text-slate-800 flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      
      {/* Top Header Bar */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-emerald-100 py-3.5 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-amber-300 flex items-center justify-center p-0.5 shadow-2xs overflow-hidden">
              <BrandIcon className="w-9 h-9 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-emerald-950 tracking-tight">
                  PINTAR - SMPI AL-AKBAR
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 font-bold hidden sm:block">
                Beriman, Berbudi, Berprestasi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Privasi Gmail Terjamin</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl w-full mx-auto px-4 py-8 sm:py-12 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left 6 cols: School Welcome & Identity Protection Showcase */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Sistem Akun Gmail Aman & Privasi Terlindungi</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Selamat Datang di <br />
                <span className="text-emerald-700 underline decoration-amber-400 decoration-wavy decoration-2">
                  PINTAR - SMPI AL-AKBAR
                </span>
              </h1>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Portal akademik terpadu SMP Islam Al-Akbar. Masuk menggunakan akun Gmail Anda untuk mengakses tugas, kuis kode guru, kalender tenggat, serta bimbingan akademik.
              </p>
            </div>

            {/* Showcase: Key Protection & Features */}
            <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-3">
              <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                Ketentuan & Keamanan Akun SMPI AL-AKBAR:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                  <p className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-emerald-700" />
                    <span>Email Gmail Privat</span>
                  </p>
                  <p className="text-[11px] text-emerald-900/80 mt-1 leading-snug">
                    Pengguna lain tidak akan pernah tahu email Gmail Anda.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200">
                  <p className="font-extrabold text-amber-950 flex items-center gap-1.5">
                    <UserIcon className="w-4 h-4 text-amber-700" />
                    <span>Nama Buatan & USN</span>
                  </p>
                  <p className="text-[11px] text-amber-900/80 mt-1 leading-snug">
                    Bebas memakai Nama Buatan di forum, dengan Nama Asli (USN) tersimpan.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-orange-50/80 border border-orange-200">
                  <p className="font-extrabold text-orange-950 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-orange-700" />
                    <span>Foto Bebas Diubah</span>
                  </p>
                  <p className="text-[11px] text-orange-900/80 mt-1 leading-snug">
                    Bisa upload foto pribadi dari galeri atau ambil avatar santri.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Send className="w-4 h-4 text-emerald-600" />
                    <span>Arsip Otomatis ke Email</span>
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    Data disimpan oleh admin & disalin ke Gmail Anda untuk jaga-jaga.
                  </p>
                </div>
              </div>
            </div>

            {/* Official App Download & 1x Login Persistence Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Unduh & Pasang APK PINTAR</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                  Resmi SMPI
                </span>
              </div>
              <p className="text-[11px] text-emerald-100 leading-snug">
                Pasang aplikasi di HP Android/iPhone atau salin tautan portal resmi untuk kemudahan akses setiap saat.
              </p>
              <button
                type="button"
                onClick={() => setShowDownloadModal(true)}
                className="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-slate-900" />
                <span>Buka Link Download & Petunjuk Instalasi</span>
              </button>
            </div>

            {/* Catatan Sesi Login 1x */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs space-y-1">
              <p className="font-extrabold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Sesi Login 1 Kali Saja:</span>
              </p>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                Sekali masuk, akun Anda akan tetap aktif di perangkat ini tanpa perlu login berulang-ulang, kecuali jika Anda menekan tombol <strong>Keluar (Log Out)</strong>.
              </p>
            </div>

          </div>

          {/* Right 6 cols: The 2-Option Login / Register Card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xl shadow-emerald-900/5 relative">
              
              {/* TWO CLEAR OPTIONS TO LOG IN: SISWA VS GURU */}
              {!isForgotMode && (
                <div className="mb-6">
                  <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider text-center">
                    Pilih Peran Masuk:
                  </p>
                  <div className="grid grid-cols-2 p-1.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs font-extrabold">
                    <button
                      type="button"
                      onClick={() => {
                        setRoleTab('siswa');
                        setErrorMessage('');
                      }}
                      className={`py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                        roleTab === 'siswa'
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-600'
                          : 'text-slate-600 hover:text-emerald-900 hover:bg-white/60'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Masuk Sebagai Siswa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRoleTab('guru');
                        setErrorMessage('');
                      }}
                      className={`py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                        roleTab === 'guru'
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-600'
                          : 'text-slate-600 hover:text-emerald-900 hover:bg-white/60'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Masuk Sebagai Guru</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Error Message Box */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Message Box */}
              {regSuccessMessage && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{regSuccessMessage}</span>
                </div>
              )}

              {/* VIEW 1: NORMAL LOGIN */}
              {!isRegisterMode && !isForgotMode && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                  <div className="text-left pb-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900">
                        {roleTab === 'siswa' ? 'Login Santri / Siswa SMP' : 'Login Ustadz & Ustadzah SMP'}
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Gunakan akun Gmail terdaftar
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        roleTab === 'siswa'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {roleTab}
                    </span>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Akun Gmail Anda *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contoh: namaanda@gmail.com"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      🔒 Email Anda bersifat privat, pengguna lain tidak akan bisa melihatnya.
                    </span>
                  </div>

                  {/* Input Kelas untuk Siswa saat Login */}
                  {roleTab === 'siswa' && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-slate-700">Pilih Kelas Siswa Anda *</label>
                        <span className="text-[10px] text-emerald-700 font-bold">Wajib diisi</span>
                      </div>
                      <div className="relative">
                        <GraduationCap className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                        <select
                          required
                          value={loginClass}
                          onChange={(e) => setLoginClass(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-emerald-200 outline-hidden focus:ring-2 focus:ring-emerald-500 font-bold bg-white text-slate-800"
                        >
                          <option value="VII A">VII A (Kelas 7)</option>
                          <option value="VII B">VII B (Kelas 7)</option>
                          <option value="VII C">VII C (Kelas 7)</option>
                          <option value="VIII A">VIII A (Kelas 8)</option>
                          <option value="VIII B">VIII B (Kelas 8)</option>
                          <option value="VIII C">VIII C (Kelas 8)</option>
                          <option value="IX A">IX A (Kelas 9)</option>
                          <option value="IX B">IX B (Kelas 9)</option>
                          <option value="IX C">IX C (Kelas 9)</option>
                        </select>
                      </div>
                      <span className="text-[10px] text-emerald-800 mt-1 block">
                        📢 Pengumuman beranda akan disesuaikan secara otomatis khusus untuk kelas yang Anda pilih.
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-slate-700">Kata Sandi *</label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotMode(true);
                          setErrorMessage('');
                        }}
                        className="text-amber-700 hover:text-amber-800 hover:underline text-[11px] font-semibold"
                      >
                        Lupa kata sandi?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-extrabold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/30 transition-transform active:scale-95 flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Masuk ke Portal PINTAR</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Belum memiliki akun?</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegisterMode(true);
                        setErrorMessage('');
                      }}
                      className="font-bold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1"
                    >
                      <span>Daftar Akun Baru</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}

              {/* VIEW 2: REGISTER NEW ACCOUNT */}
              {isRegisterMode && !isForgotMode && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                  <div className="text-left pb-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900">
                        Pendaftaran Akun ({roleTab === 'siswa' ? 'Siswa' : 'Guru'})
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Data disimpan admin & salinan dikirim otomatis ke Gmail Anda
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsRegisterMode(false)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800"
                    >
                      Batal
                    </button>
                  </div>

                  {/* Dual Names: USN (Nama Asli) & Nama Buatan Terserah Kita */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Nama Asli (USN) *
                      </label>
                      <input
                        type="text"
                        required
                        value={usn}
                        onChange={(e) => setUsn(e.target.value)}
                        placeholder={roleTab === 'siswa' ? 'Nama asli santri' : 'Nama asli ustadz/ustadzah'}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        USN = Nama asli resmi di sekolah
                      </span>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Nama Buatan (Terserah Kita)
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Contoh: Ksatria Al-Akbar, Sang Juara..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Nama panggilan bebas untuk forum/chat
                      </span>
                    </div>
                  </div>

                  {/* Gmail & Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Akun Gmail *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@gmail.com"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                      <span className="text-[10px] text-emerald-700 mt-0.5 block">
                        🔒 Dirahasiakan dari pengguna lain
                      </span>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Kata Sandi *</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimal 5 karakter"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Tersimpan di admin & dikirim ke Gmail
                      </span>
                    </div>
                  </div>

                  {/* Role Specific fields */}
                  {roleTab === 'siswa' ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Kelas SMP *</label>
                        <select
                          value={kelas}
                          onChange={(e) => setKelas(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden bg-white font-semibold"
                        >
                          <option value="VII A">VII A (Kelas 7)</option>
                          <option value="VII B">VII B (Kelas 7)</option>
                          <option value="VII C">VII C (Kelas 7)</option>
                          <option value="VIII A">VIII A (Kelas 8)</option>
                          <option value="VIII B">VIII B (Kelas 8)</option>
                          <option value="VIII C">VIII C (Kelas 8)</option>
                          <option value="IX A">IX A (Kelas 9)</option>
                          <option value="IX B">IX B (Kelas 9)</option>
                          <option value="IX C">IX C (Kelas 9)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">NISN (Opsional)</label>
                        <input
                          type="text"
                          value={nisn}
                          onChange={(e) => setNisn(e.target.value)}
                          placeholder="012923..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Guru Mapel SMP *</label>
                        <input
                          type="text"
                          required
                          value={mapel}
                          onChange={(e) => setMapel(e.target.value)}
                          placeholder="Contoh: PAI, Matematika, IPA..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">NIP (Opsional)</label>
                        <input
                          type="text"
                          value={nip}
                          onChange={(e) => setNip(e.target.value)}
                          placeholder="1987..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden"
                        />
                      </div>
                    </div>
                  )}

                  {/* Foto Profil: Ambil Foto / Upload File */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Foto Profil (Bisa Diubah / Diunggah):
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-emerald-500 shrink-0">
                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                      </div>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Foto Perangkat</span>
                      </button>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarFile}
                        accept="image/*"
                        className="hidden"
                      />

                      <div className="flex items-center gap-1 ml-auto">
                        {avatarPresets.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAvatar(preset)}
                            className={`w-7 h-7 rounded-lg overflow-hidden ring-2 transition-transform ${
                              avatar === preset ? 'ring-emerald-600 scale-110' : 'ring-transparent opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={preset} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Automated Share Notice */}
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
                    <Send className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Data akun & kata sandi akan disimpan oleh guru admin dan <strong>otomatis disalin ke Gmail Anda</strong> untuk cadangan jaga-jaga.
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-extrabold text-sm text-white bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-600/30 transition-transform active:scale-95 flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Daftarkan Akun & Kirim Salinan ke Gmail</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setIsRegisterMode(false)}
                      className="text-xs font-semibold text-slate-500 hover:text-emerald-700"
                    >
                      Sudah punya akun? Masuk di sini
                    </button>
                  </div>
                </form>
              )}

              {/* VIEW 3: FORGOT PASSWORD */}
              {isForgotMode && (
                <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
                  <div className="text-left pb-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900">Pemulihan Kata Sandi</h2>
                      <p className="text-[11px] text-slate-500">
                        Atau hubungi Ustadz Admin untuk reset langsung dari master data
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotMode(false);
                        setForgotSuccess('');
                      }}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800"
                    >
                      Kembali
                    </button>
                  </div>

                  {forgotSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{forgotSuccess}</span>
                    </div>
                  )}

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Gmail Terdaftar *</label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="nama@gmail.com"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kata Sandi Baru *</label>
                    <input
                      type="password"
                      required
                      value={forgotNewPass}
                      onChange={(e) => setForgotNewPass(e.target.value)}
                      placeholder="Ketik kata sandi baru..."
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-600/20 transition-transform active:scale-95"
                  >
                    Simpan Kata Sandi Baru
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white/80 border-t border-slate-100 py-4 px-4 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">
          PINTAR - SMPI AL-AKBAR &bull; SMP Islam Terpadu Al-Akbar
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Data login tersimpan aman oleh admin sekolah &bull; Salinan otomatis dikirimkan ke Gmail pengguna
        </p>
      </footer>

      <DownloadInstallModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />

    </div>
  );
};
