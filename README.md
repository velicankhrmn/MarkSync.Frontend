# 🏭 MarkSync Frontend

Bu proje, endüstriyel yazıcıların durumlarını **gerçek zamanlı olarak izlemek**, yönetmek ve kontrol etmek için tasarlanmış modern bir **React + Vite** tabanlı web arayüzüdür.  
Koyu endüstriyel renk paleti (#1F2937, #262654) ve **TailwindCSS** ile tasarlanmıştır.

---

## 🚀 Özellikler

- ⚙️ **Gerçek zamanlı cihaz durumu takibi**
- 🌐 **REST API üzerinden dinamik veri iletişimi**
- 🧠 **Zustand ile global state yönetimi**
- 🎨 **TailwindCSS ile modern, endüstriyel arayüz**
- 🔐 **JWT tabanlı oturum yönetimi**
- 🧩 **Modüler dosya yapısı (api, store, components, pages)**

---

## 🏗️ Teknolojiler

| Teknoloji | Açıklama |
|------------|-----------|
| [React 19](https://react.dev/) | Arayüz kütüphanesi |
| [Vite](https://vitejs.dev/) | Hızlı geliştirme ortamı |
| [TailwindCSS](https://tailwindcss.com/) | CSS framework |
| [Zustand](https://github.com/pmndrs/zustand) | State management |
| [Axios](https://axios-http.com/) | API iletişimi |
| [React Router DOM 7](https://reactrouter.com/) | Sayfa yönlendirme |

---

## 🗂️ Proje Yapısı

```
frontend/
├─ public/
│  └─ logo.png
├─ src/
│  ├─ api/                # API servisleri
│  ├─ assets/             # Görseller, ikonlar
│  ├─ components/         # UI bileşenleri
│  ├─ hooks/              # Özel React hook'ları
│  ├─ pages/              # Sayfalar (Login, Dashboard, Printers)
│  ├─ store/              # Zustand state yönetimi
│  ├─ utils/              # Yardımcı fonksiyonlar
│  ├─ App.jsx
│  └─ main.jsx
├─ .env
├─ tailwind.config.js
└─ package.json
```

---

## ⚡ Kurulum

### 1️⃣ Gerekli bağımlılıkları yükle
```bash
npm install
```

### 2️⃣ Geliştirme ortamını başlat
```bash
npm run dev
```

### 3️⃣ Tarayıcıdan görüntüle
```
http://localhost:5173
```

---

## ⚙️ Ortam Değişkenleri

`.env` dosyasında API adresini tanımla:

```
VITE_API_URL=http://localhost:5000/api
```

---

## 🧠 Kullanım Akışı

1. Kullanıcı giriş yapar (JWT doğrulaması yapılır)  
2. Dashboard üzerinde **yazıcı durumları** canlı olarak izlenir  
3. Yazıcı listesi sayfasında tüm cihazlar gösterilir  
4. Her yazıcı için API üzerinden durumu güncellenir  
5. WebSocket veya periyodik sorgu ile gerçek zamanlı veri akışı sağlanır  

---

## 🧩 Geliştirici Bilgileri

**Proje Adı:** MarkSync Frontend  
**Repo:** [MarkSync.Frontend](https://github.com/velicankhrmn/MarkSync.Frontend)  
**Geliştirici:** [Veli Kahraman](https://github.com/velicankhrmn)  
**Durum:** 🔒 Private Repository  

---

## 🧰 Komutlar

| Komut | Açıklama |
|-------|-----------|
| `npm run dev` | Geliştirme sunucusunu başlatır |
| `npm run build` | Üretim derlemesi oluşturur |
| `npm run preview` | Derlenmiş sürümü önizler |
| `npm run lint` | Kod standartlarını kontrol eder |

---

## 📦 Deploy

Üretim sürümü oluşturmak için:
```bash
npm run build
```

Çıktı `dist/` klasörüne oluşturulur.  
Bu klasörü herhangi bir web sunucusuna veya CDN’e yükleyebilirsin (örneğin **Vercel**, **Netlify** veya **Render**).

---

## 📜 Lisans

MIT License © 2025  
Bu proje **3SINK MarkSync Projesi** kapsamında geliştirilmiştir.
