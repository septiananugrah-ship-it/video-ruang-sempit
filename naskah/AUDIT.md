# Catatan QA — Ruang Sempit

Metode: still di momen kunci tiap adegan (`scripts/qa-moments.mjs`), sapuan seluruh video tiap 1,5 dtk (`scripts/qa-sweep.mjs`: 0 error/peringatan runtime), cek penanda kata (`npm run check`), dan cek tipe (`npm run lint`).

## Angka yang dipakai & asalnya

| Besaran | Nilai di video | Sumber / cek |
|---|---|---|
| E₁ elektron, L = 1 nm | ≈ 0,38 eV (0,37603 eV) | Modul 3; h²/8mL² dihitung ulang |
| ΔE 1→2, L = 1 nm | ≈ 1,13 eV → ≈ 1100 nm | Modul 3 (1099,1 nm) |
| E₁ kelereng 1 g, kotak 1 cm | ≈ 5 × 10⁻⁶¹ J | dihitung: h²/(8·10⁻³·10⁻⁴) |
| Peluang sepertiga tengah | n=1 ≈ 61 %, n=2 ≈ 20 %, klasik 33 % | integral sin² dihitung ulang |
| Δx·Δp keadaan dasar | ≈ 1,14 × ħ/2 | Δx = 0,181L, Δp = πħ/L |
| Butadiena (model / ukur) | ≈ 220 / ≈ 217 nm | Modul 3 contoh 7; nilai UV pustaka |
| Heksatriena (model / ukur) | ≈ 354 / ≈ 258 nm | Modul 3 contoh 8; nilai UV pustaka |
| β-karoten | 11 C=C, 22 elektron pi, puncak ≈ 450 nm | pustaka |
| Deret tiasianin | ≈ 423, 557, 651, 760 nm | percobaan "pewarna sianin" (Kuhn 1949; Autschbach 2007) |
| Sumur z₀ = 2 | E ≈ 0,27 V₀ dan 0,90 V₀ | Modul 3 contoh 10 |
| Penerowongan E = 1 eV, V₀ = 5 eV | T ≈ 0,042 (0,2 nm), ≈ 9 × 10⁻⁵ (0,5 nm), ≈ 460× | Modul 3 contoh 11 |
| κ proton / elektron | ≈ 43× (√1836) | dihitung |
| Inversi NH₃ / ND₃ | ≈ 24 GHz / ≈ 1,6 GHz (≈ 15×) | Townes & Schawlow |
| CdSe bongkahan | ≈ 710 nm (Eg ≈ 1,74 eV) | pustaka; ukuran 2–6 nm → warna bersifat perkiraan |
| Nobel | Kimia 2023 (titik kuantum), Fisika 2014 (LED biru) | Royal Swedish Academy of Sciences |

Ilustrasi spektrum, perangkat, dan pola bersifat skematis. Angka yang belum ada di Modul 3 sebaiknya dicek ulang ke sumber sebelum narasi direkam.

## Poles akhir (visual & animasi)

Audit ulang memakai still di akhir setiap baris narasi (`scripts/qa-lines.mjs`, ±260 still) lalu diperbaiki:

- **Tata letak:** label adegan & kapsul catatan diperbesar ±10–14 % agar terbaca di layar ponsel; label yang menabrak garis/dinding dipindah (n = … di Ladder & Where, panah vs n = 2 di Squeeze, "momentum" vs Δx, E₁ > 0, tingkat (1,1) di Boxes ikut bergeser saat kotak diregangkan, "likopen", "menerowong" di amonia & flash, "inframerah"); kotak hitam pada "dinding tipis?" (Finite) diganti penghalang tipis berarsir; panel tegangan ambang (Flash) menutup diagram pita dengan bersih; elektron di gerbang mengambang tidak lagi keluar kotak.
- **Subtitle:** kapsul tidak lagi berkedip kosong saat berpindah halaman di tengah satu baris.
- **Animasi baru yang bermakna (bukan hiasan):** paket foton yang diserap + riak cahaya (Light); tabel aturan seleksi n awal + n akhir ganjil/genap; spektrum bertanda 400–1300 nm; awan |ψ|² 2D sebagai titik-titik (jari-jari ∝ |ψ|, warna = tanda ψ) dan kubus 3D berputar berisi awan |ψ|² untuk (1,1,2), (1,2,1), (2,1,1); perbandingan berdampingan elektron 1 nm vs kelereng 1 cm; kotak menyempit dengan partikel "gelisah" dan meter energi ∝ 1/L²; rapat peluang sebagai titik deteksi; aliran partikel ke penghalang yang menembus dengan peluang = T (0,042 pada 0,2 nm; praktis nol pada 0,5 nm); rumus κ = √(2m(V₀−E))/ħ; deret poliena dengan spektrum mini (217 → 258 → ≈ 450 nm); cincin β-ionon di kedua ujung β-karoten (skematis, 11 C=C termasuk 2 di cincin); elektron–hole di titik kuantum dan deret botol larutan yang berpendar; rekombinasi di lapisan InGaN; rasi ringkasan di adegan penutup; layar sumber dengan teks lebih besar.
- **Gaya:** partikel bercahaya (inti putih + halo), pendar latar berwarna di belakang objek utama, kilau sapuan pada kartu rumus, dorongan kamera pelan per adegan, judul pertanyaan pembuka dalam serif besar.
- **Naskah:** baris LED terakhir menjadi "Prinsip sumur kuantum yang sama…" (laser serat optik memakai bahan lain, prinsipnya sama).
