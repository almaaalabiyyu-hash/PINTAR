import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  BookOpen,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
}) => {
  const {
    login,
    register,
    resetPassword,
    quickLoginAs,
    users,
    branding,
  } = useApp();

  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(defaultTab);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form
  const [registerRole, setRegisterRole] = useState<'siswa' | 'guru'>('siswa');
  const [regName, setRegName] = useState('');
  const [regUsn, setRegUsn] = useState('');
  const [regDisplayName, setRegDisplayName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regKelas, setRegKelas] = useState('VII A');
  const [regMapel, setRegMapel] = useState('PAI & Tahfidz');
  const [regNisn, setRegNisn] = useState('');
  const [regNip, setRegNip] = useState('');
  const [registerError, setRegisterError] = useState('');

  // Forgot password form
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState('');
  const [forgotError, setForgotError] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = login(loginEmail, loginPassword);
    if (res.success) {
      onClose();
    } else {
      setLoginError(res.message);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    if (registerRole === 'siswa' && !regKelas.trim()) {
      setRegisterError('Kelas wajib diisi untuk siswa.');
      return;
    }
    if (registerRole === 'guru' && !regMapel.trim()) {
      setRegisterError('Guru mata pelajaran wajib diisi untuk guru.');
      return;
    }

    const finalUsn = regUsn.trim() || regName.trim();
    const finalDisplayName = regDisplayName.trim() || regName.trim() || finalUsn;

    const res = register({
      name: finalDisplayName,
      usn: finalUsn,
      displayName: finalDisplayName,
      email: regEmail.trim(),
      password: regPassword.trim(),
      role: registerRole,
      kelas: registerRole === 'siswa' ? regKelas.trim() : undefined,
      mapel: registerRole === 'guru' ? regMapel.trim() : undefined,
      nisn: regNisn.trim() || undefined,
      nip: regNip.trim() || undefined,
      avatar:
        registerRole === 'guru'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    });

    if (res.success) {
      onClose();
    } else {
      setRegisterError(res.message);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccessMsg('');

    const res = resetPassword(forgotEmail, forgotNewPass);
    if (res.success) {
      setForgotSuccessMsg('Kata sandi berhasil diperbarui! Silakan masuk kembali dengan kata sandi baru Anda.');
      setTimeout(() => {
        setTab('login');
      }, 2000);
    } else {
      setForgotError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 relative animate-in fade-in zoom-in-95">
        
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mx-auto shadow-sm"
            style={{ backgroundColor: branding.primaryColor }}
          >
            <GraduationCap className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 mt-3">PINTAR - SMPI AL-AKBAR</h3>
          <p className="text-xs text-emerald-700 font-bold mt-0.5">Beriman, Berbudi, Berprestasi</p>
        </div>

        {/* Tabs switcher */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl mb-5 text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setLoginError('');
            }}
            className={`py-1.5 rounded-lg transition-all ${
              tab === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setRegisterError('');
            }}
            className={`py-1.5 rounded-lg transition-all ${
              tab === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Daftar Baru
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('forgot');
              setForgotError('');
              setForgotSuccessMsg('');
            }}
            className={`py-1.5 rounded-lg transition-all ${
              tab === 'forgot' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Lupa Sandi
          </button>
        </div>

        {/* TAB 1: LOGIN */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Terdaftar</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="nama@sekolah.sch.id"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Kata Sandi</label>
                <button
                  type="button"
                  onClick={() => setTab('forgot')}
                  className="text-blue-600 hover:underline text-[11px] font-semibold"
                >
                  Lupa kata sandi?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {loginError && (
              <p className="text-red-600 text-xs font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-white shadow-sm transition-transform active:scale-95"
              style={{ backgroundColor: branding.primaryColor }}
            >
              Masuk ke Portal PINTAR
            </button>
          </form>
        )}

        {/* TAB 2: REGISTER */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            {/* Role picker */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mendaftar Sebagai:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegisterRole('siswa')}
                  className={`py-2 rounded-xl border text-center font-bold flex items-center justify-center gap-1.5 ${
                    registerRole === 'siswa'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Siswa / Santri SMP</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterRole('guru')}
                  className={`py-2 rounded-xl border text-center font-bold flex items-center justify-center gap-1.5 ${
                    registerRole === 'guru'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Guru Mapel SMP</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Contoh: Muhammad Farhan"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Resmi *</label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="nama@smpi-alakbar.sch.id"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kata Sandi *</label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Siswa: Isi Nama & Kelas SMP */}
            {registerRole === 'siswa' ? (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelas SMP *</label>
                  <select
                    value={regKelas}
                    onChange={(e) => setRegKelas(e.target.value)}
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
                    value={regNisn}
                    onChange={(e) => setRegNisn(e.target.value)}
                    placeholder="012923..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden"
                  />
                </div>
              </div>
            ) : (
              /* Guru: Isi Nama & Guru Mapel */
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Guru Mapel SMP *</label>
                  <input
                    type="text"
                    required
                    value={regMapel}
                    onChange={(e) => setRegMapel(e.target.value)}
                    placeholder="Contoh: PAI, IPA, Matematika..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIP (Opsional)</label>
                  <input
                    type="text"
                    value={regNip}
                    onChange={(e) => setRegNip(e.target.value)}
                    placeholder="1985..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden"
                  />
                </div>
              </div>
            )}

            {registerError && (
              <p className="text-red-600 text-xs font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {registerError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-white shadow-sm transition-transform active:scale-95 mt-2"
              style={{ backgroundColor: branding.primaryColor }}
            >
              Daftarkan Akun
            </button>
          </form>
        )}

        {/* TAB 3: LUPA KATA SANDI */}
        {tab === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] leading-relaxed">
              <strong>Fitur Pemulihan Mandiri & Moderator:</strong> Anda dapat mengganti kata sandi secara mandiri jika mengetahui email akun, atau meminta bantuan guru moderator melalui menu Master Pengguna.
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Akun Anda *</label>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="nama@siswa.sekolah.sch.id"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kata Sandi Baru *</label>
              <input
                type="password"
                required
                value={forgotNewPass}
                onChange={(e) => setForgotNewPass(e.target.value)}
                placeholder="Ketikkan sandi baru..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {forgotError && (
              <p className="text-red-600 text-xs font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {forgotError}
              </p>
            )}

            {forgotSuccessMsg && (
              <p className="text-emerald-700 text-xs font-semibold flex items-center gap-1 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                {forgotSuccessMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-white shadow-sm transition-transform active:scale-95"
              style={{ backgroundColor: branding.primaryColor }}
            >
              Perbarui Kata Sandi Saya
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
