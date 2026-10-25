# Konteks repo (untuk asisten AI)

- Video "Ruang Sempit" (Kimia Kuantum Gerak Translasi, Modul 3) milik **Verna Ayu Susantik**, dibuat dengan bantuan Yayan (lihat repo `septiananugrah-ship-it/science-intro` → `CLAUDE.md` untuk aturan umum & pelajaran teknis).
- Gaya: gelap **semesta partikel** (diminta mirip nuansa video Yayan), tetapi UI sengaja beda: palet nebula toska–magenta (bukan emas–sian), font Instrument Serif (judul) + Manrope (teks) + IBM Plex Mono + STIX Two (rumus), kartu rumus kaca berbingkai gradasi, heading bab lencana orbit + "rasi" kemajuan, subtitle kapsul kaca, transisi portal cincin. Tidak memakai branding SCIENTIAN. Konsep cerita juga beda dari video Modul 3 milik Yayan (benang merah: warna & penerowongan, bukan STM/paket gelombang).
- Narasi: ElevenLabs **suara klon** (secret `ELEVENLABS_VOICE_ID` atau input workflow), bukan Bagas. Selalu sediakan versi tanpa narasi.
- **Claude tidak menjalankan workflow GitHub Actions.** Setelah merge ke `main`, berhenti dan minta pengguna menekan *Run workflow* sendiri.

## Aturan konten & tata letak

- Rumus utama ≥ 56 px (`Formula`), satu kartu per momen; zona subtitle (bawah) selalu bebas. Komponen HTML (`Formula`, `Note`, `Board`) diletakkan di luar `<Stage>`.
- Ukuran `Label` di adegan memakai skala lama (font "hand"); `primitives.tsx` mengalikan 0,84 untuk Manrope (kapsul `Note` 0,66).
- Partikel memakai `Spark` (inti + halo + jejak opsional), pendar latar memakai `Halo` (warna dari `Hue`), cahaya diserap/dipancarkan memakai `Ripple`; warna panjang gelombang dari `nmColor` di `anim.ts`.
- "≈" untuk perkiraan, "±" hanya untuk plus-minus.
- Teks TTS terpisah dari subtitle (`src/tts.ts`, `tts:` per baris). Setelah suara dibuat, minta pengguna menekan workflow **Cek pengucapan narasi (Whisper)**.
- Musik 128 kbps agar `public/music.mp3` < 25 MB (batas unggah web GitHub).

## Pelajaran

- Filter SVG berbasis noise (tekstur kapur) membuat render ±4× lebih lambat; `drop-shadow` CSS pada `<svg>` jauh lebih murah untuk efek pendar.
- Tanyakan gaya visual dengan jelas sebelum membangun; jawaban AskUserQuestion bisa tidak terkirim — bila kosong, tanya ulang alih-alih menebak.
- Audit paling efektif: still di **akhir setiap baris narasi** (`scripts/qa-lines.mjs`, ±260 still, ±8 menit) — 3 still per adegan melewatkan banyak tabrakan label.
- Jangan "menghapus" garis dengan menimpakan persegi warna latar (muncul kotak hitam); pecah path dan pudarkan bagiannya.
- Subtitle: halaman dalam satu baris narasi harus menyambung (`contOut`), kalau tidak kapsul sempat tampil kosong.
- Visual yang diturunkan dari rumus (awan |ψ|², peluang tembus T pada aliran partikel) lebih meyakinkan daripada bentuk hiasan; tetap murah dirender bila jumlah elemen < ±1000 per frame.

