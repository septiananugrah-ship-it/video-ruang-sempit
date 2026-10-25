# Ruang Sempit — Kimia Kuantum Gerak Translasi

Video edukasi **≈ 19½ menit** (2K, 30 FPS) karya **Verna Ayu Susantik** untuk Tugas Pengganti UTS Kimia Kuantum (kajian: *Kimia Kuantum Gerak Translasi*). Dibuat dengan [Remotion](https://remotion.dev).

Gaya visual: **semesta partikel** — langit nila dengan bintang berkelip, nebula toska–magenta, jejak partikel samar ala kamar gelembung, judul serif elegan (Instrument Serif) dengan teks Manrope, kartu rumus kaca berbingkai gradasi tipis (berkilau saat muncul), heading bab berupa lencana orbit, subtitle dalam kapsul kaca, elektron/foton sebagai partikel bercahaya berjejak, awan |ψ|² dari titik-titik (termasuk kubus 3D berputar), dan transisi **portal cincin** yang membuka adegan baru dari tengah layar.

Benang merah: *makin sempit ruangnya, makin besar energinya* — dari partikel dalam kotak sampai warna wortel, titik kuantum di layar TV, LED biru, dan memori flash.

## Isi (tiga bagian wajib tugas)

| Waktu | Bagian | Bab |
|---|---|---|
| 00:00 | Pembuka | Wortel, layar TV, flash disk · judul · peta perjalanan |
| 01:34 | 1 · Prinsip & teori dasar | 01 Partikel bebas (gelombang bidang, energi kontinu) · 02 Dinding tak tertembus (gelombang berdiri, ψₙ = √(2/L) sin(nπx/L)) · 03 Tangga energi Eₙ = n²h²/8mL², energi titik nol · 04 Rapat peluang, simpul, korespondensi · 05 Ketidakpastian & energi pengurungan · 06 Transisi & aturan seleksi · 07 Kotak 2D/3D & degenerasi |
| 09:04 | 2 · Implementasi dalam kimia | 08 Elektron pi butadiena (HOMO–LUMO) · 09 β-karoten & warna wortel · 10 Pewarna sianin (model Kuhn) · 11 Sumur berhingga · 12 Penerowongan & inversi amonia |
| 14:59 | 3 · Penerapan di industri | 13 Titik kuantum & TV QLED · 14 Sumur kuantum LED biru · 15 Memori flash (penerowongan Fowler–Nordheim) |
| 18:27 | Penutup | Rangkuman · layar sumber & rujukan (18 pustaka) |

Daftar bab bertimecode untuk deskripsi YouTube/LMS ada di `naskah/BAB_YOUTUBE.txt` (diperbarui otomatis setelah suara dibuat). Naskah teleprompter: `naskah/NASKAH_VOICEOVER.md`; subtitle: `naskah/narasi.srt`; teks yang dibacakan TTS: `naskah/naskah-tts.txt`.

## Unggah ke GitHub (lewat web, tanpa Codespace)

Hasil dikirim sebagai dua zip agar setiap berkas < 25 MB:

1. Buat repo baru, mis. `video-ruang-sempit`.
2. Ekstrak `1-kode-video-ruang-sempit.zip`, lalu di repo pilih **Add file → Upload files** dan seret **isi** foldernya (termasuk folder `.github`). Jika `.github` tidak ikut terseret, buat manual tiap berkas lewat **Add file → Create new file** dengan nama `.github/workflows/<nama>.yml` lalu tempel isinya.
3. Ekstrak `2-musik-video-ruang-sempit.zip` dan unggah `public/music.mp3` ke folder `public`.

## Render (tombol ditekan sendiri)

Isi secret di **Settings → Secrets and variables → Actions → New repository secret**:

- `ELEVENLABS_API_KEY`: kunci API ElevenLabs.
- `ELEVENLABS_VOICE_ID`: voice ID suara klon (bisa juga diisi di form workflow).

Lalu dari tab **Actions**:

1. **Buat voice-over ElevenLabs (suara klon) + render 2K → Run workflow**. Menghasilkan dua artefak:
   - `ruang-sempit-dengan-narasi-2k-30fps`
   - `ruang-sempit-tanpa-narasi-2k-30fps` (musik + subtitle, untuk dubbing sendiri)
2. (Disarankan) **Cek pengucapan narasi (Whisper) → Run workflow** setelah suara jadi; laporannya menandai baris yang mungkin salah ucap. Hapus mp3 baris itu, perbaiki `tts` di `src/script.ts` bila perlu, lalu jalankan langkah 1 lagi.
3. Hanya perlu versi tanpa narasi? **Render Ruang Sempit 2K 30FPS** dengan isian bawaan.
4. Unduh artefak di halaman run setelah ±30–60 menit. Di iPad: tekan lama nama artefak → *Unduh Tautan Tertaut*.

## Menjalankan sendiri

```bash
npm ci
npm run dev        # Remotion Studio: "RuangSempit", "RuangSempit2K", folder "Adegan"
npm run timeline   # naskah VO, SRT, BAB_YOUTUBE, teks TTS, peta musik
npm run music      # sintesis ulang musik (python3 + numpy + ffmpeg)
npm run check      # cek penanda kata animasi ↔ naskah
npm run lint       # cek tipe TypeScript
```

Nama penulis & judul ada di `src/brand.ts`.

## Catatan angka & sumber

Angka mengikuti Modul 3 bila tersedia: E₁ elektron dalam kotak 1 nm ≈ 0,376 eV; lompatan 1→2 ≈ 1,13 eV (≈ 1100 nm); butadiena L = 0,578 nm → model ≈ 220 nm; heksatriena model ≈ 354 nm; sumur z₀ = 2 → E ≈ 0,265 V₀ dan 0,898 V₀; penghalang 5 eV, E = 1 eV: T ≈ 0,042 (0,2 nm) dan ≈ 9 × 10⁻⁵ (0,5 nm). Nilai eksperimen dari pustaka (dibulatkan): butadiena ≈ 217 nm, heksatriena ≈ 258 nm, β-karoten ≈ 450 nm, deret tiasianin ≈ 423/557/651/760 nm, inversi NH₃ ≈ 24 GHz dan ND₃ ≈ 1,6 GHz, CdSe bongkahan ≈ 710 nm. Rujukan lengkap ada di layar penutup. **Sebaiknya cek ulang ke sumber sebelum narasi direkam**, karena mengubah angka berarti merekam ulang baris. Ilustrasi bersifat skematis.
