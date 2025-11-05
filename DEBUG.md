# Debug Rehberi

Bu proje geliştiriciler için kapsamlı bir debug sistemi içerir. Sadece geliştirme ortamında (`VITE_APP_ENV=development`) çalışır.

## 🔍 Logger Kullanımı

### Tarayıcı Konsolundan

Tarayıcı konsolunu açın (F12) ve `window.logger` kullanın:

```javascript
// Loglama durumunu kontrol et
logger.enableLogging  // true/false

// Loglamayı aç/kapat
logger.setEnabled(false)  // Kapalı
logger.setEnabled(true)   // Açık

// Manuel log
logger.info('Bilgi mesajı', { data: 'örnek' })
logger.success('Başarılı işlem')
logger.warn('Uyarı mesajı')
logger.error('Hata mesajı', error)
logger.debug('Debug bilgisi', { detail: 'detay' })
```

### Otomatik Loglar

Sistem aşağıdaki işlemleri otomatik olarak loglar:

#### 🌐 API İstekleri
```
🌐 API Request: POST /auth/login
  Method: POST
  URL: https://localhost:7148/api/auth/login
  Body: { username: "...", password: "..." }

✓ API Response: POST /auth/login
  Status: 200
  Data: { username: "...", role: "admin", token: "..." }
```

#### 🔐 Authentication
```
🔐 Auth: Login attempt
  Action: Login attempt
  Data: { username: "admin" }

🔐 Auth: Login successful
  Data: { username: "admin", role: "admin" }

🔐 Auth: Logout
  Action: Logout
  Data: { user: { username: "admin", role: "admin" } }
```

#### 🍪 Cookie İşlemleri
```
🍪 Cookie SET: auth_token ***
🍪 Cookie SET: user_info { username: "admin", role: "admin" }
🍪 Cookie DELETE: auth_token
```

#### 🧭 Navigasyon
```
🧭 Navigation: /login → /dashboard
```

## 📊 Console Grupları

Logger, ilgili logları gruplar halinde gösterir:

### API Request Grubu
```javascript
▼ 🌐 API Request: GET /printers
    Method: GET
    URL: https://localhost:7148/api/printers
```

### API Response Grubu
```javascript
▼ ✓ API Response: GET /printers  (Yeşil - Başarılı)
    Status: 200
    Data: [...]

▼ ✗ API Error: POST /auth/login  (Kırmızı - Hata)
    Error: { status: 401, message: "Invalid credentials" }
```

## 🔧 Debug İpuçları

### 1. Token Kontrolü
```javascript
// Console'da
logger.debug('Token check', {
  token: authService.getToken(),
  user: authService.getCurrentUser(),
  isAuth: authService.isAuthenticated()
})
```

### 2. Cookie İçeriğini Görüntüleme
```javascript
// Console'da
document.cookie  // Tüm cookie'leri göster

// veya
import { getAllCookies } from './utils/cookies'
logger.table(getAllCookies())
```

### 3. API İsteklerini İzleme
Tüm API istekleri otomatik olarak loglanır. Network sekmesini kontrol etmeye gerek yok!

### 4. State Değişikliklerini İzleme
```javascript
// Component içinde
useEffect(() => {
  logger.debug('State changed', { user, loading, error })
}, [user, loading, error])
```

## 🎨 Log Renk Kodları

- 🔵 **Mavi**: API Request, Info
- 🟢 **Yeşil**: Success, API Response (2xx)
- 🟡 **Sarı**: Warning
- 🔴 **Kırmızı**: Error, API Response (4xx, 5xx)
- 🟣 **Mor**: Cookie işlemleri
- 🔶 **Turuncu**: Auth işlemleri
- 🔷 **Cyan**: Navigation

## 🚫 Production'da Devre Dışı

Logger sadece geliştirme ortamında çalışır:

```javascript
// .env dosyasında
VITE_APP_ENV=development  // Logger açık
VITE_APP_ENV=production   // Logger kapalı (sadece error logları)
```

## 💡 Örnek Debug Senaryoları

### Senaryo 1: Login Sorunu
1. Console açın
2. Login butonuna tıklayın
3. Logları kontrol edin:
   - ✅ API Request gönderildi mi?
   - ✅ Response başarılı mı?
   - ✅ Cookie'ler kaydedildi mi?
   - ✅ Navigation gerçekleşti mi?

### Senaryo 2: Token Geçersiz
```javascript
// Console'da token'ı kontrol edin
authService.getToken()  // null veya expired?

// Auth durumunu kontrol edin
authService.isAuthenticated()  // false?

// User bilgisi var mı?
authService.getCurrentUser()  // null?
```

### Senaryo 3: API Hatası
```
✗ API Error: POST /auth/login
  Error: {
    status: 401,
    message: "Invalid password or user",
    data: { success: false, message: "..." }
  }
```

## 🔍 React DevTools

React DevTools eklentisini yükleyin:
- [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

Component state'lerini ve props'ları inceleyebilirsiniz.

## 📝 Debug Checklist

Bir sorunla karşılaştığınızda:

- [ ] Console'da hata var mı?
- [ ] API request gönderildi mi?
- [ ] API response doğru mu?
- [ ] Token cookie'de var mı?
- [ ] User bilgisi cookie'de var mı?
- [ ] AuthContext state güncel mi?
- [ ] Navigation çalışıyor mu?
- [ ] Network sekmesinde CORS hatası var mı?

## 🛠️ Gelişmiş Debug

### Chrome DevTools Breakpoints

1. Sources sekmesini açın
2. İlgili dosyayı bulun (ör: `authService.js`)
3. Satır numarasına tıklayarak breakpoint ekleyin
4. Kod çalıştığında durur ve değişkenleri inceleyebilirsiniz

### Network İzleme

Network sekmesinde:
- Request Headers (Authorization header var mı?)
- Request Payload (Gönderilen data doğru mu?)
- Response (Dönen data doğru mu?)
- Status Code (200, 401, 500?)

## 📞 Yardım

Sorun devam ediyorsa:
1. Console loglarını kopyalayın
2. Network sekmesi screenshot'u alın
3. Hatanın adımlarını not edin
4. Geliştirici ekibiyle paylaşın
