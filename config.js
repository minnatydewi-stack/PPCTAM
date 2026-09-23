// ============================================================
// config.js — SEMUA pengaturan dashboard ada di sini.
// Sesuaikan nilai-nilai di bawah dengan spreadsheet kamu.
// ============================================================

const CONFIG = {

  // --------------------------------------------------------
  // Spreadsheet sumber data
  // --------------------------------------------------------
  // ID diambil dari URL Google Sheets:
  // https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
  SPREADSHEET_ID: "11kjJFpdeLqgKwn6eW-GM72Xwg0WQtLIv",

  // --------------------------------------------------------
  // Periode aktif (update tiap ganti bulan)
  // --------------------------------------------------------
  PERIOD_LABEL: "September 2026",
  DAYS_IN_MONTH: 30,

  // --------------------------------------------------------
  // Nama tab untuk 5 sheet rekap kategori
  // Ganti kalau nama tab di spreadsheet kamu beda.
  // --------------------------------------------------------
  RECAP_SHEETS: {
    Botol:            "Rekap Botol",
    "Thermo Cup":     "Rekap Thermo Cup",
    "Thermo Tray & Lid": "Rekap Thermo Tray & Lid",
    Printing:         "Rekap Printing",
    Extruder:         "Rekap Extruder",
  },

  // --------------------------------------------------------
  // Sheet Grand Total. Kosongkan ("") supaya otomatis ambil
  // tab PALING KIRI di file. Isi manual kalau ternyata bukan itu.
  // --------------------------------------------------------
  GRAND_TOTAL_SHEET: "",

  // --------------------------------------------------------
  // Sheet harian (tab "1", "2", ... "31") tidak perlu
  // dikonfigurasi di sini — otomatis diambil sesuai tanggal
  // yang diklik di Kalender Harian.
  //
  // DAILY_SECTIONS = kata kunci judul section yang dicari
  // parseDailySheet() di gviz.js untuk memotong-motong satu
  // sheet harian jadi 6 panel. Sesuaikan teks kalau judul
  // section di sheet kamu berbeda.
  // --------------------------------------------------------
  DAILY_SECTIONS: {
    Botol:            "Hasil Prod Botol Harian",
    "Thermo Cup":     "Hasil Prod Thermo Cup Harian",
    "Thermo Tray":    "Hasil Prod Thermo Tray Harian",
    Printing:         "Hasil Prod Printing Harian",
    "Extruder CS/E1":     "Hasil Prod Extruder CS (E1) Harian",
    "Extruder Diamat/E2": "Hasil Prod Extruder Diamat (F2) Harian",
  },
  // Kata kunci yang menandai batas data harian vs data kumulatif
  // di dalam tiap section sheet harian.
  CUMULATIVE_MARKER: "Akumulasi",

  // --------------------------------------------------------
  // (BARU) Jadwal Produksi Harian
  // --------------------------------------------------------
  // Nama tab tempat tim input jadwal produksi manual.
  JADWAL_SHEET: "Data Jadwal Produksi",

  // Pemetaan nama mesin -> kategori, dipakai untuk mengelompokkan
  // tabel di halaman Jadwal Produksi Harian. Nama mesin di sini
  // HARUS PERSIS SAMA dengan isi kolom "Mesin" di sheet JADWAL_SHEET.
  MACHINE_GROUPS: {
    Botol:    ["Mc 1", "Mc 2", "Mc 3", "Mc 4", "Mc 5", "Mc 6", "Mc 7", "Mc 8", "Mc 9", "Mc 10"],
    Thermo:   ["M92", "FC 1", "FC 2", "FC 3", "FC 4"],
    Printing: ["Polytype"],
    Extruder: ["CS (E1)", "Dismat (F2)"],
  },

  // Kolom yang diharapkan ada di baris pertama (header) JADWAL_SHEET,
  // dipakai gviz.js untuk memetakan kolom -> field. Ganti hanya kalau
  // nama header di sheet kamu berbeda dari daftar ini.
  JADWAL_COLUMNS: {
    tanggal: "Tanggal",
    hari:    "Hari",
    mesin:   "Mesin",
    tkv:     "TKV",
    kodeItem:"Kode Item",
    produk:  "Nama Produk",
    qty:     "Target Qty",
    satuan:  "Satuan",
    status:  "Status",
  },

  // --------------------------------------------------------
  // Perilaku umum dashboard
  // --------------------------------------------------------
  // Auto-refresh data tiap 5 menit (dalam milidetik). Set 0 / false
  // untuk mematikan auto-refresh (tombol Refresh manual tetap jalan).
  AUTO_REFRESH_MS: 5 * 60 * 1000,

  // Locale dipakai untuk format tanggal & angka di seluruh dashboard.
  LOCALE: "id-ID",
};
