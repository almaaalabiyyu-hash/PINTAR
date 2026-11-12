import React, { useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpenCheck,
  FileText,
  AlertCircle,
  Plus,
  ArrowRight,
  CheckCircle2,
  Calendar as CalendarIcon,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CalendarEvent } from '../../types';

export const AcademicCalendar: React.FC = () => {
  const {
    calendarEvents,
    addCalendarEvent,
    currentUser,
    branding,
    setActiveTab,
  } = useApp();

  const isTeacher = currentUser?.role === 'guru' || currentUser?.isAdmin;

  // Selected date / month: default to current simulated month (October 2026)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9); // 0-indexed: 9 = October
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-10-18');
  const [activeFilter, setActiveFilter] = useState<'all' | 'tugas' | 'kuis' | 'agenda'>('all');
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  // New event form
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<CalendarEvent['type']>('deadline-tugas');
  const [newDate, setNewDate] = useState('2026-10-25');
  const [newTime, setNewTime] = useState('23:59');
  const [newSubject, setNewSubject] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  // Days in month calculation
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Filter events
  const filteredEvents = calendarEvents.filter(evt => {
    if (activeFilter === 'tugas') return evt.type === 'deadline-tugas';
    if (activeFilter === 'kuis') return evt.type === 'jadwal-kuis';
    if (activeFilter === 'agenda') return evt.type === 'agenda-sekolah' || evt.type === 'ujian-semester';
    return true;
  });

  // Events for selected date
  const eventsForSelectedDate = calendarEvents.filter(
    evt => evt.date === selectedDateStr
  );

  // Helper to format date string
  const formatIsoDate = (year: number, month: number, day: number) => {
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addCalendarEvent({
      title: newTitle,
      type: newType,
      date: newDate,
      time: newTime,
      subject: newSubject || undefined,
      description: newDesc || undefined,
    });

    setShowAddEventModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1.5"
              style={{ backgroundColor: branding.primaryColor }}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              Kalender Akademik
            </span>
            <span className="text-xs text-slate-500 font-medium">
              T.A. {branding.academicYear}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
            Tenggat Waktu & Jadwal Akademik
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau seluruh batas pengumpulan tugas, kuis online, dan agenda sekolah agar tidak terlewat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isTeacher && (
            <button
              type="button"
              onClick={() => setShowAddEventModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-transform active:scale-95 flex items-center gap-1.5"
              style={{ backgroundColor: branding.primaryColor }}
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jadwal</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Calendar left, Upcoming list right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 cols: Interactive Calendar Grid */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          
          {/* Month Controller */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900">
              {monthNames[currentMonth]} {currentYear}
            </h3>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentYear(2026);
                  setCurrentMonth(9);
                }}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Hari Ini
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center py-3 text-xs font-bold text-slate-400">
            {daysOfWeek.map((day, idx) => (
              <div key={day} className={idx === 0 ? 'text-red-500' : ''}>
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Blank cells for offset */}
            {Array.from({ length: firstDay }).map((_, idx) => (
              <div key={`blank-${idx}`} className="h-14 sm:h-16 rounded-xl bg-slate-50/50" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const dateStr = formatIsoDate(currentYear, currentMonth, day);
              const dayEvents = calendarEvents.filter(e => e.date === dateStr);
              const isSelected = selectedDateStr === dateStr;

              const hasDeadline = dayEvents.some(e => e.type === 'deadline-tugas');
              const hasQuiz = dayEvents.some(e => e.type === 'jadwal-kuis');
              const hasAgenda = dayEvents.some(e => e.type === 'agenda-sekolah');

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-14 sm:h-16 rounded-2xl p-1.5 flex flex-col justify-between items-start transition-all border text-left ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/60'
                      : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50 bg-white'
                  }`}
                >
                  <span
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-800'
                    }`}
                  >
                    {day}
                  </span>

                  {/* Badges / dots */}
                  <div className="w-full flex items-center gap-1 flex-wrap">
                    {hasDeadline && (
                      <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" title="Tenggat Tugas" />
                    )}
                    {hasQuiz && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Jadwal Kuis" />
                    )}
                    {hasAgenda && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" title="Agenda Sekolah" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex-wrap">
            <span className="font-semibold text-slate-700">Keterangan:</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              Tenggat Tugas (Orange)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Jadwal Kuis (Kuning)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              Agenda Sekolah (Hijau)
            </span>
          </div>

        </div>

        {/* Right 5 cols: Details of selected date & Upcoming deadlines */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Selected Date Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Agenda Tanggal Terpilih
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {new Date(selectedDateStr).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </h4>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {eventsForSelectedDate.length} Kegiatan
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {eventsForSelectedDate.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs">
                  <CalendarIcon className="w-8 h-8 mx-auto mb-1.5 text-slate-300" />
                  <span>Tidak ada tenggat atau agenda pada tanggal ini.</span>
                </div>
              ) : (
                eventsForSelectedDate.map(evt => {
                  const isDeadline = evt.type === 'deadline-tugas';
                  const isQuiz = evt.type === 'jadwal-kuis';

                  return (
                    <div
                      key={evt.id}
                      className={`p-3.5 rounded-2xl border text-xs space-y-1.5 transition-all ${
                        isDeadline
                          ? 'bg-orange-50/70 border-orange-200 text-orange-950'
                          : isQuiz
                          ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                          : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isDeadline
                              ? 'bg-orange-200 text-orange-900'
                              : isQuiz
                              ? 'bg-amber-200 text-amber-900'
                              : 'bg-emerald-200 text-emerald-900'
                          }`}
                        >
                          {isDeadline ? 'TENGGAT TUGAS' : isQuiz ? 'JADWAL KUIS' : 'AGENDA SEKOLAH'}
                        </span>
                        {evt.time && (
                          <span className="font-semibold text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {evt.time} WIB
                          </span>
                        )}
                      </div>

                      <h5 className="font-extrabold text-slate-900 text-sm leading-snug">
                        {evt.title}
                      </h5>

                      {evt.description && (
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          {evt.description}
                        </p>
                      )}

                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 font-medium">
                          {evt.subject ? `Mapel: ${evt.subject}` : 'Umum Sekolah'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveTab('kuis-tugas')}
                          className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                        >
                          Buka Soal <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Upcoming All Deadlines List */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Semua Tenggat Mendatang
              </h4>
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`px-2 py-0.5 rounded-md ${
                    activeFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-500'
                  }`}
                >
                  Semua
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('tugas')}
                  className={`px-2 py-0.5 rounded-md ${
                    activeFilter === 'tugas' ? 'bg-orange-600 text-white font-bold' : 'text-slate-500'
                  }`}
                >
                  Tugas
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('kuis')}
                  className={`px-2 py-0.5 rounded-md ${
                    activeFilter === 'kuis' ? 'bg-amber-500 text-white font-bold' : 'text-slate-500'
                  }`}
                >
                  Kuis
                </button>
              </div>
            </div>

            <div className="mt-3 space-y-2 max-h-80 overflow-y-auto pr-1">
              {filteredEvents.map(evt => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedDateStr(evt.date)}
                  className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between text-xs"
                >
                  <div className="truncate pr-2">
                    <p className="font-bold text-slate-800 truncate">{evt.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(evt.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                      evt.type === 'deadline-tugas'
                        ? 'bg-orange-100 text-orange-800'
                        : evt.type === 'jadwal-kuis'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {evt.type === 'deadline-tugas' ? 'Tugas' : evt.type === 'jadwal-kuis' ? 'Kuis' : 'Agenda'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Modal: Tambah Agenda / Tenggat Manual */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Tambah Agenda / Tenggat Baru</h3>
              <button
                type="button"
                onClick={() => setShowAddEventModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Agenda / Tenggat *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Tenggat Penyerahan Makalah Sejarah"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kegiatan</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden bg-white"
                  >
                    <option value="deadline-tugas">Tenggat Tugas</option>
                    <option value="jadwal-kuis">Jadwal Kuis</option>
                    <option value="agenda-sekolah">Agenda Sekolah</option>
                    <option value="ujian-semester">Ujian Semester</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Contoh: Sejarah, Biologi..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Waktu (WIB)</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi Tambahan</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Instruksi singkat..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white font-bold"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  Simpan ke Kalender
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
