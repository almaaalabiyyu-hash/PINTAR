import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Brain,
  Sparkles,
  Timer,
  CheckCircle2,
  XCircle,
  Award,
  Play,
  RotateCcw,
  Send,
  HelpCircle,
  Flame,
  Star,
  ChevronRight,
  BookOpen,
  Compass,
  Globe2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cerdasCermatQuestions, CerdasQuestionItem } from '../../data/initialData';

export const CerdasCermatGame: React.FC = () => {
  const {
    currentUser,
    cerdasCermatScores,
    submitCerdasCermatScore,
    announceTop3Weekly,
    branding,
    setActiveTab,
  } = useApp();

  const [gameMode, setGameMode] = useState<'lobby' | 'playing' | 'result'>('lobby');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<'all' | 'mtk' | 'bindo' | 'ipa' | 'ips' | 'umum'>('all');
  
  // Game session state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionsList, setQuestionsList] = useState<CerdasQuestionItem[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState(0);

  const isTeacherOrAdmin = currentUser?.role === 'guru' || currentUser?.isAdmin;

  // Prepare questions and start game
  const handleStartGame = (filter: 'all' | 'mtk' | 'bindo' | 'ipa' | 'ips' | 'umum' = 'all') => {
    setSelectedSubjectFilter(filter);
    let filtered = [...cerdasCermatQuestions];
    if (filter !== 'all') {
      filtered = filtered.filter(q => q.category === filter);
    }
    // Shuffle questions
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setQuestionsList(shuffled);
    setCurrentQuestionIndex(0);
    setSessionScore(0);
    setCorrectCount(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setTimeLeft(20);
    setStartTime(Date.now());
    setGameMode('playing');
  };

  // Timer countdown
  useEffect(() => {
    if (gameMode !== 'playing' || isAnswerSubmitted) return;

    if (timeLeft <= 0) {
      handleAnswerTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameMode, timeLeft, isAnswerSubmitted]);

  const handleAnswerTimeout = () => {
    setIsAnswerSubmitted(true);
    // Timeout is counted as wrong answer
  };

  const handleChooseOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
    setIsAnswerSubmitted(true);

    const currentQ = questionsList[currentQuestionIndex];
    if (idx === currentQ.correctIndex) {
      // Correct! 100 base points + speed bonus
      const speedBonus = timeLeft * 3;
      setSessionScore(prev => prev + 100 + speedBonus);
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionsList.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setTimeLeft(20);
    } else {
      // Finish game
      const totalSeconds = Math.round((Date.now() - startTime) / 1000);
      setTimeSpent(totalSeconds);
      setGameMode('result');

      // Auto save score if logged in
      if (currentUser) {
        submitCerdasCermatScore({
          userId: currentUser.id,
          displayName: currentUser.displayName || currentUser.name,
          usn: currentUser.usn || currentUser.name,
          userRole: currentUser.role,
          userClassOrMapel: currentUser.role === 'guru' ? (currentUser.mapel || 'Guru') : (currentUser.kelas || 'Siswa'),
          userAvatar: currentUser.avatar,
          score: sessionScore,
          correctAnswers: correctCount,
          totalQuestions: questionsList.length,
          timeSpentSeconds: totalSeconds,
          weekLabel: 'Minggu ke-1 November 2026',
        });
      }
    }
  };

  // Top 3 unique scorers
  const sortedScores = [...cerdasCermatScores].sort((a, b) => b.score - a.score);
  const top3Scores: typeof cerdasCermatScores = [];
  const seenUsers = new Set<string>();
  for (const s of sortedScores) {
    if (!seenUsers.has(s.userId)) {
      seenUsers.add(s.userId);
      top3Scores.push(s);
      if (top3Scores.length === 3) break;
    }
  }

  const currentQ = questionsList[currentQuestionIndex];

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Cerdas Cermat Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden border border-emerald-700">
        <div className="absolute -right-8 -bottom-8 opacity-10 text-white pointer-events-none">
          <Brain className="w-64 h-64" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ARENA KOMPETISI AKADEMIK SMPI AL-AKBAR</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Game Cerdas Cermat PINTAR
              <span className="text-amber-400">⚡</span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed">
              Uji ketangkasan wawasan <strong>Matematika, Bahasa Indonesia, IPA, IPS, dan Pengetahuan Umum</strong>. Raih skor tertinggi dan tempati Top 3 Peringkat Mingguan yang diumumkan ke seluruh sekolah!
            </p>
          </div>

          {/* Quick Start / Announcement Button */}
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            {isTeacherOrAdmin && (
              <button
                type="button"
                onClick={() => announceTop3Weekly('Minggu ke-1 November 2026')}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Trophy className="w-4 h-4" />
                <span>Umumkan Top 3 ke Beranda</span>
              </button>
            )}
            {gameMode === 'lobby' ? (
              <button
                type="button"
                onClick={() => handleStartGame('all')}
                className="px-5 py-2.5 rounded-xl bg-white text-emerald-900 font-extrabold text-xs shadow-md hover:bg-emerald-50 transition-all active:scale-95 flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-emerald-800 text-emerald-800" />
                <span>Mulai Grand Challenge (15 Soal)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setGameMode('lobby')}
                className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-xs transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Kembali ke Menu</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TOP 3 WEEKLY LEADERBOARD CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Top 3 Peringkat Mingguan (Leaderboard)
              </h3>
              <p className="text-[11px] text-slate-500">
                Diumumkan tiap pekan di Pengumuman Utama SMPI AL-AKBAR
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            Minggu ke-1 November 2026
          </span>
        </div>

        {/* Podium Top 3 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
          {top3Scores.map((scorer, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const isThird = index === 2;

            const badgeBg = isFirst
              ? 'bg-gradient-to-b from-amber-50 to-yellow-50 border-amber-300'
              : isSecond
              ? 'bg-gradient-to-b from-slate-50 to-slate-100/70 border-slate-300'
              : 'bg-gradient-to-b from-orange-50 to-amber-50/50 border-orange-200';

            const medalColor = isFirst ? 'text-amber-500' : isSecond ? 'text-slate-400' : 'text-orange-500';
            const medalLabel = isFirst ? 'JUARA 1 🥇' : isSecond ? 'JUARA 2 🥈' : 'JUARA 3 🥉';

            return (
              <div
                key={scorer.id}
                className={`p-4 rounded-2xl border ${badgeBg} relative flex items-center gap-3 shadow-2xs hover:shadow-xs transition-shadow`}
              >
                {/* Avatar with rank medal */}
                <div className="relative shrink-0">
                  <img
                    src={scorer.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={scorer.displayName}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-xs"
                  />
                  <span className={`absolute -bottom-1 -right-1 text-xs font-black`}>
                    {isFirst ? '🥇' : isSecond ? '🥈' : '🥉'}
                  </span>
                </div>

                <div className="truncate flex-1">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider ${medalColor}`}>
                    {medalLabel}
                  </span>
                  {/* Nama Panggilan on top */}
                  <h4 className="text-xs font-black text-slate-900 truncate">
                    {scorer.displayName}
                  </h4>
                  {/* Nama Asli directly underneath without "USN:" */}
                  <p className="text-[11px] text-slate-600 font-medium truncate">
                    {scorer.usn} • {scorer.userClassOrMapel}
                  </p>
                  <p className="text-xs font-black text-emerald-800 mt-1">
                    {scorer.score} Poin <span className="text-[10px] text-slate-500 font-normal">({scorer.correctAnswers}/{scorer.totalQuestions} Benar)</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LOBBY VIEW: 3-ROW COLUMN STRUCTURE (MTK, B. INDO, IPA, IPS, UMUM) */}
      {gameMode === 'lobby' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Pilih Kategori Pembelajaran (Kolom 3 Baris)
              </h2>
              <p className="text-xs text-slate-500">
                Semua mata pelajaran terintegrasi dalam modul cerdas cermat 3 baris
              </p>
            </div>
          </div>

          {/* Kolom 3 Baris Layout */}
          <div className="space-y-3">
            
            {/* BARIS 1: MTK & B. INDONESIA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Box 1: MTK */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-300 transition-all shadow-xs flex items-center justify-between group">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
                    📐
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900">Matematika (MTK)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">SMP</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      Aljabar, operasi bilangan bulat, pecahan, & rumus geometri
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleStartGame('mtk')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 shadow-xs transition-transform active:scale-95"
                >
                  Mulai Soal MTK
                </button>
              </div>

              {/* Box 2: Bahasa Indonesia */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-300 transition-all shadow-xs flex items-center justify-between group">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
                    📖
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900">Bahasa Indonesia (B. Indo)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">Literasi</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      Teks LHO, ide pokok paragraf, kata baku KBBI, & majas
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleStartGame('bindo')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 shadow-xs transition-transform active:scale-95"
                >
                  Mulai B. Indo
                </button>
              </div>
            </div>

            {/* BARIS 2: IPA & IPS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Box 3: IPA */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-300 transition-all shadow-xs flex items-center justify-between group">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
                    🔬
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900">IPA Terpadu</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">Sains</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      Organel sel, wujud zat menyublim, & tata surya planet
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleStartGame('ipa')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 shadow-xs transition-transform active:scale-95"
                >
                  Mulai Soal IPA
                </button>
              </div>

              {/* Box 4: IPS */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-300 transition-all shadow-xs flex items-center justify-between group">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-700 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
                    🌏
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900">Ilmu Pengetahuan Sosial (IPS)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold">Sosial</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      Kerajaan Islam Nusantara, garis khatulistiwa, & MEA
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleStartGame('ips')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 shadow-xs transition-transform active:scale-95"
                >
                  Mulai Soal IPS
                </button>
              </div>
            </div>

            {/* BARIS 3: PENGETAHUAN UMUM & GRAND COMBINED CHALLENGE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Box 5: Pengetahuan Umum */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-300 transition-all shadow-xs flex items-center justify-between group">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
                    💡
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900">Pengetahuan Umum & Kebangsaan</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">Wawasan</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      Sumpah Pemuda, Masjid Al-Akbar, & pengetahuan dunia
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleStartGame('umum')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 shadow-xs transition-transform active:scale-95"
                >
                  Mulai Soal Umum
                </button>
              </div>

              {/* Box 6: Grand Championship (Semua 5 Mapel Sekaligus) */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 rounded-2xl p-4 border-2 border-emerald-400 hover:border-emerald-500 transition-all shadow-xs flex items-center justify-between group">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    🏆
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-emerald-950">Grand Challenge Cerdas Cermat</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black">TOP 3</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 mt-0.5 truncate">
                      15 soal acak gabungan MTK, B. Indo, IPA, IPS & Umum
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleStartGame('all')}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shrink-0 shadow-md transition-transform active:scale-95"
                >
                  Tantang Sekarang!
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PLAYING GAME VIEW */}
      {gameMode === 'playing' && currentQ && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in">
          {/* Top Status Bar: Question Progress, Category, Timer, Live Score */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-xs">
                Soal {currentQuestionIndex + 1} dari {questionsList.length}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs uppercase">
                {currentQ.categoryLabel}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Timer Bar */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-black text-xs">
                <Timer className="w-4 h-4 text-amber-600 animate-spin" />
                <span>{timeLeft}s</span>
              </div>

              {/* Live Score */}
              <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-xs">
                <Flame className="w-4 h-4 text-amber-300" />
                <span>{sessionScore} Poin</span>
              </div>
            </div>
          </div>

          {/* Question Text */}
          <div className="py-2">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';
              if (isAnswerSubmitted) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold ring-2 ring-emerald-200';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-red-50 border-red-300 text-red-900 font-bold';
                } else {
                  btnStyle = 'opacity-50 border-slate-200';
                }
              }

              const letters = ['A', 'B', 'C', 'D'];

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswerSubmitted}
                  onClick={() => handleChooseOption(idx)}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all text-xs sm:text-sm ${btnStyle}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-black shrink-0 text-slate-700 shadow-2xs">
                    {letters[idx]}
                  </span>
                  <span className="flex-1 leading-relaxed">{opt}</span>
                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box on Answer Submission */}
          {isAnswerSubmitted && (
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>Pembahasan Singkat:</span>
              </div>
              <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                {currentQ.explanation}
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
                >
                  <span>{currentQuestionIndex < questionsList.length - 1 ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RESULTS VIEW */}
      {gameMode === 'result' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-xl mx-auto shadow-md space-y-6 animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-white mx-auto flex items-center justify-center shadow-lg transform -rotate-3">
            <Trophy className="w-10 h-10 fill-white" />
          </div>

          <div>
            <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-900">
              Babak Selesai!
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Luar Biasa, Santri Berprestasi! 🎉
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {currentUser?.displayName || currentUser?.name} ({currentUser?.usn || currentUser?.name})
            </p>
          </div>

          {/* Score card grid */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Total Skor</p>
              <p className="text-xl sm:text-2xl font-black text-emerald-700">{sessionScore}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Jawaban Benar</p>
              <p className="text-xl sm:text-2xl font-black text-slate-800">
                {correctCount} / {questionsList.length}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Waktu Selesai</p>
              <p className="text-xl sm:text-2xl font-black text-slate-800">{timeSpent}s</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 bg-amber-50 p-3 rounded-xl border border-amber-200 leading-relaxed font-medium">
            Skor Anda telah otomatis dicatat di sistem sekolah. Tetap aktif berlatih untuk mempertahankan posisi di <strong>Top 3 Pengumuman Mingguan</strong>!
          </p>

          <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
            <button
              type="button"
              onClick={() => handleStartGame(selectedSubjectFilter)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Coba Lagi</span>
            </button>
            <button
              type="button"
              onClick={() => setGameMode('lobby')}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Kembali ke Menu Game
            </button>
            {isTeacherOrAdmin && (
              <button
                type="button"
                onClick={() => announceTop3Weekly('Minggu ke-1 November 2026')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-xs shadow-sm transition-colors"
              >
                Umumkan ke Pengumuman 📢
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
