# Website WashProg

**WashProg** adalah website layanan pemesanan cuci sepatu yang memudahkan pelanggan untuk memesan layanan laundry sepatu secara online, sekaligus membantu pemilik usaha mengelola data pemesanan dengan lebih efisien.  
Website ini juga dilengkapi dengan fitur **optimasi rute** penjemputan & pengantaran sepatu menggunakan **algoritma brute force**.

---

## ✨ Fitur Utama

- **Pemesanan Online Cuci Sepatu**  
  Pelanggan dapat mendaftar, memilih layanan, jadwal penjemputan, dan melacak status pesanan.

- **Pengelolaan Data Pemesanan**  
  Admin dapat mengelola data pelanggan, pesanan, status pengerjaan, hingga laporan.

- **Optimasi Rute Brute Force**  
  Sistem menghitung semua kemungkinan rute penjemputan/pengantaran untuk menemukan rute terpendek.

- **Dashboard Admin**  
  Ringkasan data pemesanan, status pesanan, dan rekomendasi rute pengiriman.

- **Notifikasi Status**  
  Pelanggan mendapat update status pesanan secara real-time. **(on progress)**

---

## 🛠️ Teknologi yang Digunakan

- **Frontend:** HTML, Tailwinds CSS, JavaScript _(React Vite)_
- **Backend:** Node.js
- **Database:** Mongo DB
- **Algoritma:** Brute Force Travelling Salesman Problem (TSP)

---

## ⚙️ Cara Menjalankan Project

```bash
# 1. Clone repositori
git clone https://github.com/kayrinth/washprog.git

# 2. Masuk ke direktori project
cd washprog

# 3. Install dependensi
npm install
# atau
composer install

# 4. Konfigurasi file .env untuk database

# 5. Jalankan server lokal
npm run dev
# atau
php artisan serve

# 6. Buka http://localhost:8000
```
