import {
  User,
  Announcement,
  Quiz,
  Assignment,
  CalendarEvent,
  AppNotification,
  ChatMessage,
  AdminSurvey,
  SchoolBranding,
  QuizAttempt,
  AssignmentSubmission,
  CerdasCermatScore
} from '../types';

export const initialBranding: SchoolBranding = {
  schoolName: 'SMPI AL-AKBAR',
  schoolMotto: 'Beriman, Berbudi, Berprestasi',
  schoolAddress: 'Jl. Masjid Agung Al-Akbar No. 09, Kompleks Pendidikan Islam Terpadu',
  primaryColor: '#059669', // Emerald Green Al-Akbar
  themePreset: 'emerald',
  appIconPreset: 'graduation-cap',
  customLogoUrl: '/assets/aistudio/Logo_APK_PINTAR_302be987.png',
  heroBannerUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80',
  academicYear: '2026/2027',
  semester: 'Ganjil',
};

export const initialUsers: User[] = [
  {
    id: 'user-guru-1',
    email: 'ahmadfauzi.guru@gmail.com',
    password: 'GuruAdminAkbar2026!',
    name: 'Ustadz H. Ahmad Fauzi, M.Pd.I.',
    usn: 'Ahmad Fauzi', // Nama Asli
    displayName: 'Ustadz Ahmad Fauzi', // Nama Buatan
    role: 'guru',
    mapel: 'PAI & Tahfidz (Admin)',
    nip: '19800412 200501 1 004',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'Mendidik dengan hati, membimbing dengan Al-Qur’an 📖✨',
    isModerator: true,
    isAdmin: true,
    badges: ['Badge Admin'],
    friends: [],
    emailBackupSentAt: '2026-07-01T08:05:00Z',
    createdAt: '2026-07-01T08:00:00Z',
  },
  {
    id: 'user-siswa-0',
    email: 'almaaalabiyyu@gmail.com',
    password: 'AlAbiyyuSiswa2026',
    name: 'Alma Al Abiyyu',
    usn: 'Alma Al Abiyyu', // Nama Asli
    displayName: 'Alma Al Abiyyu', // Nama Panggilan
    role: 'siswa',
    kelas: 'VII A',
    nisn: '0129883011',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    bio: 'Santri SMPI AL-AKBAR • Semangat belajar & berprestasi! ⭐🚀',
    badges: ['Pekerja Keras'],
    friends: [],
    friendRequestsReceived: [],
    friendRequestsSent: [],
    emailBackupSentAt: '2026-07-14T10:00:00Z',
    createdAt: '2026-07-14T09:50:00Z',
  },
];

// Pengumuman dikosongkan seakan-akan masih baru/bersih sesuai instruksi
export const initialAnnouncements: Announcement[] = [];

export const initialQuizzes: Quiz[] = [
  {
    id: 'quiz-app-1',
    code: 'PINTAR-AKBAR',
    title: 'Kuis Literasi Sains & Wawasan Islam Terpadu SMP',
    subject: 'Literasi Umum SMPI AL-AKBAR',
    targetClass: 'Semua Kelas SMP',
    description: 'Kuis latihan mandiri siswa SMPI AL-AKBAR untuk mengasah pengetahuan sains alam dan dasar-dasar keislaman.',
    teacherId: 'system',
    teacherName: 'Sistem PINTAR AL-AKBAR',
    durationMinutes: 15,
    deadline: '2026-10-31',
    isAppQuiz: true,
    questions: [
      {
        id: 'qa-1',
        question: 'Rukun Islam yang ketiga yang wajib ditunaikan bagi setiap muslim yang mampu adalah...',
        options: ['Mengucapkan Dua Kalimah Syahadat', 'Mendirikan Sholat 5 Waktu', 'Membayar Zakat', 'Menjalankan Ibadah Puasa Ramadhan'],
        correctAnswerIndex: 2,
        explanation: 'Urutan rukun Islam: 1. Syahadat, 2. Sholat, 3. Zakat, 4. Puasa, 5. Haji bagi yang mampu.',
      },
      {
        id: 'qa-2',
        question: 'Bagian sel pada tumbuhan yang bertindak sebagai tempat fotosintesis dan menghasilkan oksigen adalah...',
        options: ['Mitokondria', 'Kloroplas', 'Badan Golgi', 'Vakuola'],
        correctAnswerIndex: 1,
        explanation: 'Kloroplas mengandung zat hijau daun (klorofil) yang menyerap cahaya matahari untuk fotosintesis.',
      },
      {
        id: 'qa-3',
        question: 'Hasil dari operasi hitung (-8) + 15 - (-5) adalah...',
        options: ['2', '12', '7', '-2'],
        correctAnswerIndex: 1,
        explanation: '(-8) + 15 = 7. Kemudian 7 - (-5) = 7 + 5 = 12.',
      },
      {
        id: 'qa-4',
        question: 'Adab yang paling utama ketika berkomunikasi melalui fitur chat akademik dengan guru di SMPI AL-AKBAR adalah...',
        options: [
          'Mengirim pesan tengah malam tanpa salam',
          'Mengucapkan salam islami, menyebutkan nama & kelas, serta berbahasa santun',
          'Memakai singkatan kasar dan huruf kapital semua',
          'Menuntut jawaban seketika saat guru sedang mengajar di kelas lain',
        ],
        correctAnswerIndex: 1,
        explanation: 'Sebagai santri SMPI AL-AKBAR, mengedepankan adab salam islami, kesantunan, dan etika akademik adalah hal utama.',
      },
    ],
    createdAt: '2026-10-10T08:00:00Z',
  },
  {
    id: 'quiz-guru-1',
    code: 'PAI-7A',
    title: 'Penilaian Harian PAI: Hukum Bacaan Nun Sukun & Tanwin Kelas VII',
    subject: 'Pendidikan Agama Islam (PAI)',
    targetClass: 'VII A',
    description: 'Kuis penilaian harian tajwid dan fikih ibadah oleh Ustadz H. Ahmad Fauzi. Dikerjakan dengan jujur dan teliti.',
    teacherId: 'user-guru-1',
    teacherName: 'Ustadz H. Ahmad Fauzi, M.Pd.I.',
    durationMinutes: 20,
    deadline: '2026-10-19',
    isAppQuiz: false,
    questions: [
      {
        id: 'qp-1',
        question: 'Apabila nun sukun (نْ) bertemu dengan huruf Ba (ب), maka hukum bacaannya adalah...',
        options: ['Idzhar Halqi', 'Idgham Bighunnah', 'Iqlab', 'Ikhfa Haqiqi'],
        correctAnswerIndex: 2,
        explanation: 'Nun sukun bertemu huruf Ba dibaca Iqlab (suara nun diganti menjadi mim disertai dengung).',
      },
      {
        id: 'qp-2',
        question: 'Huruf-huruf Idzhar Halqi terdiri atas 6 huruf, yaitu...',
        options: ['ء, هـ, ع, ح, غ, خ', 'ي, ن, م, و', 'ل, ر', 'ت, ث, ج, د, ذ'],
        correctAnswerIndex: 0,
        explanation: 'Huruf Idzhar Halqi keluar dari tenggorokan: Hamzah, Ha, Ain, Ha, Ghain, Kha.',
      },
      {
        id: 'qp-3',
        question: 'Thaharah secara istilah dalam fikih Islam memiliki arti...',
        options: ['Bersuci dari hadas dan najis', 'Berpuasa di bulan Ramadhan', 'Memakai wewangian saat sholat', 'Membaca doa sebelum makan'],
        correctAnswerIndex: 0,
        explanation: 'Thaharah artinya bersuci dari hadas (kecil/besar) dan najis agar ibadah sholat sah.',
      },
    ],
    createdAt: '2026-10-14T08:00:00Z',
  },
  {
    id: 'quiz-guru-2',
    code: 'MAT-SMP-1',
    title: 'Penilaian Harian 1: Operasi Bilangan Bulat & Pecahan SMP',
    subject: 'Matematika SMP',
    targetClass: 'VII A',
    description: 'Kuis wajib Matematika Bab 1 kelas VII oleh Ustadzah Siti Nurhaliza. Durasi 25 menit.',
    teacherId: 'user-guru-2',
    teacherName: 'Ustadzah Siti Nurhaliza, S.Pd.',
    durationMinutes: 25,
    deadline: '2026-10-18',
    isAppQuiz: false,
    questions: [
      {
        id: 'qm-1',
        question: 'Suhu di dalam lemari es mula-mula adalah -4°C. Saat listrik padam selama 2 jam, suhu naik 7°C. Suhu lemari es sekarang adalah...',
        options: ['-11°C', '3°C', '-3°C', '11°C'],
        correctAnswerIndex: 1,
        explanation: '-4°C + 7°C = 3°C.',
      },
      {
        id: 'qm-2',
        question: 'Bentuk paling sederhana dari pecahan 36/48 adalah...',
        options: ['2/3', '3/4', '4/5', '5/6'],
        correctAnswerIndex: 1,
        explanation: 'Pembilang dan penyebut sama-sama dibagi FPB 12: 36÷12 = 3, 48÷12 = 4 -> 3/4.',
      },
      {
        id: 'qm-3',
        question: 'KPK dari bilangan 12 dan 18 adalah...',
        options: ['24', '36', '48', '72'],
        correctAnswerIndex: 1,
        explanation: 'Faktorisasi: 12 = 2² x 3; 18 = 2 x 3². KPK = 2² x 3² = 4 x 9 = 36.',
      },
    ],
    createdAt: '2026-10-14T08:30:00Z',
  },
];

export const initialAssignments: Assignment[] = [
  {
    id: 'asg-1',
    code: 'IPA-LAB-1',
    title: 'Laporan Praktikum: Pengamatan Mikroskopik Sel Tumbuhan SMP',
    subject: 'IPA Terpadu SMP',
    targetClass: 'VII A',
    description: 'Tuliskan laporan pengamatan sel daun Rhoeo discolor yang telah diamati di lab IPA SMPI AL-AKBAR. Cantumkan bagian dinding sel, sitoplasma, dan stomata yang tampak. Berikan analisa minimal 2 paragraf.',
    teacherId: 'user-guru-3',
    teacherName: 'Ustadz Budi Santoso, S.Si.',
    deadline: '2026-10-22',
    maxScore: 100,
    attachmentName: 'Format_Laporan_IPA_SMP_AlAkbar.pdf',
    createdAt: '2026-10-14T08:30:00Z',
  },
  {
    id: 'asg-2',
    code: 'MAT-PR-7',
    title: 'Tugas Latihan Operasi Bilangan Bulat Buku Paket Hal 28',
    subject: 'Matematika SMP',
    targetClass: 'VII A',
    description: 'Kerjakan soal latihan Buku Paket Matematika SMP halaman 28 nomor 1 sampai 5. Foto lembar jawaban buku tulis yang rapi dan unggah melalui portal PINTAR.',
    teacherId: 'user-guru-2',
    teacherName: 'Ustadzah Siti Nurhaliza, S.Pd.',
    deadline: '2026-10-17',
    maxScore: 100,
    createdAt: '2026-10-14T11:00:00Z',
  },
  {
    id: 'asg-3',
    code: 'PAI-RES-1',
    title: 'Resume Pembiasaan Ibadah Harian & Hafalan Surat Pendek',
    subject: 'PAI & Tahfidz',
    targetClass: 'VII A',
    description: 'Tuliskan catatan mutabaah yaumiyah (sholat fardhu, sholat dhuha, tadarus Al-Qur’an) selama satu pekan serta hafalan Surat An-Naba’ ayat 1-20.',
    teacherId: 'user-guru-1',
    teacherName: 'Ustadz H. Ahmad Fauzi, M.Pd.I.',
    deadline: '2026-10-25',
    maxScore: 100,
    createdAt: '2026-10-13T10:00:00Z',
  },
];

export const initialCalendarEvents: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Tenggat Tugas: PR Matematika SMP Hal 28 (MAT-PR-7)',
    type: 'deadline-tugas',
    date: '2026-10-17',
    time: '23:59',
    relatedId: 'asg-2',
    subject: 'Matematika SMP',
    targetClass: 'VII A',
    description: 'Batas akhir unggah foto tugas bilangan bulat di portal PINTAR.',
  },
  {
    id: 'evt-2',
    title: 'Kuis Harian: Bilangan Bulat SMP (MAT-SMP-1)',
    type: 'jadwal-kuis',
    date: '2026-10-18',
    time: '14:00',
    relatedId: 'quiz-guru-2',
    subject: 'Matematika SMP',
    targetClass: 'VII A',
    description: 'Penilaian harian matematika secara daring di portal PINTAR.',
  },
  {
    id: 'evt-3',
    title: 'Kuis PAI: Tajwid Nun Sukun (PAI-7A)',
    type: 'jadwal-kuis',
    date: '2026-10-19',
    time: '10:00',
    relatedId: 'quiz-guru-1',
    subject: 'PAI & Tahfidz',
    targetClass: 'VII A',
    description: 'Kuis tajwid nun sukun dan thaharah oleh Ustadz Fauzi.',
  },
  {
    id: 'evt-4',
    title: 'Tenggat: Laporan Praktikum IPA Sel Tumbuhan',
    type: 'deadline-tugas',
    date: '2026-10-22',
    time: '18:00',
    relatedId: 'asg-1',
    subject: 'IPA Terpadu SMP',
    targetClass: 'VII A',
    description: 'Unggah format dokumen laporan praktikum IPA.',
  },
  {
    id: 'evt-5',
    title: 'Sholat Dhuha Berjamaah & Muhadharah Akbar Santri',
    type: 'agenda-sekolah',
    date: '2026-10-24',
    time: '07:00',
    description: 'Agenda rutin pembinaan karakter islami di Masjid SMPI AL-AKBAR.',
  },
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'ALL',
    title: 'Tugas Baru Diterbitkan',
    message: 'Ustadzah Siti Nurhaliza menerbitkan tugas baru "Tugas Latihan Operasi Bilangan Bulat" dengan kode MAT-PR-7.',
    type: 'tugas_baru',
    isRead: false,
    createdAt: '2026-10-14T08:30:00Z',
  },
  {
    id: 'notif-2',
    userId: 'ALL',
    title: 'Kuis PAI Tersedia',
    message: 'Ustadz Ahmad Fauzi menerbitkan kuis PAI Tajwid dengan kode PAI-7A. Batas pengerjaan 19 Oktober 2026.',
    type: 'kuis_baru',
    isRead: false,
    createdAt: '2026-10-14T08:05:00Z',
  },
  {
    id: 'notif-3',
    userId: 'ALL',
    title: 'Pengumuman Resmi Sekolah',
    message: 'Portal PINTAR - SMPI AL-AKBAR kini aktif. Seluruh santri dihimbau memeriksa kalender tugas dan forum diskusi.',
    type: 'pengumuman',
    isRead: true,
    createdAt: '2026-10-14T08:00:00Z',
  },
];

// Pesan chat dan obrolan awal dikosongkan seakan-akan masih baru
export const initialChatMessages: ChatMessage[] = [];

export const initialAdminSurveys: AdminSurvey[] = [];

export const initialSubmissions: AssignmentSubmission[] = [];

export const initialQuizAttempts: QuizAttempt[] = [];

export interface CerdasQuestionItem {
  id: string;
  category: 'mtk' | 'bindo' | 'ipa' | 'ips' | 'umum';
  categoryLabel: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const cerdasCermatQuestions: CerdasQuestionItem[] = [
  // Matematika (MTK)
  {
    id: 'cc-mtk-1',
    category: 'mtk',
    categoryLabel: 'Matematika',
    question: 'Jika 3x + 7 = 22, maka nilai dari 2x - 3 adalah...',
    options: ['5', '7', '9', '11'],
    correctIndex: 1, // 3x = 15 -> x = 5. 2(5) - 3 = 7
    explanation: '3x = 22 - 7 = 15, sehingga x = 5. Maka 2(5) - 3 = 10 - 3 = 7.',
  },
  {
    id: 'cc-mtk-2',
    category: 'mtk',
    categoryLabel: 'Matematika',
    question: 'Hasil dari (-12) × 5 + 40 ÷ (-4) adalah...',
    options: ['-70', '-50', '50', '70'],
    correctIndex: 0, // -60 + (-10) = -70
    explanation: '(-12 × 5) + (40 ÷ -4) = -60 + (-10) = -70.',
  },
  {
    id: 'cc-mtk-3',
    category: 'mtk',
    categoryLabel: 'Matematika',
    question: 'Sebuah segitiga memiliki alas 12 cm dan tinggi 8 cm. Luas segitiga tersebut adalah...',
    options: ['96 cm²', '48 cm²', '24 cm²', '54 cm²'],
    correctIndex: 1,
    explanation: 'Luas = 1/2 × alas × tinggi = 1/2 × 12 × 8 = 48 cm².',
  },
  // Bahasa Indonesia (B. Indo)
  {
    id: 'cc-bindo-1',
    category: 'bindo',
    categoryLabel: 'Bahasa Indonesia',
    question: 'Gagasan pokok atau ide sentral yang menjadi dasar penulisan suatu paragraf disebut...',
    options: ['Ide pokok / gagasan utama', 'Kalimat penjelas', 'Kesimpulan akhir', 'Latar cerita'],
    correctIndex: 0,
    explanation: 'Ide pokok adalah inti atau pokok bahasan utama dalam sebuah paragraf.',
  },
  {
    id: 'cc-bindo-2',
    category: 'bindo',
    categoryLabel: 'Bahasa Indonesia',
    question: 'Ciri-ciri utama teks laporan hasil observasi (LHO) adalah bersifat...',
    options: ['Fiktif dan subyektif', 'Objektif dan faktual', 'Emosional dan khayalan', 'Persuasif sepihak'],
    correctIndex: 1,
    explanation: 'Teks LHO disusun berdasarkan fakta hasil pengamatan nyata secara objektif.',
  },
  {
    id: 'cc-bindo-3',
    category: 'bindo',
    categoryLabel: 'Bahasa Indonesia',
    question: 'Penulisan kata baku yang tepat menurut KBBI adalah...',
    options: ['Apotik', 'Ijin', 'Praktik', 'Nomer'],
    correctIndex: 2,
    explanation: 'Kata baku yang tepat adalah "praktik" (bukan praktek), izin, apotek, dan nomor.',
  },
  // IPA
  {
    id: 'cc-ipa-1',
    category: 'ipa',
    categoryLabel: 'IPA Terpadu',
    question: 'Organel sel yang berfungsi sebagai pusat respirasi sel dan penghasil energi (ATP) adalah...',
    options: ['Ribosom', 'Mitokondria', 'Lisosom', 'Badan Golgi'],
    correctIndex: 1,
    explanation: 'Mitokondria dikenal sebagai powerhouse of cell penghasil energi sel.',
  },
  {
    id: 'cc-ipa-2',
    category: 'ipa',
    categoryLabel: 'IPA Terpadu',
    question: 'Peristiwa perubahan wujud zat dari padat langsung menjadi gas dinamakan...',
    options: ['Menyublim', 'Mengkristal', 'Mengembun', 'Mencair'],
    correctIndex: 0,
    explanation: 'Menyublim adalah perubahan wujud padat ke gas secara langsung (contoh: kapur barus).',
  },
  {
    id: 'cc-ipa-3',
    category: 'ipa',
    categoryLabel: 'IPA Terpadu',
    question: 'Planet dalam tata surya yang sering dijuluki "Bintang Fajar" atau "Bintang Kejora" adalah...',
    options: ['Mars', 'Venus', 'Merkurius', 'Jupiter'],
    correctIndex: 1,
    explanation: 'Venus memiliki atmosfer tebal yang memantulkan sinar matahari sehingga tampak sangat terang.',
  },
  // IPS
  {
    id: 'cc-ips-1',
    category: 'ips',
    categoryLabel: 'IPS',
    question: 'Kerajaan Islam pertama yang tercatat berdiri di wilayah kepulauan Indonesia adalah...',
    options: ['Samudera Pasai', 'Demak', 'Mataram Islam', 'Ternate'],
    correctIndex: 0,
    explanation: 'Kesultanan Samudera Pasai berdiri di Aceh pada abad ke-13.',
  },
  {
    id: 'cc-ips-2',
    category: 'ips',
    categoryLabel: 'IPS',
    question: 'Garis khayal pada peta yang membagi bumi menjadi belahan bumi utara dan selatan dinamakan...',
    options: ['Garis Bujur', 'Garis Khatulistiwa (Ekuator)', 'Garis Meridian Greenwich', 'Garis Balik'],
    correctIndex: 1,
    explanation: 'Garis Khatulistiwa atau Ekuator adalah garis lintang 0° pemisah utara dan selatan.',
  },
  {
    id: 'cc-ips-3',
    category: 'ips',
    categoryLabel: 'IPS',
    question: 'Kerjasama integrasi ekonomi negara-negara Asia Tenggara diwadahi dalam...',
    options: ['MEA (Masyarakat Ekonomi ASEAN)', 'NATO', 'OPEC', 'APEC Global'],
    correctIndex: 0,
    explanation: 'MEA (ASEAN Economic Community) mempererat integrasi ekonomi wilayah Asia Tenggara.',
  },
  // Pengetahuan Umum
  {
    id: 'cc-umum-1',
    category: 'umum',
    categoryLabel: 'Pengetahuan Umum',
    question: 'Lagu kebangsaan Indonesia Raya pertama kali dikumandangkan secara resmi pada momentum...',
    options: ['Proklamasi 17 Agustus 1945', 'Kongres Sumpah Pemuda 28 Oktober 1928', 'Sidang BPUPKI Pertama', 'Dekrit Presiden 1959'],
    correctIndex: 1,
    explanation: 'WR Soepratman memperdengarkan lagu Indonesia Raya dengan biola pada Kongres Pemuda II 1928.',
  },
  {
    id: 'cc-umum-2',
    category: 'umum',
    categoryLabel: 'Pengetahuan Umum',
    question: 'Masjid Agung Al-Akbar yang megah terletak di kota...',
    options: ['Surabaya', 'Malang', 'Semarang', 'Bandung'],
    correctIndex: 0,
    explanation: 'Masjid Nasional Al-Akbar berdiri megah di kota Surabaya, Jawa Timur.',
  },
  {
    id: 'cc-umum-3',
    category: 'umum',
    categoryLabel: 'Pengetahuan Umum',
    question: 'Nama mata uang resmi negara Arab Saudi yang menjadi tujuan ibadah haji dan umrah adalah...',
    options: ['Dinar', 'Riyal', 'Dirham', 'Lira'],
    correctIndex: 1,
    explanation: 'Mata uang resmi Kerajaan Arab Saudi adalah Saudi Riyal (SAR).',
  },
];

export const initialCerdasCermatScores: CerdasCermatScore[] = [];
