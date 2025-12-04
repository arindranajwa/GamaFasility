# GamaFacility 🌟

GamaFacility adalah aplikasi mobile yang memudahkan mahasiswa dan pengunjung untuk menemukan fasilitas di lingkungan kampus UGM dengan cepat dan mudah. Aplikasi ini menampilkan berbagai fasilitas seperti Toyagama, ATM, Halte, Sepeda, dan Asrama dengan peta interaktif serta fitur form input lokasi.

---

## 📱 Screenshots

### Beranda
![Beranda](./screenshots/beranda.png)

- Menampilkan sambutan aplikasi dan navigasi utama
- Fitur cepat ke Lokasi Terdekat, Informasi Fasilitas, dan Bantuan 24/7
- Preview kategori fasilitas

### Kategori Fasilitas
![Kategori](./screenshots/kategori.png)

- Menampilkan daftar kategori fasilitas
- Jumlah lokasi tersedia per kategori
- Peta kampus UGM interaktif

### Statistik & Peta
![Statistik](./screenshots/statistik.png)

- Grafik jumlah fasilitas per kategori
- Daftar fasilitas lengkap dengan detail lokasi

### Peta Lokasi
![Peta](./screenshots/peta.png)

- Tampilan peta interaktif
- Menampilkan semua lokasi fasilitas di kampus
- FAB (+) untuk menambahkan lokasi baru

### Form Input Location
![Form Input](./screenshots/form_input.png)

- Input nama lokasi, kategori, koordinat, akurasi, dan gambar
- Tombol untuk memilih gambar dan mengambil koordinat saat itu juga
- Simpan lokasi ke database Firebase

### Daftar Lokasi
![Daftar Lokasi](./screenshots/daftar_lokasi.png)

- Menampilkan semua titik lokasi yang tersimpan
- Fitur edit dan hapus lokasi dengan mudah

---

## ⚙️ Fitur Utama

- **Peta Interaktif:** Lihat semua fasilitas kampus di peta dengan ikon kategori.
- **Form Input Location:** Tambah lokasi baru lengkap dengan foto, kategori, dan koordinat.
- **Edit & Hapus Lokasi:** Update data lokasi dengan mudah.
- **Grafik Statistik:** Visualisasi jumlah fasilitas per kategori.
- **Kategori Fasilitas:** Filter lokasi berdasarkan kategori seperti ATM, Halte, Sepeda, dll.
- **Get Current Location:** Ambil koordinat pengguna secara real-time.

---

## 🧩 Komponen Utama

- **React Native**: Framework utama untuk aplikasi mobile.
- **Expo Router**: Navigasi dan routing antar halaman.
- **Leaflet & React-Leaflet**: Untuk peta interaktif.
- **Firebase Realtime Database**: Menyimpan data lokasi secara real-time.
- **Firebase Storage**: Menyimpan gambar lokasi.
- **Expo Image Picker**: Upload foto lokasi dari galeri.
- **Expo Location**: Ambil koordinat pengguna.

---

## 🚀 Cara Menjalankan

1. Clone repository:
```bash
git clone https://github.com/username/gamafacility.git
