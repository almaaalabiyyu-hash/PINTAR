export const THEME_COLORS: Record<string, { bg: string; text: string; ring: string; border: string; hex: string; label: string }> = {
  blue: {
    bg: 'bg-blue-600',
    text: 'text-blue-600',
    ring: 'ring-blue-600',
    border: 'border-blue-600',
    hex: '#2563eb',
    label: 'Biru Edukasi (Standar)',
  },
  emerald: {
    bg: 'bg-emerald-600',
    text: 'text-emerald-600',
    ring: 'ring-emerald-600',
    border: 'border-emerald-600',
    hex: '#059669',
    label: 'Hijau Akademik Madrasah/Adiwiyata',
  },
  indigo: {
    bg: 'bg-indigo-600',
    text: 'text-indigo-600',
    ring: 'ring-indigo-600',
    border: 'border-indigo-600',
    hex: '#4f46e5',
    label: 'Indigo Cendekia Modern',
  },
  rose: {
    bg: 'bg-rose-600',
    text: 'text-rose-600',
    ring: 'ring-rose-600',
    border: 'border-rose-600',
    hex: '#e11d48',
    label: 'Merah Semangat Prestasi',
  },
  amber: {
    bg: 'bg-amber-600',
    text: 'text-amber-600',
    ring: 'ring-amber-600',
    border: 'border-amber-600',
    hex: '#d97706',
    label: 'Kuning Emas Kehormatan',
  },
  slate: {
    bg: 'bg-slate-800',
    text: 'text-slate-800',
    ring: 'ring-slate-800',
    border: 'border-slate-800',
    hex: '#1e293b',
    label: 'Monokrom Elegan',
  },
};

export const PRESET_BANNERS = [
  {
    name: 'Gedung Kampus Modern',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Perpustakaan & Buku',
    url: 'https://images.unsplash.com/photo-1507842229458-77903be6732b?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Ruang Kelas Kolaboratif',
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Laboratorium Sains & Riset',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: 'Taman Sekolah Asri',
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80',
  },
];

export const PRESET_ICONS = [
  { id: 'graduation-cap', label: 'Topi Toga (Akademik)' },
  { id: 'book-open', label: 'Buku Pintar (Literasi)' },
  { id: 'school', label: 'Gedung Sekolah (Institusi)' },
  { id: 'sparkles', label: 'Bintang Prestasi (Unggulan)' },
  { id: 'award', label: 'Lencana Juara (Kompetensi)' },
  { id: 'brain', label: 'Otak Cerdas (Nalar Kritis)' },
];
