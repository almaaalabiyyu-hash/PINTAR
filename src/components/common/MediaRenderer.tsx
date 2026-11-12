import React, { useState } from 'react';
import { Play, Image as ImageIcon, ExternalLink, X } from 'lucide-react';

interface MediaRendererProps {
  photoUrl?: string;
  videoUrl?: string;
  linkUrl?: string;
  linkLabel?: string;
  attachedFileName?: string;
  attachedFileUrl?: string;
}

export const MediaRenderer: React.FC<MediaRendererProps> = ({
  photoUrl,
  videoUrl,
  linkUrl,
  linkLabel,
  attachedFileName,
  attachedFileUrl,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Helper to extract YouTube embed URL
  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        const v = urlParams.get('v');
        return v ? `https://www.youtube-nocookie.com/embed/${v}` : url;
      }
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0];
        return id ? `https://www.youtube-nocookie.com/embed/${id}` : url;
      }
      if (url.includes('youtube.com/embed/')) {
        return url;
      }
      return null;
    } catch {
      return null;
    }
  };

  const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : null;
  const isDirectVideo = videoUrl && !embedUrl && (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm'));

  if (!photoUrl && !videoUrl && !attachedFileName && !linkUrl) {
    return null;
  }

  return (
    <div className="mt-3 space-y-3">
      {/* Video display */}
      {videoUrl && (
        <div className="rounded-xl overflow-hidden border border-slate-200 bg-black/5 shadow-xs">
          {embedUrl ? (
            <div className="relative aspect-video w-full">
              <iframe
                src={embedUrl}
                title="Video Pengumuman Pembelajaran"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          ) : isDirectVideo ? (
            <video
              src={videoUrl}
              controls
              className="w-full aspect-video rounded-xl bg-black"
            />
          ) : (
            <div className="p-3 flex items-center justify-between bg-slate-100 rounded-xl">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <Play className="w-4 h-4 text-emerald-600" />
                <span className="font-medium truncate max-w-xs">{videoUrl}</span>
              </div>
              <a
                href={videoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-600 hover:underline flex items-center gap-1 font-bold"
              >
                Buka Video <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Photo display */}
      {photoUrl && (
        <div
          className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative group cursor-pointer"
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={photoUrl}
            alt="Lampiran Foto Pengumuman"
            className="w-full max-h-96 object-cover object-center group-hover:opacity-95 transition-all"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/60 backdrop-blur-xs text-white text-[11px] rounded-lg flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <ImageIcon className="w-3 h-3" />
            <span>Klik untuk perbesar</span>
          </div>
        </div>
      )}

      {/* External Link */}
      {linkUrl && (
        <a
          href={linkUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl text-xs hover:border-emerald-300 hover:shadow-xs transition-all group"
        >
          <div className="flex items-center space-x-2.5 truncate">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <ExternalLink className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="font-bold text-emerald-950 group-hover:text-emerald-700 truncate">
                {linkLabel || 'Kunjungi Tautan Sumber Belajar'}
              </p>
              <p className="text-[10px] text-emerald-700/80 truncate font-mono">
                {linkUrl}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 shrink-0 ml-2">
            Buka <ExternalLink className="w-3 h-3" />
          </span>
        </a>
      )}

      {/* Attachment document file */}
      {attachedFileName && (
        <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
          <div className="flex items-center space-x-2 truncate">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
              DOC
            </div>
            <span className="font-medium text-slate-800 truncate">{attachedFileName}</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer">
            Unduh Berkas
          </span>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && photoUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-transparent">
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300 p-1"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={photoUrl}
              alt="Pratinjau Foto"
              className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
