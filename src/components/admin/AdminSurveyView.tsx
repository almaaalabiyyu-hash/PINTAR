import React, { useState } from 'react';
import {
  FileCheck2,
  Shield,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Award,
  Send,
  Building
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminSurveyView: React.FC = () => {
  const {
    currentUser,
    adminSurveys,
    submitAdminSurvey,
    branding,
  } = useApp();

  const mySurvey = adminSurveys.find(s => s.teacherId === currentUser?.id);

  // Form states
  const [teachingExp, setTeachingExp] = useState(5);
  const [division, setDivision] = useState('Tim Kurikulum & Asesmen Digital');
  const [reason, setReason] = useState('');
  const [dataPledge, setDataPledge] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !reason.trim() || !dataPledge) return;

    submitAdminSurvey({
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      teacherEmail: currentUser.email,
      teacherMapel: currentUser.mapel || 'Mata Pelajaran',
      teachingExperienceYears: Number(teachingExp),
      divisionAssigned: division,
      reason: reason.trim(),
      dataIntegrityPledge: dataPledge,
    });

    setSubmittedSuccess(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header Info */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm"
            style={{ backgroundColor: branding.primaryColor }}
          >
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
              Khusus Dewan Guru
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Survei Calon Admin PINTAR - SMPI AL-AKBAR
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pengajuan wewenang pengelolaan sistem, kustomisasi identitas, dan manajemen akun SMPI AL-AKBAR.
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
          <p className="font-bold text-slate-800">Peran & Wewenang Admin Sekolah:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
            <li>Mengubah tampilan visual portal (warna tema sekolah, logo instansi, banner kampus).</li>
            <li>Mengakses master basis data pengguna dan membantu siswa yang lupa kata sandi.</li>
            <li>Menyetujui permohonan admin dari guru lain demi kebersamaan tata kelola sekolah.</li>
          </ul>
        </div>
      </div>

      {/* Existing survey status if already submitted */}
      {mySurvey ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs text-center space-y-4">
          <div
            className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-inner ${
              mySurvey.status === 'disetujui'
                ? 'bg-emerald-100 text-emerald-600'
                : mySurvey.status === 'ditolak'
                ? 'bg-red-100 text-red-600'
                : 'bg-amber-100 text-amber-600'
            }`}
          >
            {mySurvey.status === 'disetujui' ? (
              <CheckCircle2 className="w-8 h-8" />
            ) : mySurvey.status === 'ditolak' ? (
              <AlertCircle className="w-8 h-8" />
            ) : (
              <Clock className="w-8 h-8 animate-pulse" />
            )}
          </div>

          <div>
            <span
              className={`text-xs uppercase font-extrabold px-3 py-1 rounded-full ${
                mySurvey.status === 'disetujui'
                  ? 'bg-emerald-100 text-emerald-800'
                  : mySurvey.status === 'ditolak'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              Status: {mySurvey.status === 'disetujui' ? 'DISETUJUI SEBAGAI ADMIN' : mySurvey.status === 'ditolak' ? 'DITOLAK' : 'MENUNGGU VERIFIKASI ADMIN PUSAT'}
            </span>

            <h3 className="text-base font-bold text-slate-900 mt-3">
              {mySurvey.status === 'disetujui'
                ? 'Selamat! Anda resmi memiliki hak akses Administrator.'
                : mySurvey.status === 'ditolak'
                ? 'Mohon maaf, pengajuan saat ini belum dapat disetujui.'
                : 'Formulir survei Anda telah kami terima.'}
            </h3>

            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Tanggal Pengajuan:{' '}
              {new Date(mySurvey.submittedAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left max-w-lg mx-auto space-y-2">
            <p><strong>Divisi Diajukan:</strong> {mySurvey.divisionAssigned}</p>
            <p><strong>Alasan / Visi:</strong> {mySurvey.reason}</p>
            {mySurvey.reviewerName && (
              <p><strong>Diverifikasi oleh:</strong> {mySurvey.reviewerName}</p>
            )}
          </div>
        </div>
      ) : (
        /* The Survey Form */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Guru</label>
              <input
                type="text"
                disabled
                value={currentUser?.name || ''}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Resmi Sekolah</label>
              <input
                type="text"
                disabled
                value={currentUser?.email || ''}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran yang Diampu</label>
              <input
                type="text"
                disabled
                value={currentUser?.mapel || ''}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pengalaman Mengajar (Tahun) *</label>
              <input
                type="number"
                min="1"
                max="40"
                required
                value={teachingExp}
                onChange={(e) => setTeachingExp(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Divisi / Penugasan yang Diminati di Portal PINTAR *</label>
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
            >
              <option value="Tim Kurikulum & Asesmen Digital">Tim Kurikulum & Asesmen Digital (Kelola Kuis & Tugas)</option>
              <option value="Tim Kesiswaan & Kedisiplinan">Tim Kesiswaan & Kedisiplinan (Pengumuman & Monitoring)</option>
              <option value="Tim Sarana Prasarana & IT Portal">Tim Sarana Prasarana & IT Portal (Desain, Logo, Kustomisasi)</option>
              <option value="Tim Hubungan Masyarakat & Prestasi">Tim Hubungan Masyarakat & Publikasi Prestasi</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Alasan & Komitmen Pengajuan Menjadi Admin *
            </label>
            <textarea
              required
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Jelaskan alasan Anda ingin menjadi administrator aplikasi PINTAR, kontribusi yang ingin diberikan, serta kesiapan membantu siswa/guru lain..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          {/* Pakta integritas checkbox */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={dataPledge}
                onChange={(e) => setDataPledge(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded-sm text-blue-600 focus:ring-blue-500"
              />
              <div className="text-[11px] text-amber-950 leading-relaxed font-medium">
                <strong>Pakta Integritas Kerahasiaan Data & Kata Sandi:</strong> Saya bersumpah akan menjaga kerahasiaan data seluruh civitas akademika, tidak akan menyalahgunakan hak akses moderator/admin, dan hanya melakukan reset kata sandi atas permintaan resmi siswa yang bersangkutan.
              </div>
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={!dataPledge || !reason.trim()}
              className="px-6 py-2.5 rounded-xl font-bold text-white shadow-sm transition-transform active:scale-95 disabled:opacity-40 flex items-center gap-2"
              style={{ backgroundColor: branding.primaryColor }}
            >
              <Send className="w-4 h-4" />
              <span>Kirimkan Survei Pengajuan Admin</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
