import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Announcement,
  Quiz,
  QuizAttempt,
  Assignment,
  AssignmentSubmission,
  CalendarEvent,
  AppNotification,
  ChatMessage,
  AdminSurvey,
  SchoolBranding,
  CerdasCermatScore
} from '../types';
import {
  initialUsers,
  initialAnnouncements,
  initialQuizzes,
  initialQuizAttempts,
  initialAssignments,
  initialSubmissions,
  initialCalendarEvents,
  initialNotifications,
  initialChatMessages,
  initialAdminSurveys,
  initialBranding,
  initialCerdasCermatScores
} from '../data/initialData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  branding: SchoolBranding;
  announcements: Announcement[];
  quizzes: Quiz[];
  quizAttempts: QuizAttempt[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  calendarEvents: CalendarEvent[];
  notifications: AppNotification[];
  chatMessages: ChatMessage[];
  adminSurveys: AdminSurvey[];
  cerdasCermatScores: CerdasCermatScore[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isNavDrawerOpen: boolean;
  setIsNavDrawerOpen: (open: boolean) => void;
  quickToast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  setQuickToast: (toast: { message: string; type: 'success' | 'info' | 'warning' } | null) => void;

  // Friendship & Mutual Celebration
  mutualFriendCelebration: {
    friendName: string;
    friendDisplayName: string;
    friendUsn: string;
    friendAvatar?: string;
  } | null;
  clearMutualCelebration: () => void;
  sendFriendRequest: (targetUserId: string) => void;
  acceptFriendRequest: (targetUserId: string) => void;
  cancelFriendRequest: (targetUserId: string) => void;
  removeFriend: (targetUserId: string) => void;
  addFriendByLink: (friendIdOrLink: string) => { success: boolean; message: string };

  // Cerdas Cermat Game
  submitCerdasCermatScore: (scoreData: Omit<CerdasCermatScore, 'id' | 'createdAt'>) => void;
  announceTop3Weekly: (weekLabel?: string) => void;

  // Auth actions
  login: (email: string, password: string, selectedClass?: string) => { success: boolean; message: string };
  register: (data: Omit<User, 'id' | 'createdAt'>) => { success: boolean; message: string };
  logout: () => void;
  quickLoginAs: (userId: string) => void;
  resetPassword: (email: string, newPass: string) => { success: boolean; message: string };
  updateUserPasswordByModerator: (userId: string, newPass: string) => void;
  updateUserProfile: (userId: string, updates: Partial<User>) => void;
  updateUserBadges: (userId: string, badges: string[]) => void;
  setUserClass: (newClass: string) => void;
  sendAccountBackupToEmail: (userId: string) => { success: boolean; message: string };

  // Content actions
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'createdAt' | 'comments'>) => void;
  addComment: (announcementId: string, content: string) => void;
  deleteAnnouncement: (id: string) => void;

  // Quiz actions
  addQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => Quiz;
  submitQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'completedAt'>) => QuizAttempt;
  getQuizByCode: (code: string) => Quiz | undefined;

  // Assignment actions
  addAssignment: (asg: Omit<Assignment, 'id' | 'createdAt'>) => Assignment;
  submitAssignment: (sub: Omit<AssignmentSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  gradeSubmission: (submissionId: string, score: number, feedback: string) => void;
  getAssignmentByCode: (code: string) => Assignment | undefined;

  // Calendar
  addCalendarEvent: (evt: Omit<CalendarEvent, 'id'>) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;

  // Chat
  sendChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;

  // Admin & Branding
  submitAdminSurvey: (survey: Omit<AdminSurvey, 'id' | 'submittedAt' | 'status'>) => void;
  reviewAdminSurvey: (surveyId: string, status: 'disetujui' | 'ditolak') => void;
  updateBranding: (newBranding: Partial<SchoolBranding>) => void;
  resetAllDataToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Failed to load ${key} from localStorage`, e);
    return defaultValue;
  }
}

function saveStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = loadStorage<User[]>('pintar_users_v5', []);
    if (saved && saved.length > 0) {
      return saved;
    }
    return initialUsers;
  });

  // Tampilan awal: jika sudah login sekali, tersimpan permanen kecuali sengaja logout
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return loadStorage<User | null>('pintar_current_user_v5', null);
  });

  const [branding, setBranding] = useState<SchoolBranding>(() => {
    const saved = loadStorage<SchoolBranding>('pintar_branding_v5', initialBranding);
    return saved || initialBranding;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = loadStorage<Announcement[]>('pintar_announcements_v5', []);
    return saved.length > 0 ? saved : initialAnnouncements;
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = loadStorage<Quiz[]>('pintar_quizzes_v5', []);
    return saved.length > 0 ? saved : initialQuizzes;
  });

  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() => {
    const saved = loadStorage<QuizAttempt[]>('pintar_quiz_attempts_v5', []);
    return saved.length > 0 ? saved : initialQuizAttempts;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = loadStorage<Assignment[]>('pintar_assignments_v5', []);
    return saved.length > 0 ? saved : initialAssignments;
  });

  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => {
    const saved = loadStorage<AssignmentSubmission[]>('pintar_submissions_v5', []);
    return saved.length > 0 ? saved : initialSubmissions;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = loadStorage<CalendarEvent[]>('pintar_calendar_v5', []);
    return saved.length > 0 ? saved : initialCalendarEvents;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = loadStorage<AppNotification[]>('pintar_notifications_v5', []);
    return saved.length > 0 ? saved : initialNotifications;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = loadStorage<ChatMessage[]>('pintar_chat_v5', []);
    return saved.length > 0 ? saved : initialChatMessages;
  });

  const [adminSurveys, setAdminSurveys] = useState<AdminSurvey[]>(() => {
    const saved = loadStorage<AdminSurvey[]>('pintar_surveys_v5', []);
    return saved.length > 0 ? saved : initialAdminSurveys;
  });

  const [cerdasCermatScores, setCerdasCermatScores] = useState<CerdasCermatScore[]>(() => {
    const saved = loadStorage<CerdasCermatScore[]>('pintar_cerdas_scores_v5', []);
    return saved.length > 0 ? saved : initialCerdasCermatScores;
  });

  const [activeTab, setActiveTab] = useState<string>('pengumuman');
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState<boolean>(false);
  const [quickToast, setQuickToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Mutual friend celebration state for cute popup
  const [mutualFriendCelebration, setMutualFriendCelebration] = useState<{
    friendName: string;
    friendDisplayName: string;
    friendUsn: string;
    friendAvatar?: string;
  } | null>(null);

  // Auto-hide toast after 4s
  useEffect(() => {
    if (quickToast) {
      const timer = setTimeout(() => setQuickToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [quickToast]);

  // Persist state changes
  useEffect(() => saveStorage('pintar_users_v5', users), [users]);
  useEffect(() => saveStorage('pintar_current_user_v5', currentUser), [currentUser]);
  useEffect(() => saveStorage('pintar_branding_v5', branding), [branding]);
  useEffect(() => saveStorage('pintar_announcements_v5', announcements), [announcements]);
  useEffect(() => saveStorage('pintar_quizzes_v5', quizzes), [quizzes]);
  useEffect(() => saveStorage('pintar_quiz_attempts_v5', quizAttempts), [quizAttempts]);
  useEffect(() => saveStorage('pintar_assignments_v5', assignments), [assignments]);
  useEffect(() => saveStorage('pintar_submissions_v5', submissions), [submissions]);
  useEffect(() => saveStorage('pintar_calendar_v5', calendarEvents), [calendarEvents]);
  useEffect(() => saveStorage('pintar_notifications_v5', notifications), [notifications]);
  useEffect(() => saveStorage('pintar_chat_v5', chatMessages), [chatMessages]);
  useEffect(() => saveStorage('pintar_surveys_v5', adminSurveys), [adminSurveys]);
  useEffect(() => saveStorage('pintar_cerdas_scores_v5', cerdasCermatScores), [cerdasCermatScores]);

  // Push notification helper
  const triggerNotification = (
    title: string,
    message: string,
    type: AppNotification['type'],
    userId: string = 'ALL'
  ) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
    setQuickToast({ message: `${title}: ${message}`, type: 'info' });
  };

  // Auth
  const login = (email: string, pass: string, selectedClass?: string) => {
    const found = users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      return { success: false, message: 'Email tidak ditemukan dalam basis data sekolah.' };
    }
    if (found.password !== pass) {
      return { success: false, message: 'Kata sandi tidak sesuai. Jika lupa, hubungi guru moderator atau gunakan tombol Lupa Sandi.' };
    }

    let userToSet = found;
    if (selectedClass && found.role === 'siswa') {
      userToSet = { ...found, kelas: selectedClass };
      setUsers(prev => prev.map(u => (u.id === found.id ? userToSet : u)));
    }

    setCurrentUser(userToSet);
    setQuickToast({
      message: `Selamat datang kembali, ${userToSet.displayName || userToSet.name}! ${userToSet.role === 'siswa' ? `(Kelas ${userToSet.kelas})` : '(Guru)'}`,
      type: 'success',
    });
    return { success: true, message: 'Login berhasil.' };
  };

  const register = (data: Omit<User, 'id' | 'createdAt'>) => {
    const existing = users.find(u => u.email.trim().toLowerCase() === data.email.trim().toLowerCase());
    if (existing) {
      return { success: false, message: 'Email Gmail tersebut sudah terdaftar di sistem PINTAR.' };
    }
    const defaultBadges = data.badges && data.badges.length > 0
      ? data.badges
      : data.role === 'guru'
      ? ['Si Bijak']
      : ['Pekerja Keras'];

    const now = new Date().toISOString();
    const newUser: User = {
      ...data,
      id: `user-${Date.now()}`,
      name: data.displayName || data.usn || data.name,
      usn: data.usn || data.name,
      displayName: data.displayName || data.name,
      createdAt: now,
      emailBackupSentAt: now,
      isModerator: data.role === 'guru',
      isAdmin: false,
      badges: defaultBadges, // Disimpan hanya untuk diketahui admin
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);

    triggerNotification(
      'Salinan Akun Otomatis ke Gmail',
      `Akun Anda berhasil didaftarkan. Salinan data akun (USN: "${newUser.usn}", Nama Buatan: "${newUser.displayName}", Sandi: "${newUser.password}") telah otomatis dikirim ke ${newUser.email} sebagai arsip jaga-jaga.`,
      'pengumuman',
      newUser.id
    );

    setQuickToast({
      message: `Akun berhasil didaftarkan! Salinan data akun telah otomatis dikirim ke Gmail: ${newUser.email}`,
      type: 'success',
    });
    return { success: true, message: 'Registrasi berhasil.' };
  };

  const sendAccountBackupToEmail = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (!target) return { success: false, message: 'Akun pengguna tidak ditemukan.' };
    const now = new Date().toISOString();
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, emailBackupSentAt: now } : u)));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => (prev ? { ...prev, emailBackupSentAt: now } : null));
    }
    triggerNotification(
      'Salinan Akun Terkirim ke Gmail',
      `Salinan kredensial (USN / Nama Asli: "${target.usn}", Nama Buatan: "${target.displayName}", Sandi: "${target.password}", Peran: ${target.role.toUpperCase()}) telah dikirimkan ke ${target.email} untuk arsip jaga-jaga.`,
      'pengumuman',
      userId
    );
    setQuickToast({
      message: `Salinan data akun & kata sandi berhasil dikirim ke ${target.email}`,
      type: 'success',
    });
    return {
      success: true,
      message: `Salinan data akun berhasil dikirim ke ${target.email} sebagai arsip jaga-jaga.`,
    };
  };

  const logout = () => {
    setCurrentUser(null);
    setQuickToast({ message: 'Anda telah keluar dari sistem PINTAR.', type: 'info' });
  };

  const quickLoginAs = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setQuickToast({ message: `Beralih ke akun ${target.name} (${target.role.toUpperCase()})`, type: 'success' });
    }
  };

  const resetPassword = (email: string, newPass: string) => {
    const target = users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    if (!target) {
      return { success: false, message: 'Email tidak ditemukan.' };
    }
    setUsers(prev =>
      prev.map(u => (u.id === target.id ? { ...u, password: newPass } : u))
    );
    if (currentUser?.id === target.id) {
      setCurrentUser(prev => (prev ? { ...prev, password: newPass } : null));
    }
    setQuickToast({ message: `Kata sandi untuk ${target.name} berhasil diperbarui.`, type: 'success' });
    return { success: true, message: 'Kata sandi berhasil diperbarui.' };
  };

  const updateUserPasswordByModerator = (userId: string, newPass: string) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, password: newPass } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser(prev => (prev ? { ...prev, password: newPass } : null));
    }
    triggerNotification(
      'Pemberitahuan Kata Sandi',
      `Kata sandi akun ${target.name} telah di-reset oleh guru moderator.`,
      'pengumuman',
      userId
    );
    setQuickToast({ message: `Kata sandi ${target.name} berhasil diubah oleh moderator.`, type: 'success' });
  };

  const updateUserProfile = (userId: string, updates: Partial<User>) => {
    const updatedName = updates.displayName || updates.usn || updates.name;
    const finalUpdates = {
      ...updates,
      ...(updatedName ? { name: updatedName } : {}),
    };
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, ...finalUpdates } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser(prev => (prev ? { ...prev, ...finalUpdates } : null));
    }
    setQuickToast({ message: 'Profil dan foto berhasil diperbarui.', type: 'success' });
  };

  const updateUserBadges = (userId: string, badges: string[]) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, badges } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser(prev => (prev ? { ...prev, badges } : null));
    }
    setQuickToast({ message: 'Badge akun berhasil diperbarui oleh admin.', type: 'success' });
  };

  const setUserClass = (newClass: string) => {
    if (!currentUser) return;
    setUsers(prev =>
      prev.map(u => (u.id === currentUser.id ? { ...u, kelas: newClass } : u))
    );
    setCurrentUser(prev => (prev ? { ...prev, kelas: newClass } : null));
    setQuickToast({
      message: `Kelas berhasil diganti ke ${newClass}. Portal pengumuman otomatis disesuaikan!`,
      type: 'success',
    });
  };

  // Announcements
  const addAnnouncement = (ann: Omit<Announcement, 'id' | 'createdAt' | 'comments'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString(),
      comments: [],
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    triggerNotification(
      'Pengumuman Baru Sekolah',
      `${ann.authorName} mengunggah pengumuman: "${ann.title}"`,
      'pengumuman'
    );
  };

  const addComment = (announcementId: string, content: string) => {
    if (!currentUser) return;
    const newComment = {
      id: `comm-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.usn || currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatar,
      content,
      createdAt: new Date().toISOString(),
    };
    setAnnouncements(prev =>
      prev.map(a =>
        a.id === announcementId ? { ...a, comments: [...a.comments, newComment] } : a
      )
    );
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    setQuickToast({ message: 'Pengumuman telah dihapus.', type: 'info' });
  };

  // Otomatisasi Penghargaan Badge Berdasarkan Keaktifan & Capaian Siswa
  const evaluateAndAwardBadges = (
    targetUserId: string,
    extra?: {
      newAttempt?: QuizAttempt;
      newSubmission?: AssignmentSubmission;
      newChatMessage?: ChatMessage;
      newScore?: CerdasCermatScore;
    }
  ) => {
    setUsers(prevUsers => {
      const target = prevUsers.find(u => u.id === targetUserId);
      if (!target) return prevUsers;

      const attempts = [
        ...(extra?.newAttempt ? [extra.newAttempt] : []),
        ...quizAttempts.filter(a => a.studentId === targetUserId && (!extra?.newAttempt || a.id !== extra.newAttempt.id))
      ];

      const subs = [
        ...(extra?.newSubmission ? [extra.newSubmission] : []),
        ...submissions.filter(s => s.studentId === targetUserId && (!extra?.newSubmission || s.id !== extra.newSubmission.id))
      ];

      const chats = [
        ...(extra?.newChatMessage ? [extra.newChatMessage] : []),
        ...chatMessages.filter(m => m.senderId === targetUserId && (!extra?.newChatMessage || m.id !== extra.newChatMessage.id))
      ];

      const scores = [
        ...(extra?.newScore ? [extra.newScore] : []),
        ...cerdasCermatScores.filter(s => s.userId === targetUserId && (!extra?.newScore || s.id !== extra.newScore.id))
      ];

      const currentBadges = new Set<string>(target.badges || []);

      // 1. "Si Pintar": nilai kuis >= 85% ATAU skor cerdas cermat >= 200 poin
      const hasHighQuizScore = attempts.some(a => a.percentage >= 85);
      const hasHighGameScore = scores.some(s => s.score >= 200);
      if (hasHighQuizScore || hasHighGameScore) {
        currentBadges.add('Si Pintar');
      }

      // 2. "Pekerja Keras": menyelesaikan 2 atau lebih kuis / tugas
      const totalTasks = attempts.length + subs.length;
      if (totalTasks >= 2) {
        currentBadges.add('Pekerja Keras');
      }

      // 3. "Si Paling Aktif": mengirim 3 atau lebih pesan chat ATAU memiliki 4+ total aktivitas
      if (chats.length >= 3 || (totalTasks + chats.length) >= 4) {
        currentBadges.add('Si Paling Aktif');
      }

      // 4. Guru otomatis mendapatkan 'Si Bijak'
      if (target.role === 'guru') {
        currentBadges.add('Si Bijak');
      }

      const updatedBadgeList = Array.from(currentBadges);
      const oldBadges = target.badges || [];
      const isChanged =
        updatedBadgeList.length !== oldBadges.length ||
        updatedBadgeList.some(b => !oldBadges.includes(b));

      if (!isChanged) return prevUsers;

      const updatedUser: User = { ...target, badges: updatedBadgeList };
      if (currentUser?.id === targetUserId) {
        setCurrentUser(prev => (prev ? { ...prev, badges: updatedBadgeList } : null));
      }
      return prevUsers.map(u => (u.id === targetUserId ? updatedUser : u));
    });
  };

  // Quizzes
  const addQuiz = (data: Omit<Quiz, 'id' | 'createdAt'>): Quiz => {
    const newQuiz: Quiz = {
      ...data,
      id: `quiz-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setQuizzes(prev => [newQuiz, ...prev]);

    // Add to calendar automatically
    const calEvent: CalendarEvent = {
      id: `evt-quiz-${newQuiz.id}`,
      title: `Kuis: ${newQuiz.title} (Kode: ${newQuiz.code})`,
      type: 'jadwal-kuis',
      date: newQuiz.deadline || new Date().toISOString().split('T')[0],
      relatedId: newQuiz.id,
      subject: newQuiz.subject,
      targetClass: newQuiz.targetClass,
      description: `Batas akhir pengerjaan kuis dengan durasi ${newQuiz.durationMinutes} menit.`,
    };
    setCalendarEvents(prev => [...prev, calEvent]);

    // Dispatch automatic notification
    triggerNotification(
      'Kuis Baru Tersedia',
      `Guru ${newQuiz.teacherName} menerbitkan kuis "${newQuiz.title}" (Kode: ${newQuiz.code}).`,
      'kuis_baru'
    );
    return newQuiz;
  };

  const submitQuizAttempt = (data: Omit<QuizAttempt, 'id' | 'completedAt'>): QuizAttempt => {
    const newAttempt: QuizAttempt = {
      ...data,
      id: `att-${Date.now()}`,
      completedAt: new Date().toISOString(),
    };
    setQuizAttempts(prev => [newAttempt, ...prev]);
    evaluateAndAwardBadges(data.studentId, { newAttempt });
    triggerNotification(
      'Kuis Selesai Dikerjakan',
      `Anda berhasil menyelesaikan kuis ${data.quizCode} dengan skor ${data.percentage}%.`,
      'nilai_keluar',
      data.studentId
    );
    return newAttempt;
  };

  const getQuizByCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    return quizzes.find(q => q.code.trim().toUpperCase() === clean);
  };

  // Assignments
  const addAssignment = (data: Omit<Assignment, 'id' | 'createdAt'>): Assignment => {
    const newAsg: Assignment = {
      ...data,
      id: `asg-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAssignments(prev => [newAsg, ...prev]);

    // Add to calendar
    const calEvent: CalendarEvent = {
      id: `evt-asg-${newAsg.id}`,
      title: `Tenggat Tugas: ${newAsg.title} (Kode: ${newAsg.code})`,
      type: 'deadline-tugas',
      date: newAsg.deadline || new Date().toISOString().split('T')[0],
      relatedId: newAsg.id,
      subject: newAsg.subject,
      targetClass: newAsg.targetClass,
      description: `Batas waktu pengumpulan tugas ${newAsg.subject}. Nilai maksimal: ${newAsg.maxScore}.`,
    };
    setCalendarEvents(prev => [...prev, calEvent]);

    // Dispatch automatic notification to students
    triggerNotification(
      'Tugas Baru Diterbitkan',
      `Guru ${newAsg.teacherName} mengunggah tugas "${newAsg.title}" (Kode: ${newAsg.code}). Tenggat: ${newAsg.deadline}`,
      'tugas_baru'
    );
    return newAsg;
  };

  const submitAssignment = (data: Omit<AssignmentSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const newSub: AssignmentSubmission = {
      ...data,
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'dikirim',
    };
    // Replace if already submitted
    setSubmissions(prev => [
      ...prev.filter(s => !(s.assignmentId === data.assignmentId && s.studentId === data.studentId)),
      newSub,
    ]);
    evaluateAndAwardBadges(data.studentId, { newSubmission: newSub });
    setQuickToast({ message: 'Tugas Anda berhasil diunggah tepat waktu!', type: 'success' });
  };

  const gradeSubmission = (submissionId: string, score: number, feedback: string) => {
    const target = submissions.find(s => s.id === submissionId);
    if (!target) return;

    setSubmissions(prev =>
      prev.map(s =>
        s.id === submissionId ? { ...s, score, feedback, status: 'dinilai' } : s
      )
    );

    const asg = assignments.find(a => a.id === target.assignmentId);
    triggerNotification(
      'Tugas Telah Dinilai',
      `Tugas "${asg?.title || 'Tugas'}" Anda telah diperiksa guru. Nilai: ${score}/100.`,
      'nilai_keluar',
      target.studentId
    );
    setQuickToast({ message: `Nilai berhasil disimpan untuk ${target.studentName}.`, type: 'success' });
  };

  const getAssignmentByCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    return assignments.find(a => a.code.trim().toUpperCase() === clean);
  };

  // Calendar
  const addCalendarEvent = (evt: Omit<CalendarEvent, 'id'>) => {
    const newEvt: CalendarEvent = {
      ...evt,
      id: `evt-${Date.now()}`,
    };
    setCalendarEvents(prev => [...prev, newEvt]);
    setQuickToast({ message: `Kegiatan "${evt.title}" berhasil ditambahkan ke kalender.`, type: 'success' });
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setQuickToast({ message: 'Semua notifikasi telah ditandai dibaca.', type: 'info' });
  };

  const unreadNotificationsCount = notifications.filter(
    n => !n.isRead && (n.userId === 'ALL' || (currentUser && n.userId === currentUser.id))
  ).length;

  // Chat
  const sendChatMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setChatMessages(prev => [...prev, newMsg]);
    evaluateAndAwardBadges(msg.senderId, { newChatMessage: newMsg });

    // If it's a private message, notify receiver
    if (msg.receiverId) {
      triggerNotification(
        'Pesan Chat Masuk',
        `${msg.senderName} mengirim pesan akademik kepada Anda.`,
        'chat_baru',
        msg.receiverId
      );
    }
  };

  // Admin survey
  const submitAdminSurvey = (survey: Omit<AdminSurvey, 'id' | 'submittedAt' | 'status'>) => {
    const newSurvey: AdminSurvey = {
      ...survey,
      id: `srv-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };
    setAdminSurveys(prev => [newSurvey, ...prev]);
    setQuickToast({ message: 'Survei permohonan admin berhasil dikirim. Menunggu verifikasi tim admin.', type: 'success' });
  };

  const reviewAdminSurvey = (surveyId: string, status: 'disetujui' | 'ditolak') => {
    const target = adminSurveys.find(s => s.id === surveyId);
    if (!target) return;

    setAdminSurveys(prev =>
      prev.map(s =>
        s.id === surveyId
          ? {
              ...s,
              status,
              reviewedAt: new Date().toISOString(),
              reviewerName: currentUser?.name || 'Admin Pusat',
            }
          : s
      )
    );

    // If approved, update user's admin privilege and assign Badge Admin
    if (status === 'disetujui') {
      setUsers(prev =>
        prev.map(u => {
          if (u.id === target.teacherId) {
            const currentBadges = u.badges || [];
            const hasAdminBadge = currentBadges.includes('Badge Admin');
            return {
              ...u,
              isAdmin: true,
              badges: hasAdminBadge ? currentBadges : ['Badge Admin', ...currentBadges],
            };
          }
          return u;
        })
      );
      if (currentUser?.id === target.teacherId) {
        setCurrentUser(prev => {
          if (!prev) return null;
          const currentBadges = prev.badges || [];
          const hasAdminBadge = currentBadges.includes('Badge Admin');
          return {
            ...prev,
            isAdmin: true,
            badges: hasAdminBadge ? currentBadges : ['Badge Admin', ...currentBadges],
          };
        });
      }
      triggerNotification(
        'Hak Akses Admin Diberikan',
        `Selamat! Permohonan Anda menjadi Admin Sekolah PINTAR telah disetujui. Menu Kustomisasi & Manajemen serta Badge Admin kini aktif.`,
        'admin_status',
        target.teacherId
      );
      setQuickToast({ message: `Guru ${target.teacherName} resmi diangkat sebagai Admin Sekolah & mendapatkan Badge Admin.`, type: 'success' });
    } else {
      triggerNotification(
        'Status Permohonan Admin',
        `Permohonan admin Anda belum disetujui untuk periode saat ini. Silakan hubungi koordinator IT sekolah.`,
        'admin_status',
        target.teacherId
      );
      setQuickToast({ message: `Permohonan ditolak.`, type: 'info' });
    }
  };

  // Branding update
  const updateBranding = (newBranding: Partial<SchoolBranding>) => {
    setBranding(prev => ({ ...prev, ...newBranding }));
    setQuickToast({ message: 'Tampilan identitas sekolah berhasil diperbarui secara instan!', type: 'success' });
  };

  // Friendship methods
  const sendFriendRequest = (targetUserId: string) => {
    if (!currentUser || currentUser.id === targetUserId) return;
    const targetUser = users.find(u => u.id === targetUserId);
    if (!targetUser) return;

    if (currentUser.friends?.includes(targetUserId)) {
      setQuickToast({ message: `Anda dan ${targetUser.displayName || targetUser.name} sudah berteman!`, type: 'info' });
      return;
    }
    if (currentUser.friendRequestsReceived?.includes(targetUserId)) {
      acceptFriendRequest(targetUserId);
      return;
    }

    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const sent = u.friendRequestsSent || [];
        return { ...u, friendRequestsSent: sent.includes(targetUserId) ? sent : [...sent, targetUserId] };
      }
      if (u.id === targetUserId) {
        const received = u.friendRequestsReceived || [];
        return { ...u, friendRequestsReceived: received.includes(currentUser.id) ? received : [...received, currentUser.id] };
      }
      return u;
    }));

    setCurrentUser(prev => {
      if (!prev) return null;
      const sent = prev.friendRequestsSent || [];
      return { ...prev, friendRequestsSent: sent.includes(targetUserId) ? sent : [...sent, targetUserId] };
    });

    triggerNotification(
      'Permintaan Berteman Baru',
      `${currentUser.displayName || currentUser.name} mengajak Anda berteman di PINTAR.`,
      'chat_baru',
      targetUserId
    );

    setQuickToast({
      message: `Permintaan berteman berhasil dikirim ke ${targetUser.displayName || targetUser.name}`,
      type: 'success',
    });
  };

  const acceptFriendRequest = (targetUserId: string) => {
    if (!currentUser) return;
    const targetUser = users.find(u => u.id === targetUserId);
    if (!targetUser) return;

    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const currentFriends = u.friends || [];
        const received = (u.friendRequestsReceived || []).filter(id => id !== targetUserId);
        const sent = (u.friendRequestsSent || []).filter(id => id !== targetUserId);
        return {
          ...u,
          friends: currentFriends.includes(targetUserId) ? currentFriends : [...currentFriends, targetUserId],
          friendRequestsReceived: received,
          friendRequestsSent: sent,
        };
      }
      if (u.id === targetUserId) {
        const currentFriends = u.friends || [];
        const received = (u.friendRequestsReceived || []).filter(id => id !== currentUser.id);
        const sent = (u.friendRequestsSent || []).filter(id => id !== currentUser.id);
        return {
          ...u,
          friends: currentFriends.includes(currentUser.id) ? currentFriends : [...currentFriends, currentUser.id],
          friendRequestsReceived: received,
          friendRequestsSent: sent,
        };
      }
      return u;
    }));

    setCurrentUser(prev => {
      if (!prev) return null;
      const currentFriends = prev.friends || [];
      const received = (prev.friendRequestsReceived || []).filter(id => id !== targetUserId);
      const sent = (prev.friendRequestsSent || []).filter(id => id !== targetUserId);
      return {
        ...prev,
        friends: currentFriends.includes(targetUserId) ? currentFriends : [...currentFriends, targetUserId],
        friendRequestsReceived: received,
        friendRequestsSent: sent,
      };
    });

    // Trigger gemes mutual celebration popup!
    setMutualFriendCelebration({
      friendName: targetUser.name,
      friendDisplayName: targetUser.displayName || targetUser.name,
      friendUsn: targetUser.usn || targetUser.name,
      friendAvatar: targetUser.avatar,
    });

    triggerNotification(
      'Yeyy Kita Berteman! 🎉✨',
      `Anda dan ${currentUser.displayName || currentUser.name} kini resmi mutualan berteman di PINTAR!`,
      'chat_baru',
      targetUserId
    );
  };

  const cancelFriendRequest = (targetUserId: string) => {
    if (!currentUser) return;
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, friendRequestsSent: (u.friendRequestsSent || []).filter(id => id !== targetUserId) };
      }
      if (u.id === targetUserId) {
        return { ...u, friendRequestsReceived: (u.friendRequestsReceived || []).filter(id => id !== currentUser.id) };
      }
      return u;
    }));
    setCurrentUser(prev => prev ? {
      ...prev,
      friendRequestsSent: (prev.friendRequestsSent || []).filter(id => id !== targetUserId)
    } : null);
    setQuickToast({ message: 'Permintaan berteman dibatalkan.', type: 'info' });
  };

  const removeFriend = (targetUserId: string) => {
    if (!currentUser) return;
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, friends: (u.friends || []).filter(id => id !== targetUserId) };
      }
      if (u.id === targetUserId) {
        return { ...u, friends: (u.friends || []).filter(id => id !== currentUser.id) };
      }
      return u;
    }));
    setCurrentUser(prev => prev ? {
      ...prev,
      friends: (prev.friends || []).filter(id => id !== targetUserId)
    } : null);
    setQuickToast({ message: 'Pertemanan telah dihapus.', type: 'info' });
  };

  const addFriendByLink = (friendIdOrLink: string) => {
    if (!currentUser) return { success: false, message: 'Silakan masuk ke akun terlebih dahulu.' };
    const raw = friendIdOrLink.trim();
    let targetKey = raw;
    if (raw.includes('add-friend=')) {
      targetKey = raw.split('add-friend=')[1]?.split('&')[0] || raw;
    } else if (raw.includes('/friend/')) {
      targetKey = raw.split('/friend/')[1]?.split('?')[0] || raw;
    }

    const targetUser = users.find(
      u => u.id === targetKey || u.email.toLowerCase() === targetKey.toLowerCase() || u.usn.toLowerCase() === targetKey.toLowerCase()
    );

    if (!targetUser) {
      return { success: false, message: 'Tautan atau kode teman tidak ditemukan dalam sistem sekolah.' };
    }
    if (targetUser.id === currentUser.id) {
      return { success: false, message: 'Anda tidak dapat menambahkan akun sendiri sebagai teman.' };
    }
    if (currentUser.friends?.includes(targetUser.id)) {
      return { success: false, message: `Anda dan ${targetUser.displayName || targetUser.name} sudah saling berteman!` };
    }

    sendFriendRequest(targetUser.id);
    return {
      success: true,
      message: `Permintaan berteman berhasil dikirim ke ${targetUser.displayName || targetUser.name}!`,
    };
  };

  const clearMutualCelebration = () => setMutualFriendCelebration(null);

  // Cerdas Cermat methods
  const submitCerdasCermatScore = (scoreData: Omit<CerdasCermatScore, 'id' | 'createdAt'>) => {
    const newScore: CerdasCermatScore = {
      ...scoreData,
      id: `score-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCerdasCermatScores(prev => [newScore, ...prev]);
    evaluateAndAwardBadges(scoreData.userId, { newScore });
    setQuickToast({
      message: `Skor ${newScore.score} berhasil disimpan ke Leaderboard Cerdas Cermat!`,
      type: 'success',
    });
  };

  const announceTop3Weekly = (weekLabel: string = 'Minggu Ini') => {
    // Sort scores descending
    const sorted = [...cerdasCermatScores].sort((a, b) => b.score - a.score);
    // Take unique users top 3
    const top3: CerdasCermatScore[] = [];
    const seenUsers = new Set<string>();
    for (const s of sorted) {
      if (!seenUsers.has(s.userId)) {
        seenUsers.add(s.userId);
        top3.push(s);
        if (top3.length === 3) break;
      }
    }

    if (top3.length === 0) {
      setQuickToast({ message: 'Belum ada data skor cerdas cermat untuk diumumkan.', type: 'warning' });
      return;
    }

    const leaderboardText = top3
      .map((item, idx) => {
        const medal = idx === 0 ? '🥇 JUARA 1' : idx === 1 ? '🥈 JUARA 2' : '🥉 JUARA 3';
        return `${medal}: ${item.usn} (${item.userClassOrMapel}) - Skor: ${item.score} Poin (${item.correctAnswers}/${item.totalQuestions} Benar)`;
      })
      .join('\n');

    addAnnouncement({
      authorId: currentUser?.id || 'admin',
      authorName: currentUser?.usn || 'Panitia Cerdas Cermat',
      authorRole: currentUser?.role || 'guru',
      authorAvatar: currentUser?.avatar,
      authorMapel: 'Panitia Lomba Akademik SMPI AL-AKBAR',
      title: `🏆 Pengumuman TOP 3 Juara Game Cerdas Cermat (${weekLabel})`,
      content: `Barakallah kepada santri berprestasi SMPI AL-AKBAR yang berhasil menduduki peringkat Top 3 Game Cerdas Cermat gabungan Matematika, Bahasa Indonesia, IPA, IPS, dan Pengetahuan Umum periode ${weekLabel}:\n\n${leaderboardText}\n\nTerus tingkatkan semangat belajar dan asah wawasan akademik kalian melalui fitur Game Cerdas Cermat PINTAR!`,
      category: 'Cerdas Cermat',
      targetClass: 'Semua Kelas SMP',
      photoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1200&q=80',
      isPinned: true,
    });

    setQuickToast({
      message: 'Pengumuman Top 3 Mingguan Cerdas Cermat berhasil diterbitkan ke beranda sekolah!',
      type: 'success',
    });
  };

  const resetAllDataToDefault = () => {
    setUsers(initialUsers);
    setCurrentUser(null);
    setBranding(initialBranding);
    setAnnouncements(initialAnnouncements);
    setQuizzes(initialQuizzes);
    setQuizAttempts(initialQuizAttempts);
    setAssignments(initialAssignments);
    setSubmissions(initialSubmissions);
    setCalendarEvents(initialCalendarEvents);
    setNotifications(initialNotifications);
    setChatMessages(initialChatMessages);
    setAdminSurveys(initialAdminSurveys);
    setCerdasCermatScores(initialCerdasCermatScores);
    setQuickToast({ message: 'Seluruh data aplikasi PINTAR telah dikembalikan ke pengaturan awal.', type: 'info' });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        branding,
        announcements,
        quizzes,
        quizAttempts,
        assignments,
        submissions,
        calendarEvents,
        notifications,
        chatMessages,
        adminSurveys,
        cerdasCermatScores,
        activeTab,
        setActiveTab,
        isNavDrawerOpen,
        setIsNavDrawerOpen,
        quickToast,
        setQuickToast,
        mutualFriendCelebration,
        clearMutualCelebration,
        sendFriendRequest,
        acceptFriendRequest,
        cancelFriendRequest,
        removeFriend,
        addFriendByLink,
        submitCerdasCermatScore,
        announceTop3Weekly,
        login,
        register,
        logout,
        quickLoginAs,
        resetPassword,
        updateUserPasswordByModerator,
        updateUserProfile,
        updateUserBadges,
        setUserClass,
        sendAccountBackupToEmail,
        addAnnouncement,
        addComment,
        deleteAnnouncement,
        addQuiz,
        submitQuizAttempt,
        getQuizByCode,
        addAssignment,
        submitAssignment,
        gradeSubmission,
        getAssignmentByCode,
        addCalendarEvent,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        sendChatMessage,
        submitAdminSurvey,
        reviewAdminSurvey,
        updateBranding,
        resetAllDataToDefault,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
