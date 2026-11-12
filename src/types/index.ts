export type UserRole = 'siswa' | 'guru' | 'admin';

export type UserBadgeType = 'Si Pintar' | 'Pekerja Keras' | 'Si Bijak' | 'Si Paling Aktif' | 'Badge Admin' | string;

export interface User {
  id: string;
  email: string; // Akun Gmail pengguna (Rahasia, pengguna lain tidak bisa melihat)
  password: string; // Tersimpan oleh moderator/guru admin untuk jaga-jaga
  name: string; // Nama utama
  usn: string; // Nama Asli / USN resmi
  displayName: string; // Nama Buatan / Panggilan terserah kita (nama samaran/panggilan bebas)
  role: UserRole;
  kelas?: string; // Untuk siswa (e.g., 'VII A', 'VIII B', 'IX C')
  mapel?: string; // Untuk guru (e.g., 'PAI & Tahfidz', 'Matematika SMP', 'IPA Terpadu SMP')
  nip?: string; // Nomor Induk Pegawai for guru
  nisn?: string; // Nomor Induk Siswa Nasional for siswa
  avatar?: string;
  bio?: string; // Bio pengguna seperti status WhatsApp yang muncul sebagai bubble chat di bawah PP
  isModerator?: boolean;
  isAdmin?: boolean;
  badges?: UserBadgeType[]; // Disimpan hanya untuk diketahui admin
  friends?: string[]; // Daftar ID teman yang sudah mutualan
  friendRequestsSent?: string[]; // Permintaan teman yang dikirim
  friendRequestsReceived?: string[]; // Permintaan teman yang diterima
  emailBackupSentAt?: string; // Waktu pengiriman otomatis salinan data ke Gmail pengguna
  createdAt: string;
}

export interface AnnouncementComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  authorId: string;
  authorName: string; // Menggunakan USN untuk forum dan pengumuman resmi
  authorRole: UserRole;
  authorAvatar?: string;
  authorMapel?: string;
  title: string;
  content: string;
  category: 'Umum' | 'Tugas' | 'Ujian' | 'Prestasi' | 'Kegiatan' | 'Cerdas Cermat';
  targetClass?: string; // e.g., 'Semua Kelas', 'VII A'
  targetClasses?: string[]; // Daftar kelas yang dipilih guru untuk diteruskan pengumumannya
  photoUrl?: string;
  videoUrl?: string; // YouTube or MP4
  linkUrl?: string; // Link tautan eksternal
  linkLabel?: string; // Label tombol link
  attachedFileName?: string;
  attachedFileUrl?: string;
  isPinned?: boolean;
  comments: AnnouncementComment[];
  createdAt: string;
}

export interface CerdasCermatScore {
  id: string;
  userId: string;
  displayName: string;
  usn: string;
  userRole: UserRole;
  userClassOrMapel: string;
  userAvatar?: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  weekLabel: string;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number; // 0, 1, 2, 3
  explanation?: string;
}

export interface Quiz {
  id: string;
  code: string; // e.g., "MAT-101", "BIO-QUIZ-1"
  title: string;
  subject: string;
  targetClass: string;
  description: string;
  teacherId: string;
  teacherName: string;
  durationMinutes: number;
  deadline: string;
  questions: QuizQuestion[];
  createdAt: string;
  isAppQuiz?: boolean; // Pre-provided by PINTAR
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizCode: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  selectedAnswers: Record<string, number>;
  completedAt: string;
}

export interface Assignment {
  id: string;
  code: string; // e.g. "TUGAS-FIS-1"
  title: string;
  subject: string;
  targetClass: string;
  description: string;
  teacherId: string;
  teacherName: string;
  deadline: string;
  maxScore: number;
  attachmentUrl?: string;
  attachmentName?: string;
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  submissionText: string;
  fileAttachment?: string;
  submittedAt: string;
  score?: number;
  feedback?: string;
  status: 'dikirim' | 'dinilai';
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'deadline-tugas' | 'jadwal-kuis' | 'agenda-sekolah' | 'ujian-semester';
  date: string; // YYYY-MM-DD
  time?: string;
  relatedId?: string; // ID of quiz or assignment
  subject?: string;
  targetClass?: string;
  description?: string;
}

export interface AppNotification {
  id: string;
  userId: string; // Specific user or 'ALL'
  title: string;
  message: string;
  type: 'tugas_baru' | 'kuis_baru' | 'pengumuman' | 'nilai_keluar' | 'chat_baru' | 'admin_status';
  targetUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar?: string;
  senderClassOrMapel?: string;
  receiverId?: string; // Null if channel message
  channelId?: string; // e.g., 'umum', 'matematika', 'bimbingan-konseling'
  content: string;
  timestamp: string;
}

export interface AdminSurvey {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  teacherMapel: string;
  teachingExperienceYears: number;
  divisionAssigned: string; // e.g., Kurikulum, Kesiswaan, Sarana Prasarana, IT Sekolah
  reason: string;
  dataIntegrityPledge: boolean;
  status: 'pending' | 'disetujui' | 'ditolak';
  submittedAt: string;
  reviewedAt?: string;
  reviewerName?: string;
}

export interface SchoolBranding {
  schoolName: string;
  schoolMotto: string;
  schoolAddress: string;
  primaryColor: string; // Hex color code
  themePreset: 'blue' | 'emerald' | 'indigo' | 'rose' | 'amber' | 'slate' | 'custom';
  appIconPreset: 'graduation-cap' | 'book-open' | 'school' | 'sparkles' | 'award' | 'brain' | 'custom';
  customLogoUrl?: string;
  heroBannerUrl?: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
}
