import React, { useState } from 'react';
import { Download, Smartphone, Check, X, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const DownloadInstallModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const appShareUrl = window.location.origin;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(appShareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleDirectInstall = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-100 text-slate-800 animate-in fade-in zoom-in-95 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          <div className="w-20 h-20 rounded-2xl bg-white border border-amber-300 p-1 shadow-sm flex items-center justify-center mb-3">
            <img
              src="/assets/aistudio/Logo_APK_PINTAR_302be987.png"
              alt="Logo APK PINTAR"
              className="w-16 h-16 object-contain"
            />
          </div>

          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Aplikasi Resmi Sekolah
          </span>

          <h3 className="text-lg font-extrabold text-slate-900 mt-2">
            Unduh Aplikasi PINTAR
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Pasang langsung di HP Android, iPhone, tablet, maupun Laptop/PC Anda untuk akses instan tanpa perlu browser.
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {/* Main Install Button */}
          {isInstallable ? (
            <button
              type="button"
              onClick={handleDirectInstall}
              className="w-full py-3 rounded-2xl font-black text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Pasang / Unduh Aplikasi Sekarang (1 Klik)</span>
            </button>
          ) : isInstalled ? (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold text-center flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Aplikasi PINTAR Sudah Terpasang di Perangkat Ini!</span>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <p className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Petunjuk Pemasangan Cepat di HP:</span>
              </p>
              {isIOS ? (
                <ol className="list-decimal list-inside text-[11px] text-slate-600 space-y-1">
                  <li>Buka aplikasi di browser <strong>Safari</strong> iPhone/iPad.</li>
                  <li>Ketuk tombol <strong>Bagikan (Share)</strong> di bagian bawah layar.</li>
                  <li>Gulir ke bawah lalu pilih <strong>"Tambahkan ke Layar Utama" (Add to Home Screen)</strong>.</li>
                </ol>
              ) : (
                <ol className="list-decimal list-inside text-[11px] text-slate-600 space-y-1">
                  <li>Ketuk menu <strong>tiga titik (⋮)</strong> di pojok kanan atas browser Chrome.</li>
                  <li>Pilih opsi <strong>"Pasang aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.</li>
                  <li>Ikon APK PINTAR akan langsung muncul di menu HP Anda!</li>
                </ol>
              )}
            </div>
          )}

          {/* Share/Copy Web Link */}
          <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-1.5">
            <span className="text-[11px] font-bold text-amber-950 block">
              🔗 Tautan Portal / Download Aplikasi:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={appShareUrl}
                className="flex-1 bg-white px-2.5 py-1.5 rounded-xl border border-amber-300 text-xs text-slate-700 font-mono select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-1 shadow-2xs"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Disalin!' : 'Salin Link'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
