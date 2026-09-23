Dashboard Rekap Produksi
Dashboard statis (HTML/CSS/JS murni, tanpa build step) yang membaca data
langsung dari Google Sheets kamu secara live, lalu menampilkannya sebagai:
Overview — kartu ringkasan 5 kategori (Botol, Thermo Cup, Thermo Tray & Lid,
Printing, Extruder) + Grand Total bulan ini + grafik tren harian.
Jadwal Produksi Harian (baru) — rencana produksi per mesin untuk
hari ini, dikelompokkan per kategori (Botol, Thermo, Printing, Extruder),
menampilkan TKV, Kode Item, Nama Produk, QTY, dan Status/Kendala.
Kalender Harian — grid tanggal 1–31, klik satu tanggal untuk melihat
rincian produksi hari itu (6 panel: Botol, Thermo Cup, Thermo Tray, Printing,
Extruder CS/E1, Extruder Diamat/E2 — persis format sheet harian kamu),
lengkap dengan angka Harian dan Akumulasi.
Rekap per kategori — tabel harian 1–31 + total, dan grafik tren, untuk
masing-masing dari 5 sheet rekap kamu.
Karena tanpa build step, ini tinggal di-deploy langsung ke Vercel dari GitHub —
tidak perlu `npm install` apa pun.
1. Siapkan spreadsheet-nya
Dashboard mengambil data lewat endpoint publik Google Sheets (`gviz/tq`), jadi
spreadsheet wajib di-share sebagai:
> Share → General access → **Anyone with the link → Viewer**
Tanpa ini, dashboard akan menampilkan pesan error saat memuat data (browser
tidak bisa membaca sheet-nya).
Untuk fitur Jadwal Produksi Harian, tambahkan satu tab baru di
spreadsheet yang sama bernama (default) `Data Jadwal Produksi`, dengan
kolom-kolom berikut di baris pertama (header):
Tanggal	Hari	Mesin	TKV	Kode Item	Nama Produk	Target Qty	Satuan	Status
Satu baris = satu mesin pada satu tanggal. Kolom `Mesin` harus persis sama
dengan nama mesin yang dipetakan di `MACHINE_GROUPS` (lihat bawah), misalnya
`Mc 1`, `M92`, `Polytype`, `CS (E1)`.
2. Cocokkan `config.js`
Buka `config.js`, cek hal-hal ini sesuai spreadsheet kamu:
`SPREADSHEET_ID` — sudah otomatis diisi dari link yang kamu kirim.
`RECAP_SHEETS` — nama tab untuk 5 kategori. Sudah diisi default:
`Rekap Botol`, `Rekap Thermo Cup`, `Rekap Thermo Tray & Lid`,
`Rekap Printing`, `Rekap Extruder` — ganti kalau nama tab kamu beda.
`DAYS_IN_MONTH` & `PERIOD_LABEL` — update tiap ganti bulan (mis. Oktober = 31 hari).
`GRAND_TOTAL_SHEET` — dibiarkan kosong supaya otomatis ambil tab paling kiri
di file (sesuai sheet "REKAP GRAND TOTAL PRODUKSI"). Kalau ternyata yang
ke-load bukan itu, isi nama tab-nya secara manual di sini.
`JADWAL_SHEET` (baru) — nama tab jadwal produksi, default
`"Data Jadwal Produksi"`.
`MACHINE_GROUPS` (baru) — pemetaan nama mesin ke kategori, dipakai
untuk mengelompokkan tabel di halaman Jadwal Produksi Harian:
```js
  MACHINE_GROUPS: {
    Botol:    ["Mc 1","Mc 2","Mc 3","Mc 4","Mc 5","Mc 6","Mc 7","Mc 8","Mc 9","Mc 10"],
    Thermo:   ["M92","FC 1","FC 2","FC 3","FC 4"],
    Printing: ["Polytype"],
    Extruder: ["CS (E1)","Dismat (F2)"],
  }
  ```
Sheet harian (tab `1`, `2`, … `31`) tidak perlu dikonfigurasi — dashboard
otomatis mengambil sheet dengan nama sesuai angka tanggal yang diklik.
3. Coba di komputer sendiri (opsional)
File ini murni statis, jadi cukup buka dengan server lokal apa saja, misalnya:
```bash
npx serve .
# atau
python3 -m http.server 8080
```
lalu buka `http://localhost:8080`.
> Membuka `index.html` langsung lewat `file://` biasanya diblokir browser
> (CORS untuk `fetch`), jadi selalu jalankan lewat server lokal atau lewat
> Vercel.
4. Upload ke GitHub
```bash
git init
git add .
git commit -m "Dashboard rekap produksi"
git branch -M main
git remote add origin <url-repo-github-kamu>
git push -u origin main
```
5. Deploy ke Vercel
Login ke vercel.com, New Project.
Import repo GitHub yang barusan kamu push.
Framework preset: pilih Other (tidak perlu build command / output
directory apa pun — semua file statis akan langsung dilayani).
Deploy. Selesai — dashboard langsung live dan otomatis update tiap kali
kamu isi spreadsheet (refresh otomatis tiap 5 menit, bisa diubah lewat
`CONFIG.AUTO_REFRESH_MS`, atau klik tombol Refresh di kanan atas).
Struktur file
```
index.html    → kerangka halaman & navigasi (+ nav item & view "Jadwal Produksi")
styles.css    → tema visual (industrial/pabrik, dark)
config.js     → SEMUA pengaturan yang mungkin perlu kamu ubah (+ JADWAL_SHEET, MACHINE_GROUPS)
gviz.js       → pengambilan & parsing data dari Google Sheets (+ fetchJadwalHariIni)
app.js        → routing & rendering dashboard (+ renderJadwalHariIni)
```
6. (Baru) Cara kerja Jadwal Produksi Harian
Panel ini memakai pola fetch yang sama seperti sheet rekap lain — request
langsung ke endpoint publik Google Visualization API, tanpa API key:
```
https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet={JADWAL_SHEET}
```
Alur kerjanya:
`gviz.js` mengambil seluruh baris tab `Data Jadwal Produksi` (bukan
query per tanggal — jumlah barisnya kecil, jadi tidak perlu query `tq`
yang lebih kompleks).
Baris difilter di sisi client: `Tanggal === hari ini`.
Hasil filter dikelompokkan berdasarkan `MACHINE_GROUPS` di `config.js`
(kategori ditentukan dari nama mesin, bukan dari kolom terpisah di sheet).
`app.js` merender satu tabel per kategori, sama seperti pola render tabel
di panel Kalender Harian — mesin yang belum ada baris untuk hari ini tetap
ditampilkan dengan status "Belum ada jadwal".
Contoh fungsi fetch + filter untuk `gviz.js` (sesuaikan nama fungsi/util
lain — mis. cara `gviz.js` kamu saat ini mem-parse response `gviz/tq` — biar
konsisten dengan fungsi sejenis yang sudah ada di file itu):
```js
async function fetchJadwalHariIni() {
  const url = `https://docs.google.com/spreadsheets/d/${CONFIG.SPREADSHEET_ID}` +
              `/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(CONFIG.JADWAL_SHEET)}`;
  const rows = await fetchGvizRows(url); // pakai parser gviz yang sudah ada di file ini
  const todayStr = new Date().toISOString().slice(0, 10);

  const todays = rows.filter(r => r.Tanggal === todayStr);
  const byMesin = Object.fromEntries(todays.map(r => [r.Mesin, r]));

  const grouped = {};
  for (const [kategori, mesinList] of Object.entries(CONFIG.MACHINE_GROUPS)) {
    grouped[kategori] = mesinList.map(m => byMesin[m] || { Mesin: m, Status: "Belum ada jadwal" });
  }
  return grouped; // { Botol: [...], Thermo: [...], Printing: [...], Extruder: [...] }
}
```
> Snippet di atas ditulis generik mengikuti konvensi yang dijelaskan di
> README ini (nama fungsi/parser aslinya bisa beda). Kalau kamu upload isi
> `gviz.js` dan `app.js` yang sekarang, saya bisa buatkan patch yang
> nyambung persis ke fungsi/struktur yang sudah ada, bukan cuma contoh.
Kalau parsing sheet harian meleset
Panel di modal kalender (`gviz.js` fungsi `parseDailySheet`) membaca sheet
harian dengan mencari judul section (mis. "Hasil Prod Botol Harian") lalu
mengumpulkan baris label+angka di sekitarnya, dan menganggap kata
"Akumulasi" sebagai pemisah antara data harian dan data kumulatif. Kalau ada
label yang terbaca aneh (misal tergabung/tidak lengkap), itu paling sering
karena tata letak kolom di sheet-mu sedikit berbeda dari template awal —
kamu bisa sesuaikan bagian `DAILY_SECTIONS` di `config.js` (kata kunci
pencarian judul) atau logika di `parseDailySheet` sesuai kebutuhan. Datanya
sendiri tetap benar (diambil langsung dari sel angka di sheet), yang bisa
meleset hanya label teks pendampingnya.
