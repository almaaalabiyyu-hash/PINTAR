import React, { useState } from 'react';
import {
  Palette,
  Users,
  ShieldAlert,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Sparkles,
  School,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Search,
  Filter,
  Save,
  RotateCcw,
  Award,
  Mail,
  Send,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { THEME_COLORS, PRESET_BANNERS, PRESET_ICONS } from '../../utils/theme';
import { BrandIcon } from '../common/BrandIcon';
import { UserBadgeList, UserBadgeItem } from '../common/UserBadge';

export const AdminPanel: React.FC = () => {
  const {
    currentUser,
    users,
    branding,
    updateBranding,
    updateUserPasswordByModerator,
    updateUserBadges,
    sendAccountBackupToEmail,
    adminSurveys,
    reviewAdminSurvey,
    resetAllDataToDefault,
  } = useApp();

  // Active Admin Section: 'branding' | 'users' | 'surveys'
  const [activeSection, setActiveSection] = useState<'branding' | 'users' | 'surveys'>('branding');

  // Branding editing state
  const [schoolName, setSchoolName] = useState(branding.schoolName);
  const [schoolMotto, setSchoolMotto] = useState(branding.schoolMotto);
  const [schoolAddress, setSchoolAddress] = useState(branding.schoolAddress);
  const [primaryColor, setPrimaryColor] = useState(branding.primaryColor);
  const [themePreset, setThemePreset] = useState(branding.themePreset);
  const [appIconPreset, setAppIconPreset] = useState(branding.appIconPreset);
  const [customLogoUrl, setCustomLogoUrl] = useState(branding.customLogoUrl || '');
  const [heroBannerUrl, setHeroBannerUrl] = useState(branding.heroBannerUrl || '');
  const [academicYear, setAcademicYear] = useState(branding.academicYear);
  const [semester, setSemester] = useState(branding.semester);

  // User management state
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'siswa' | 'guru'>('all');
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [editingPasswordUserId, setEditingPasswordUserId] = useState<string | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [editingBadgesUserId, setEditingBadgesUserId] = useState<string | null>(null);

  const toggleUserBadge = (userId: string, badgeName: string) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;
    const current = target.badges || [];
    const updated = current.includes(badgeName)
      ? current.filter(b => b !== badgeName)
      : [...current, badgeName];
    updateUserBadges(userId, updated);
  };

  // Save branding changes
  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateBranding({
      schoolName,
      schoolMotto,
      schoolAddress,
      primaryColor,
      themePreset,
      appIconPreset,
      customLogoUrl: customLogoUrl.trim() || undefined,
      heroBannerUrl: heroBannerUrl.trim() || undefined,
      academicYear,
      semester,
    });
  };

  // Toggle reveal password for moderator
  const toggleRevealPassword = (userId: string) => {
    setRevealedPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Save updated password for a user
  const handleUpdatePassword = (userId: string) => {
    if (!newPasswordInput.trim()) return;
    updateUserPasswordByModerator(userId, newPasswordInput.trim());
    setEditingPasswordUserId(null);
    setNewPasswordInput('');
  };

  // Filtered users
  const filteredUsers = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (!userSearch) return true;
    return (
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.kelas && u.kelas.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.mapel && u.mapel.toLowerCase().includes(userSearch.toLowerCase()))
    );
  });

  const pendingSurveys = adminSurveys.filter(s => s.status === 'pending');

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-800 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Pusat Kendali Administrator
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Administrator: {currentUser?.name}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
            Kustomisasi Desain & Manajemen Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fleksibilitas penuh untuk mengubah identitas visual sekolah, mengelola kata sandi siswa, dan verifikasi guru admin.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (confirm('Kembalikan semua data, tema, dan kredensial ke pengaturan awal?')) {
              resetAllDataToDefault();
            }
          }}
          className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5 transition-colors shrink-0"
          title="Reset ke data bawaan demo"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Data Bawaan</span>
        </button>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSection('branding')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSection === 'branding'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Kustomisasi Desain & Identitas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSection === 'users'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Master Pengguna & Kata Sandi ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('surveys')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSection === 'surveys'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Verifikasi Survei Guru Admin</span>
          {pendingSurveys.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px]">
              {pendingSurveys.length}
            </span>
          )}
        </button>
      </div>

      {/* SECTION 1: KUSTOMISASI DESAIN & IDENTITAS */}
      {activeSection === 'branding' && (
        <form onSubmit={handleSaveBranding} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 7 cols: Controls */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs">
              <h3 className="text-sm font-extrabold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <School className="w-4 h-4 text-blue-600" />
                <span>Identitas & Nama Instansi Sekolah</span>
              </h3>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Resmi Sekolah / Instansi *</label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-900 outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Motto / Visi Sekolah</label>
                <input
                  type="text"
                  value={schoolMotto}
                  onChange={(e) => setSchoolMotto(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tahun Ajaran</label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden bg-white"
                  >
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
              </div>

              {/* Theme Color Picker */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block font-semibold text-slate-700 mb-2">
                  Pilihan Warna Tema Utama (Sesuai Identitas Seragam / Gedung Sekolah)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(THEME_COLORS).map(([key, item]) => {
                    const isSelected = primaryColor === item.hex;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setPrimaryColor(item.hex);
                          setThemePreset(key as any);
                        }}
                        className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                          isSelected
                            ? 'border-slate-800 ring-2 ring-slate-800 bg-slate-50 font-bold'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: item.hex }}
                        />
                        <span className="truncate text-[11px] text-slate-800">{item.label.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Input */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">Warna Hex Kustom:</span>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => {
                      setPrimaryColor(e.target.value);
                      setThemePreset('custom');
                    }}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => {
                      setPrimaryColor(e.target.value);
                      setThemePreset('custom');
                    }}
                    className="w-24 px-2 py-1 font-mono uppercase text-xs rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              {/* Icon Preset Picker */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block font-semibold text-slate-700 mb-2">
                  Pilihan Icon / Logo Aplikasi
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESET_ICONS.map(ic => {
                    const isSelected = appIconPreset === ic.id && !customLogoUrl;
                    return (
                      <button
                        key={ic.id}
                        type="button"
                        onClick={() => {
                          setAppIconPreset(ic.id as any);
                          setCustomLogoUrl('');
                        }}
                        className={`p-2 rounded-xl border text-left flex items-center space-x-2 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/20 font-bold text-blue-900'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="text-[11px] truncate">{ic.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Atau Gunakan URL Gambar Logo Sekolah Sendiri:
                  </label>
                  <input
                    type="url"
                    value={customLogoUrl}
                    onChange={(e) => setCustomLogoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 outline-hidden"
                  />
                </div>
              </div>

              {/* Banner Selector */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block font-semibold text-slate-700 mb-2">
                  Gambar Banner Latar Belakang Kampus
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_BANNERS.map((b, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setHeroBannerUrl(b.url)}
                      className={`relative rounded-xl overflow-hidden border h-14 text-left group ${
                        heroBannerUrl === b.url ? 'ring-2 ring-blue-600 border-blue-600' : 'border-slate-200'
                      }`}
                    >
                      <img src={b.url} alt={b.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 p-2 flex items-end">
                        <span className="text-[10px] text-white font-bold truncate">{b.name}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-3">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Atau Masukkan URL Banner Gambar Sendiri:
                  </label>
                  <input
                    type="url"
                    value={heroBannerUrl}
                    onChange={(e) => setHeroBannerUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-white font-extrabold shadow-sm transition-transform active:scale-95 flex items-center gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Desain</span>
                </button>
              </div>

            </div>

            {/* Right 5 cols: Live Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Pratinjau Tampilan Header & Identitas
                </span>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                  {/* Header preview */}
                  <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <BrandIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="truncate">
                      <p className="font-extrabold text-sm text-slate-900 leading-tight">PINTAR</p>
                      <p className="text-xs font-semibold text-slate-600 truncate">{schoolName}</p>
                    </div>
                  </div>

                  {/* Banner preview */}
                  <div className="relative rounded-2xl overflow-hidden h-28 border border-slate-200">
                    <img
                      src={heroBannerUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 p-3 flex flex-col justify-end text-white">
                      <p className="text-xs font-extrabold truncate">{schoolName}</p>
                      <p className="text-[10px] text-slate-200 italic truncate">"{schoolMotto}"</p>
                    </div>
                  </div>

                  {/* Sample buttons preview */}
                  <div className="space-y-2 pt-2">
                    <p className="text-[11px] font-bold text-slate-600">Komponen Tombol & Aksen:</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-lg text-white font-bold text-xs shadow-xs"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Tombol Utama
                      </button>
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Badge Status
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </form>
      )}

      {/* SECTION 2: MASTER PENGGUNA & PENYIMPANAN KATA SANDI */}
      {activeSection === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Penyimpanan & Manajemen Kata Sandi Pengguna
              </h3>
              <p className="text-xs text-slate-500">
                Sesuai kebijakan moderator sekolah, seluruh data akun dan kata sandi dapat dipantau & di-reset untuk membantu siswa yang lupa sandi.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setRoleFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold ${
                  roleFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Semua ({users.length})
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('siswa')}
                className={`px-3 py-1.5 rounded-xl font-bold ${
                  roleFilter === 'siswa' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Siswa ({users.filter(u => u.role === 'siswa').length})
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('guru')}
                className={`px-3 py-1.5 rounded-xl font-bold ${
                  roleFilter === 'guru' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Guru ({users.filter(u => u.role === 'guru').length})
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Cari nama, email, kelas, NISN..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-emerald-100 rounded-2xl shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-emerald-50/70 border-b border-emerald-100 text-emerald-950 font-extrabold">
                <tr>
                  <th className="p-3">Identitas (Nama Buatan & USN)</th>
                  <th className="p-3">Akun Gmail (Privat)</th>
                  <th className="p-3">Peran / Kelas</th>
                  <th className="p-3">
                    Badge Akun
                    <span className="block text-[9px] font-normal text-emerald-700">Hanya Admin yang Tahu</span>
                  </th>
                  <th className="p-3">Kata Sandi Tersimpan</th>
                  <th className="p-3">Salinan ke Gmail</th>
                  <th className="p-3 text-right">Aksi Moderator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => {
                  const isRevealed = revealedPasswords[u.id] ?? false;
                  const isEditing = editingPasswordUserId === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-emerald-50/30 transition-colors">
                      {/* Identitas (Nama Buatan & USN) */}
                      <td className="p-3 font-semibold text-slate-900">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80'}
                            alt={u.name}
                            className="w-9 h-9 rounded-xl object-cover shrink-0 ring-1 ring-emerald-300 shadow-2xs"
                          />
                          <div>
                            <p className="font-extrabold text-slate-900 leading-tight">
                              {u.displayName || u.name}
                            </p>
                            <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                              USN: <span className="text-slate-700 font-bold">{u.usn || u.name}</span>
                            </p>
                            <p className="text-[9px] text-slate-400">
                              {u.nisn ? `NISN: ${u.nisn}` : u.nip ? `NIP: ${u.nip}` : ''}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Gmail */}
                      <td className="p-3">
                        <span className="text-slate-800 font-mono text-[11px] font-semibold block">{u.email}</span>
                        <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-sm border border-emerald-200 inline-block mt-0.5">
                          Gmail Terverifikasi
                        </span>
                      </td>

                      {/* Role & Class */}
                      <td className="p-3">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            u.isAdmin
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : u.role === 'guru'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {u.isAdmin ? 'Admin Sekolah' : u.role === 'guru' ? `Guru: ${u.mapel}` : `Siswa: ${u.kelas}`}
                        </span>
                      </td>

                      {/* Badge Akun (Hanya Admin yang Tahu) */}
                      <td className="p-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <UserBadgeList badges={u.badges} size="xs" forceShowForAdminOnly={true} />
                          <button
                            type="button"
                            onClick={() => setEditingBadgesUserId(u.id)}
                            className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors flex items-center gap-1 shadow-2xs"
                            title="Beri atau ubah badge rahasia untuk akun ini"
                          >
                            <Award className="w-3 h-3 text-amber-600" />
                            <span>Atur Badge</span>
                          </button>
                        </div>
                      </td>

                      {/* Password */}
                      <td className="p-3">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={newPasswordInput}
                              onChange={(e) => setNewPasswordInput(e.target.value)}
                              placeholder="Ketik sandi baru..."
                              className="px-2 py-1 text-xs border border-emerald-400 rounded-lg outline-hidden font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdatePassword(u.id)}
                              className="px-2 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[10px]"
                            >
                              Simpan
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingPasswordUserId(null)}
                              className="px-2 py-1 bg-slate-200 text-slate-700 rounded-lg text-[10px]"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1.5">
                            <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                              {isRevealed ? u.password : '••••••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleRevealPassword(u.id)}
                              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                              title={isRevealed ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                            >
                              {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Salinan ke Gmail (Jaga-Jaga) */}
                      <td className="p-3">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="text-[10px] text-slate-500">
                            {u.emailBackupSentAt
                              ? `Tersalin: ${new Date(u.emailBackupSentAt).toLocaleDateString('id-ID')}`
                              : 'Tersimpan di admin'}
                          </span>
                          <button
                            type="button"
                            onClick={() => sendAccountBackupToEmail(u.id)}
                            className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors flex items-center gap-1 shadow-2xs"
                            title="Kirim salinan data akun dan kata sandi ke email pengguna untuk jaga-jaga"
                          >
                            <Send className="w-2.5 h-2.5 text-emerald-600" />
                            <span>Kirim ke Gmail</span>
                          </button>
                        </div>
                      </td>

                      {/* Aksi Moderator */}
                      <td className="p-3 text-right">
                        {!isEditing && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPasswordUserId(u.id);
                              setNewPasswordInput('');
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold text-orange-600 hover:bg-orange-50 rounded-lg border border-orange-200 transition-colors"
                          >
                            Ganti Sandi
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Modal Atur Badge Akun */}
          {editingBadgesUserId && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-emerald-100 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Atur Badge Pengguna</h4>
                    <p className="text-[11px] text-slate-500">
                      {users.find(u => u.id === editingBadgesUserId)?.name}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingBadgesUserId(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-slate-600">Klik untuk menyematkan/mencabut badge:</p>
                  
                  {['Si Pintar', 'Pekerja Keras', 'Si Bijak', 'Si Paling Aktif', 'Badge Admin'].map((badgeName) => {
                    const targetUser = users.find(u => u.id === editingBadgesUserId);
                    const isSelected = targetUser?.badges?.includes(badgeName) ?? false;

                    return (
                      <button
                        key={badgeName}
                        type="button"
                        onClick={() => toggleUserBadge(editingBadgesUserId, badgeName)}
                        className={`w-full p-3 rounded-2xl border flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20 font-bold'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <UserBadgeItem badge={badgeName} size="sm" />
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {isSelected ? '✓ Terpasang' : '+ Pasang'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingBadgesUserId(null)}
                    className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                  >
                    Selesai & Simpan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: VERIFIKASI SURVEI GURU MENJADI ADMIN */}
      {activeSection === 'surveys' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-900">
              Daftar Survei & Pengajuan Hak Administrator Guru
            </h3>
            <p className="text-xs text-slate-500">
              Setujui atau tolak pengajuan guru untuk bergabung dalam tim administrator sekolah.
            </p>
          </div>

          <div className="space-y-3">
            {adminSurveys.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">Belum ada survei pengajuan masuk dari dewan guru.</p>
            ) : (
              adminSurveys.map(srv => {
                const isPending = srv.status === 'pending';

                return (
                  <div
                    key={srv.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-900 text-sm">{srv.teacherName}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            {srv.teacherMapel}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{srv.teacherEmail} • Pengalaman: {srv.teachingExperienceYears} Tahun</p>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          srv.status === 'disetujui'
                            ? 'bg-emerald-100 text-emerald-800'
                            : srv.status === 'ditolak'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {srv.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700 space-y-1">
                      <p><strong>Divisi yang Dipilih:</strong> {srv.divisionAssigned}</p>
                      <p><strong>Alasan & Visi:</strong> {srv.reason}</p>
                      <p className="text-emerald-700 font-semibold text-[11px]">
                        ✓ Telah menandatangani Pakta Integritas Kerahasiaan Data
                      </p>
                    </div>

                    {isPending && (
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => reviewAdminSurvey(srv.id, 'ditolak')}
                          className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 text-xs flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Tolak
                        </button>
                        <button
                          type="button"
                          onClick={() => reviewAdminSurvey(srv.id, 'disetujui')}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Setujui Menjadi Admin
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

    </div>
  );
};
