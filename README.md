# CN+ — Sistem Garansi Proteksi HP

> Aplikasi web manajemen klaim garansi smartphone untuk operator toko, dibangun dengan HTML, CSS, dan JavaScript murni tanpa framework.

🔗 **Live Demo:** [stepe-ee.github.io/cn_project](https://stepe-ee.github.io/cn_project)

---

## 📸 Preview

![CN+ Preview](assets/preview.png)

---

## ✨ Fitur

- **Daftar Perangkat** — 20+ HP dari berbagai merek (Samsung, iPhone, Xiaomi, OPPO, Vivo, Realme) dengan filter merek & kelas
- **Input Klaim** — Form lengkap untuk mencatat data pelanggan, perangkat, IMEI/SN, dan tier proteksi
- **Tier Proteksi** — Silver (Rp 120.000 / 12 bulan) dan Gold (Rp 199.000 / 12 bulan)
- **Riwayat Klaim** — Tabel lengkap dengan statistik total klaim, omset, dan filter pencarian
- **Nomor Klaim Otomatis** — Generate nomor unik format `CN-XXXXXXXX` setiap transaksi
- **Ringkasan Real-time** — Panel summary terupdate otomatis saat mengisi form

---

## 🗂️ Struktur Proyek

```
cn_project/
├── index.html        # Halaman utama & struktur HTML
├── css/
│   └── style.css     # Semua styling & layout
├── js/
│   ├── data.js       # Data perangkat & konfigurasi tier
│   └── app.js        # Logic aplikasi & event handler
├── assets/
│   └── preview.png   # Screenshot preview
└── README.md
```

---

## 🛠️ Teknologi

| Teknologi | Kegunaan |
|---|---|
| HTML5 | Struktur halaman & semantic markup |
| CSS3 | Styling, Grid, Flexbox, CSS Variables |
| Vanilla JavaScript | Logic aplikasi, DOM manipulation |
| localStorage | Penyimpanan data klaim di browser |
| Google Fonts | Tipografi (Plus Jakarta Sans + Inter) |

---

## 🚀 Cara Menjalankan

Tidak perlu instalasi apapun. Cukup:

```bash
# Clone repository
git clone https://github.com/stepe-ee/cn_project.git

# Buka file
cd cn_project
open index.html
```

Atau langsung buka file `index.html` di browser.

---

## 👨‍💻 Developer

**stepe-ee** — [@stepe-ee](https://github.com/stepe-ee)
