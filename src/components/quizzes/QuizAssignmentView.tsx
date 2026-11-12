import React, { useState } from 'react';
import {
  BookOpenCheck,
  KeyRound,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Plus,
  ArrowRight,
  FileText,
  Award,
  Sparkles,
  ChevronRight,
  Send,
  X,
  Check,
  GraduationCap,
  Eye,
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Quiz, QuizQuestion, Assignment, AssignmentSubmission } from '../../types';
import { UserBadgeList } from '../common/UserBadge';

export const QuizAssignmentView: React.FC = () => {
  const {
    currentUser,
    users,
    quizzes,
    assignments,
    quizAttempts,
    submissions,
    addQuiz,
    addAssignment,
    submitQuizAttempt,
    submitAssignment,
    gradeSubmission,
    branding,
    getQuizByCode,
    getAssignmentByCode,
  } = useApp();

  const isTeacher = currentUser?.role === 'guru' || currentUser?.isAdmin;

  // Active sub-section: 'all' | 'kuis' | 'tugas'
  const [subTab, setSubTab] = useState<'kuis' | 'tugas'>('kuis');

  // Code input box
  const [inputCode, setInputCode] = useState('');
  const [codeError, setCodeError] = useState('');

  // Modals
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);
  const [showGradingModal, setShowGradingModal] = useState<Assignment | null>(null);

  // Quiz Runner state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizScoreResult, setQuizScoreResult] = useState<{ score: number; total: number; percentage: number } | null>(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(0);

  // Assignment Submission state
  const [submissionText, setSubmissionText] = useState('');
  const [submissionFile, setSubmissionFile] = useState('');

  // Teacher Grading inputs
  const [gradingScores, setGradingScores] = useState<Record<string, number>>({});
  const [gradingFeedbacks, setGradingFeedbacks] = useState<Record<string, string>>({});

  // Form states for creating Quiz
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizCode, setNewQuizCode] = useState('');
  const [newQuizSubject, setNewQuizSubject] = useState(currentUser?.mapel || 'Matematika');
  const [newQuizTargetClass, setNewQuizTargetClass] = useState('VII A');
  const [newQuizDuration, setNewQuizDuration] = useState(25);
  const [newQuizDeadline, setNewQuizDeadline] = useState('2026-10-25');
  const [newQuizDescription, setNewQuizDescription] = useState('');
  const [newQuizQuestions, setNewQuizQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q-new-1',
      question: 'Tuliskan pertanyaan nomor 1 di sini...',
      options: ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'],
      correctAnswerIndex: 0,
      explanation: 'Penjelasan jawaban benar.',
    },
  ]);

  // Form states for creating Assignment
  const [newAsgTitle, setNewAsgTitle] = useState('');
  const [newAsgCode, setNewAsgCode] = useState('');
  const [newAsgSubject, setNewAsgSubject] = useState(currentUser?.mapel || 'Matematika');
  const [newAsgTargetClass, setNewAsgTargetClass] = useState('VII A');
  const [newAsgDeadline, setNewAsgDeadline] = useState('2026-10-22');
  const [newAsgDescription, setNewAsgDescription] = useState('');
  const [newAsgMaxScore, setNewAsgMaxScore] = useState(100);

  // Handle Code Search / Entry
  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError('');
    const code = inputCode.trim().toUpperCase();
    if (!code) return;

    // Check quiz first
    const matchedQuiz = getQuizByCode(code);
    if (matchedQuiz) {
      startQuiz(matchedQuiz);
      setInputCode('');
      return;
    }

    // Check assignment
    const matchedAsg = getAssignmentByCode(code);
    if (matchedAsg) {
      openAssignment(matchedAsg);
      setInputCode('');
      return;
    }

    setCodeError(`Kode "${code}" tidak ditemukan. Pastikan huruf dan angka sesuai yang diberikan guru.`);
  };

  // Start Quiz Runner
  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizFinished(false);
    setQuizScoreResult(null);
    setTimeLeftSeconds(quiz.durationMinutes * 60);
  };

  // Timer countdown
  React.useEffect(() => {
    if (!activeQuiz || quizFinished || timeLeftSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          // Time expired, auto submit
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeQuiz, quizFinished, timeLeftSeconds]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (quizFinished) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleFinishQuiz = () => {
    if (!activeQuiz || !currentUser) return;
    let correctCount = 0;
    activeQuiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const total = activeQuiz.questions.length;
    const percentage = Math.round((correctCount / total) * 100);

    const result = { score: correctCount, total, percentage };
    setQuizScoreResult(result);
    setQuizFinished(true);

    submitQuizAttempt({
      quizId: activeQuiz.id,
      quizCode: activeQuiz.code,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentClass: currentUser.kelas || 'Siswa',
      score: correctCount,
      totalQuestions: total,
      percentage,
      selectedAnswers,
    });
  };

  // Open assignment modal
  const openAssignment = (asg: Assignment) => {
    setActiveAssignment(asg);
    // Find existing submission if any
    const existing = submissions.find(
      s => s.assignmentId === asg.id && s.studentId === currentUser?.id
    );
    if (existing) {
      setSubmissionText(existing.submissionText);
      setSubmissionFile(existing.fileAttachment || '');
    } else {
      setSubmissionText('');
      setSubmissionFile('');
    }
  };

  const handleSubmitAssignmentForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignment || !currentUser || !submissionText.trim()) return;

    submitAssignment({
      assignmentId: activeAssignment.id,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentClass: currentUser.kelas || 'Siswa',
      submissionText,
      fileAttachment: submissionFile || undefined,
    });

    setActiveAssignment(null);
  };

  // Create quiz handlers
  const handleAddQuestionToNewQuiz = () => {
    setNewQuizQuestions(prev => [
      ...prev,
      {
        id: `q-new-${Date.now()}`,
        question: `Pertanyaan nomor ${prev.length + 1}...`,
        options: ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'],
        correctAnswerIndex: 0,
        explanation: 'Penjelasan jawaban.',
      },
    ]);
  };

  const handleSaveNewQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuizTitle.trim() || !newQuizCode.trim() || !currentUser) return;

    addQuiz({
      code: newQuizCode.trim().toUpperCase(),
      title: newQuizTitle,
      subject: newQuizSubject,
      targetClass: newQuizTargetClass,
      description: newQuizDescription,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      durationMinutes: Number(newQuizDuration) || 20,
      deadline: newQuizDeadline,
      questions: newQuizQuestions,
      isAppQuiz: false,
    });

    setShowCreateQuizModal(false);
    setNewQuizTitle('');
    setNewQuizCode('');
    setNewQuizDescription('');
  };

  // Create assignment handler
  const handleSaveNewAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgTitle.trim() || !newAsgCode.trim() || !currentUser) return;

    addAssignment({
      code: newAsgCode.trim().toUpperCase(),
      title: newAsgTitle,
      subject: newAsgSubject,
      targetClass: newAsgTargetClass,
      description: newAsgDescription,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      deadline: newAsgDeadline,
      maxScore: Number(newAsgMaxScore) || 100,
    });

    setShowCreateAssignmentModal(false);
    setNewAsgTitle('');
    setNewAsgCode('');
    setNewAsgDescription('');
  };

  // Grade student submission
  const handleSaveGrade = (subId: string) => {
    const score = gradingScores[subId] !== undefined ? gradingScores[subId] : 90;
    const feedback = gradingFeedbacks[subId] || 'Tugas telah diperiksa dengan baik.';
    gradeSubmission(subId, score, feedback);
  };

  return (
    <div className="space-y-6">

      {/* Hero Header & Quick Code Entry Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1.5"
                style={{ backgroundColor: branding.primaryColor }}
              >
                <BookOpenCheck className="w-3.5 h-3.5" />
                Pusat Asesmen PINTAR
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Pengerjaan Soal Mandiri & Ujian Guru
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
              Kuis Interaktif & Pengumpulan Tugas
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Kerjakan kuis latihan dari aplikasi atau masukkan kode rahasia yang dibagikan guru di kelas.
            </p>
          </div>

          {/* Teacher action buttons */}
          {isTeacher && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowCreateQuizModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-transform active:scale-95"
                style={{ backgroundColor: branding.primaryColor }}
              >
                <Plus className="w-4 h-4" />
                <span>Buat Kuis Baru</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCreateAssignmentModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 shadow-xs transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Tugas Baru</span>
              </button>
            </div>
          )}
        </div>

        {/* Feature: Masukkan Kode Soal / Tugas yang Diberikan Guru */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-amber-50/50 to-orange-50/60 border border-emerald-200/80 shadow-2xs">
          <form onSubmit={handleCodeSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2 text-slate-700 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">Punya Kode Soal / Tugas?</span>
                <span className="text-[11px] text-slate-500">Masukkan kode guru untuk membuka ujian</span>
              </div>
            </div>

            <div className="flex-1 w-full flex items-center gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value);
                  setCodeError('');
                }}
                placeholder="Contoh: PAI-7A, MAT-SMP-1, PINTAR-AKBAR..."
                className="flex-1 uppercase font-mono tracking-wider font-bold text-sm px-4 py-2.5 rounded-xl bg-white border border-emerald-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl font-bold text-xs text-white shadow-xs shrink-0 transition-transform active:scale-95 flex items-center gap-1.5"
                style={{ backgroundColor: branding.primaryColor }}
              >
                <span>Buka & Kerjakan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {codeError && (
            <p className="text-xs text-red-600 font-medium mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {codeError}
            </p>
          )}

          {/* Quick Code suggestions for demonstration */}
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-emerald-200/60 text-[11px] flex-wrap">
            <span className="text-slate-600 font-bold">Coba Kode Cepat:</span>
            <button
              type="button"
              onClick={() => {
                setInputCode('PAI-7A');
                const q = getQuizByCode('PAI-7A');
                if (q) startQuiz(q);
              }}
              className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 font-mono font-bold text-emerald-800 hover:bg-emerald-50 transition-colors shadow-2xs"
            >
              PAI-7A (Kuis PAI SMP)
            </button>
            <button
              type="button"
              onClick={() => {
                setInputCode('PINTAR-AKBAR');
                const q = getQuizByCode('PINTAR-AKBAR');
                if (q) startQuiz(q);
              }}
              className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 font-mono font-bold text-amber-800 hover:bg-amber-50 transition-colors shadow-2xs"
            >
              PINTAR-AKBAR (Literasi SMP)
            </button>
            <button
              type="button"
              onClick={() => {
                setInputCode('MAT-SMP-1');
                const q = getQuizByCode('MAT-SMP-1');
                if (q) startQuiz(q);
              }}
              className="px-2.5 py-1 rounded-lg bg-white border border-orange-300 font-mono font-bold text-orange-800 hover:bg-orange-50 transition-colors shadow-2xs"
            >
              MAT-SMP-1 (Matematika SMP)
            </button>
            <button
              type="button"
              onClick={() => {
                setInputCode('IPA-LAB-1');
                const a = getAssignmentByCode('IPA-LAB-1');
                if (a) openAssignment(a);
              }}
              className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 font-mono font-bold text-emerald-800 hover:bg-emerald-50 transition-colors shadow-2xs"
            >
              IPA-LAB-1 (Tugas IPA Terpadu)
            </button>
          </div>
        </div>

      </div>

      {/* Sub Tabs: Kuis Interaktif vs Tugas Sekolah */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setSubTab('kuis')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'kuis'
                ? 'text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
            style={subTab === 'kuis' ? { backgroundColor: branding.primaryColor } : {}}
          >
            <BookOpenCheck className="w-4 h-4" />
            <span>Kuis Interaktif ({quizzes.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('tugas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'tugas'
                ? 'text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
            style={subTab === 'tugas' ? { backgroundColor: branding.primaryColor } : {}}
          >
            <FileText className="w-4 h-4" />
            <span>Tugas Sekolah ({assignments.length})</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline">
          {currentUser?.role === 'siswa' ? `Kelas: ${currentUser.kelas}` : 'Tampilan Guru'}
        </span>
      </div>

      {/* CONTENT: SUBTAB KUIS */}
      {subTab === 'kuis' && (
        <div className="space-y-6">
          
          {/* Section: Kuis Tersedia dari Aplikasi PINTAR */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-extrabold text-slate-900">Kuis Bawaan Aplikasi PINTAR</h3>
              </div>
              <span className="text-[11px] text-slate-400">Latihan mandiri kapan saja</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.filter(q => q.isAppQuiz).map(q => {
                const userAttempt = quizAttempts.find(
                  a => a.quizId === q.id && a.studentId === currentUser?.id
                );

                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          {q.subject}
                        </span>
                        <span className="font-mono text-xs font-extrabold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                          KODE: {q.code}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 mt-2">{q.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{q.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {q.durationMinutes} Menit
                        </span>
                        <span className="flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> {q.questions.length} Soal
                        </span>
                      </div>

                      {userAttempt ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                            Nilai: {userAttempt.percentage}%
                          </span>
                          <button
                            type="button"
                            onClick={() => startQuiz(q)}
                            className="text-xs font-bold text-blue-600 hover:underline"
                          >
                            Ulangi
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startQuiz(q)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs transition-transform active:scale-95"
                          style={{ backgroundColor: branding.primaryColor }}
                        >
                          Mulai Kuis
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Kuis dari Guru Kelas */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-extrabold text-slate-900">Kuis Penilaian Guru Kelas</h3>
              </div>
              <span className="text-[11px] text-slate-400">Wajib dikerjakan sesuai batas waktu</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.filter(q => !q.isAppQuiz).map(q => {
                const userAttempt = quizAttempts.find(
                  a => a.quizId === q.id && a.studentId === currentUser?.id
                );

                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          {q.subject} • {q.targetClass}
                        </span>
                        <span className="font-mono text-xs font-extrabold px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md border border-slate-200">
                          {q.code}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 mt-2">{q.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{q.description}</p>
                      <p className="text-[11px] text-slate-400 mt-1">Oleh: {q.teacherName}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {q.durationMinutes} Menit
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" /> {q.deadline}
                        </span>
                      </div>

                      {userAttempt ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            ✓ Skor: {userAttempt.percentage}%
                          </span>
                          <button
                            type="button"
                            onClick={() => startQuiz(q)}
                            className="text-xs font-bold text-slate-600 hover:text-blue-600"
                          >
                            Review
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startQuiz(q)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs transition-transform active:scale-95"
                          style={{ backgroundColor: branding.primaryColor }}
                        >
                          Kerjakan Sekarang
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* CONTENT: SUBTAB TUGAS */}
      {subTab === 'tugas' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map(asg => {
              const mySub = submissions.find(
                s => s.assignmentId === asg.id && s.studentId === currentUser?.id
              );
              const totalSubs = submissions.filter(s => s.assignmentId === asg.id).length;

              return (
                <div
                  key={asg.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                        {asg.subject}
                      </span>
                      <span className="font-mono text-xs font-extrabold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                        {asg.code}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900 mt-2">{asg.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">{asg.description}</p>
                    <p className="text-[11px] text-slate-400 mt-2">Guru: {asg.teacherName}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 text-red-600 font-semibold">
                        <Clock className="w-3.5 h-3.5" /> Tenggat: {asg.deadline}
                      </span>
                      <span className="text-[11px] text-slate-400">Max: {asg.maxScore} Poin</span>
                    </div>

                    {/* Action depending on user role */}
                    {isTeacher ? (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-slate-500 font-medium">
                          {totalSubs} Siswa Mengumpulkan
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowGradingModal(asg)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Periksa ({totalSubs})
                        </button>
                      </div>
                    ) : mySub ? (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                          {mySub.status === 'dinilai' ? `Nilai: ${mySub.score}/100` : '✓ Sudah Dikirim'}
                        </span>
                        <button
                          type="button"
                          onClick={() => openAssignment(asg)}
                          className="text-xs font-bold text-blue-600 hover:underline"
                        >
                          Lihat / Ubah
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openAssignment(asg)}
                        className="w-full py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-transform active:scale-95"
                        style={{ backgroundColor: branding.primaryColor }}
                      >
                        Kumpulkan Tugas
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: RUNNER KUIS INTERAKTIF */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            {/* Header Runner */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                  {activeQuiz.code}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">{activeQuiz.title}</h3>
              </div>

              {!quizFinished && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 border border-red-200 font-mono font-bold text-xs">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>
                    {Math.floor(timeLeftSeconds / 60)}:
                    {(timeLeftSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>

            {/* Quiz Body */}
            {!quizFinished ? (
              <div className="mt-4 space-y-6">
                {/* Question dots navigation */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {activeQuiz.questions.map((q, idx) => {
                    const isAnswered = selectedAnswers[q.id] !== undefined;
                    const isCurrent = idx === currentQuestionIndex;

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                          isCurrent
                            ? 'ring-2 ring-blue-600 bg-blue-600 text-white'
                            : isAnswered
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Question item */}
                {activeQuiz.questions[currentQuestionIndex] && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-bold uppercase text-slate-400">
                      Soal Nomor {currentQuestionIndex + 1} dari {activeQuiz.questions.length}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-2 leading-relaxed">
                      {activeQuiz.questions[currentQuestionIndex].question}
                    </h4>

                    {/* Options */}
                    <div className="mt-4 space-y-2.5">
                      {activeQuiz.questions[currentQuestionIndex].options.map((opt, optIdx) => {
                        const qId = activeQuiz.questions[currentQuestionIndex].id;
                        const isSelected = selectedAnswers[qId] === optIdx;

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectOption(qId, optIdx)}
                            className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 text-blue-900 font-semibold'
                                : 'bg-white border-slate-200 hover:bg-slate-100/70 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <span
                                className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                                  isSelected
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </div>

                            {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer nav */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 disabled:opacity-40"
                  >
                    Sebelumnya
                  </button>

                  {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentQuestionIndex(prev =>
                          Math.min(activeQuiz.questions.length - 1, prev + 1)
                        )
                      }
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
                      style={{ backgroundColor: branding.primaryColor }}
                    >
                      Selanjutnya
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFinishQuiz}
                      className="px-5 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                    >
                      Kirim & Selesaikan Kuis
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Score & Result Review */
              <div className="mt-6 text-center space-y-5">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                  <Award className="w-10 h-10" />
                </div>

                <div>
                  <h4 className="text-xl font-extrabold text-slate-900">Kuis Selesai!</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Hasil ujian Anda telah disimpan dalam basis data akademik sekolah.
                  </p>
                </div>

                {quizScoreResult && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Skor Akhir</span>
                    <div className="text-4xl font-extrabold text-slate-900 mt-1">
                      {quizScoreResult.percentage}%
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Menjawab benar {quizScoreResult.score} dari {quizScoreResult.total} soal
                    </p>
                  </div>
                )}

                {/* Detailed Answer Review */}
                <div className="text-left space-y-3 pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-800">Pembahasan & Kunci Jawaban:</p>
                  {activeQuiz.questions.map((q, i) => {
                    const chosen = selectedAnswers[q.id];
                    const isCorrect = chosen === q.correctAnswerIndex;

                    return (
                      <div key={q.id} className="p-3 bg-slate-50 rounded-xl text-xs border border-slate-200">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">Soal {i + 1}: {q.question}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {isCorrect ? 'Benar' : 'Salah'}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-1">
                          Jawaban Anda: <span className="font-semibold">{chosen !== undefined ? q.options[chosen] : 'Tidak dijawab'}</span>
                        </p>
                        <p className="text-emerald-700 font-semibold mt-0.5">
                          Kunci Benar: {q.options[q.correctAnswerIndex]}
                        </p>
                        {q.explanation && (
                          <p className="text-slate-500 text-[11px] mt-1 italic">
                            Penjelasan: {q.explanation}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveQuiz(null)}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs text-white"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    Tutup & Kembali
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* MODAL: PENGUMPULAN TUGAS SISWA */}
      {activeAssignment && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                  {activeAssignment.code}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">{activeAssignment.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveAssignment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <p className="font-bold text-slate-800">Petunjuk Tugas:</p>
              <p className="text-slate-600 mt-1 leading-relaxed">{activeAssignment.description}</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                <span>Tenggat: <strong className="text-red-600">{activeAssignment.deadline}</strong></span>
                <span>Nilai Maksimal: {activeAssignment.maxScore}</span>
              </div>
            </div>

            <form onSubmit={handleSubmitAssignmentForm} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Lembar Jawaban / Uraian Tugas Anda *
                </label>
                <textarea
                  required
                  rows={4}
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Ketikkan teks jawaban, resume, atau uraian laporan praktikum Anda di sini..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Lampiran Berkas / Link Drive (Opsional)
                </label>
                <input
                  type="text"
                  value={submissionFile}
                  onChange={(e) => setSubmissionFile(e.target.value)}
                  placeholder="Contoh: https://drive.google.com/... atau Laporan_Fisika_Alief.pdf"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveAssignment(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white font-bold shadow-sm"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  Kirimkan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PEMERIKSAAN & PENILAIAN TUGAS OLEH GURU */}
      {showGradingModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                  {showGradingModal.code}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  Daftar Pengumpulan: {showGradingModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGradingModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {submissions.filter(s => s.assignmentId === showGradingModal.id).length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8">Belum ada siswa yang mengunggah jawaban untuk tugas ini.</p>
              ) : (
                submissions
                  .filter(s => s.assignmentId === showGradingModal.id)
                  .map(sub => {
                    const studentUser = users.find(u => u.id === sub.studentId);
                    return (
                    <div key={sub.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-slate-900">
                            {studentUser?.displayName || sub.studentName}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            (USN: {studentUser?.usn || sub.studentName} • {sub.studentClass})
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(sub.submittedAt).toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700">
                        <p className="font-medium">{sub.submissionText}</p>
                        {sub.fileAttachment && (
                          <p className="text-emerald-700 font-semibold text-[11px] mt-1 truncate">
                            📎 Lampiran: {sub.fileAttachment}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <div className="w-24">
                          <label className="text-[10px] font-semibold text-slate-500 block">Nilai (0-100)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            defaultValue={sub.score || 90}
                            onChange={(e) =>
                              setGradingScores(prev => ({
                                ...prev,
                                [sub.id]: Number(e.target.value),
                              }))
                            }
                            className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] font-semibold text-slate-500 block">Catatan / Umpan Balik Guru</label>
                          <input
                            type="text"
                            defaultValue={sub.feedback || 'Pengerjaan bagus dan lengkap.'}
                            onChange={(e) =>
                              setGradingFeedbacks(prev => ({
                                ...prev,
                                [sub.id]: e.target.value,
                              }))
                            }
                            placeholder="Tulis saran perbaikan..."
                            className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                        <div className="pt-4">
                          <button
                            type="button"
                            onClick={() => handleSaveGrade(sub.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs"
                            style={{ backgroundColor: branding.primaryColor }}
                          >
                            Simpan Nilai
                          </button>
                        </div>
                      </div>
                    </div>
                    );
                  })
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setShowGradingModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BUAT KUIS BARU OLEH GURU */}
      {showCreateQuizModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpenCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-extrabold text-slate-900">Buat Kuis Baru untuk Siswa</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateQuizModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewQuiz} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Judul Kuis *</label>
                  <input
                    type="text"
                    required
                    value={newQuizTitle}
                    onChange={(e) => setNewQuizTitle(e.target.value)}
                    placeholder="Contoh: Kuis Harian Trigonometri"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode Unik Kuis *</label>
                  <input
                    type="text"
                    required
                    value={newQuizCode}
                    onChange={(e) => setNewQuizCode(e.target.value.toUpperCase())}
                    placeholder="Contoh: MAT-TRIG-1"
                    className="w-full uppercase font-mono font-bold px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    value={newQuizSubject}
                    onChange={(e) => setNewQuizSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Durasi (Menit)</label>
                  <input
                    type="number"
                    value={newQuizDuration}
                    onChange={(e) => setNewQuizDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Batas Tenggat</label>
                  <input
                    type="date"
                    value={newQuizDeadline}
                    onChange={(e) => setNewQuizDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi / Petunjuk</label>
                <textarea
                  rows={2}
                  value={newQuizDescription}
                  onChange={(e) => setNewQuizDescription(e.target.value)}
                  placeholder="Petunjuk pengerjaan..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden"
                />
              </div>

              {/* Questions list builder */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">Daftar Pertanyaan ({newQuizQuestions.length})</h4>
                  <button
                    type="button"
                    onClick={handleAddQuestionToNewQuiz}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    + Tambah Soal
                  </button>
                </div>

                {newQuizQuestions.map((q, idx) => (
                  <div key={q.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700">Soal {idx + 1}</span>
                      <span className="text-[10px] text-slate-400">Pilih tombol radio untuk kunci jawaban benar</span>
                    </div>

                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewQuizQuestions(prev =>
                          prev.map((item, i) => (i === idx ? { ...item, question: val } : item))
                        );
                      }}
                      className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-200 font-medium"
                    />

                    {/* Options */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, optI) => (
                        <div key={optI} className="flex items-center space-x-1.5">
                          <input
                            type="radio"
                            name={`correct-${q.id}`}
                            checked={q.correctAnswerIndex === optI}
                            onChange={() => {
                              setNewQuizQuestions(prev =>
                                prev.map((item, i) =>
                                  i === idx ? { ...item, correctAnswerIndex: optI } : item
                                )
                              );
                            }}
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const text = e.target.value;
                              setNewQuizQuestions(prev =>
                                prev.map((item, i) =>
                                  i === idx
                                    ? {
                                        ...item,
                                        options: item.options.map((o, oi) => (oi === optI ? text : o)),
                                      }
                                    : item
                                )
                              );
                            }}
                            className="flex-1 px-2 py-1 bg-white rounded-md border border-slate-200 text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateQuizModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white font-bold"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  Terbitkan Kuis & Berikan Kode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BUAT TUGAS BARU OLEH GURU */}
      {showCreateAssignmentModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-800" />
                <h3 className="text-base font-extrabold text-slate-900">Buat Tugas Baru</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateAssignmentModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewAssignment} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Judul Tugas *</label>
                  <input
                    type="text"
                    required
                    value={newAsgTitle}
                    onChange={(e) => setNewAsgTitle(e.target.value)}
                    placeholder="Contoh: Laporan Eksperimen Optik"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode Unik Tugas *</label>
                  <input
                    type="text"
                    required
                    value={newAsgCode}
                    onChange={(e) => setNewAsgCode(e.target.value.toUpperCase())}
                    placeholder="Contoh: TUGAS-FIS-02"
                    className="w-full uppercase font-mono font-bold px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    value={newAsgSubject}
                    onChange={(e) => setNewAsgSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tenggat Waktu</label>
                  <input
                    type="date"
                    value={newAsgDeadline}
                    onChange={(e) => setNewAsgDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nilai Maksimal</label>
                  <input
                    type="number"
                    value={newAsgMaxScore}
                    onChange={(e) => setNewAsgMaxScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instruksi Tugas *</label>
                <textarea
                  required
                  rows={3}
                  value={newAsgDescription}
                  onChange={(e) => setNewAsgDescription(e.target.value)}
                  placeholder="Detail instruksi pengerjaan tugas..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateAssignmentModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white font-bold"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  Terbitkan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
