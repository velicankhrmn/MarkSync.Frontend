# Yazıcı Modelleri Yapılandırması

Bu dokümantasyon, yazıcı modellerinin nasıl yapılandırılacağını açıklar.

## Genel Bakış

Yazıcı modelleri `.env` dosyasında `VITE_PRINTER_MODELS` ortam değişkeni ile yapılandırılır. Bu modeller, yazıcı eklerken veya düzenlerken kullanıcılara bir açılır listede (combobox) gösterilir.

## Yapılandırma

### .env Dosyası

`.env` dosyanızda aşağıdaki satırı bulun veya ekleyin:

```env
# Printer Models (virgülle ayrılmış liste)
VITE_PRINTER_MODELS=Industrial Printer X1000,Industrial Printer X1500,Industrial Printer X2000,Thermal Printer T500,Label Printer L300,Custom Printer Model
```

### Format

- Modeller **virgül (,)** ile ayrılmalıdır
- Her model adı otomatik olarak trim edilir (başındaki ve sonundaki boşluklar kaldırılır)
- Boş model isimleri otomatik olarak filtrelenir

### Örnekler

**Tek Model:**
```env
VITE_PRINTER_MODELS=Industrial Printer X1000
```

**Birden Fazla Model:**
```env
VITE_PRINTER_MODELS=Model A,Model B,Model C
```

**Boşluklarla:**
```env
VITE_PRINTER_MODELS=Industrial Printer X1000, Thermal Printer T500, Label Printer L300
```

## Varsayılan Modeller

Eğer `.env` dosyasında `VITE_PRINTER_MODELS` tanımlanmamışsa, sistem aşağıdaki varsayılan modelleri kullanır:

1. Industrial Printer X1000
2. Industrial Printer X1500
3. Industrial Printer X2000
4. Thermal Printer T500
5. Label Printer L300
6. Custom Printer Model

## Kullanım

### Yazıcı Ekleme/Düzenleme

Kullanıcılar yazıcı eklerken veya düzenlerken, Model alanında:
- Açılır liste (combobox) görürler
- İlk seçenek "Model Seçiniz" olarak gösterilir
- `.env`'de tanımlanan tüm modeller listede görünür
- Seçilen model **string** olarak API'ye gönderilir

### Örnek Kullanıcı Görünümü

```
┌─────────────────────────────────┐
│ Model *                         │
│ ┌─────────────────────────────┐ │
│ │ Industrial Printer X1000    ▼│ │
│ └─────────────────────────────┘ │
│   ● Model Seçiniz               │
│   ● Industrial Printer X1000    │
│   ● Industrial Printer X1500    │
│   ● Industrial Printer X2000    │
│   ● Thermal Printer T500        │
│   ● Label Printer L300          │
│   ● Custom Printer Model        │
└─────────────────────────────────┘
```

## Yeni Model Ekleme

Yeni bir yazıcı modeli eklemek için:

1. `.env` dosyasını açın
2. `VITE_PRINTER_MODELS` satırını bulun
3. Yeni modeli virgülle ayırarak ekleyin
4. Dosyayı kaydedin
5. Uygulamayı yeniden başlatın (geliştirme sunucusunu durdurup tekrar başlatın)

**Örnek:**
```env
# Önce
VITE_PRINTER_MODELS=Model A,Model B

# Sonra
VITE_PRINTER_MODELS=Model A,Model B,Yeni Model X
```

## API İletişimi

Seçilen model adı **string** olarak API'ye gönderilir:

```json
{
  "name": "Yazıcı 1",
  "model": "Industrial Printer X1000",
  "protocolType": 0,
  "address": "192.168.1.100",
  "port": 9100,
  "dllPath": null,
  "isActive": false
}
```

## Önemli Notlar

⚠️ **Uygulama Yeniden Başlatma Gerekli**
- `.env` dosyasındaki değişiklikler için uygulamanın yeniden başlatılması gerekir
- Sadece sayfayı yenilemek yeterli değildir

⚠️ **Karakter Limitleri**
- Model adları için karakter limiti yoktur
- Ancak çok uzun model adları UI'da sorun yaratabilir
- Önerilen maksimum uzunluk: 50 karakter

⚠️ **Özel Karakterler**
- Virgül (,) karakteri kullanılamaz (ayırıcı olarak kullanıldığı için)
- Diğer özel karakterler kullanılabilir

## Sorun Giderme

### Modeller Görünmüyor

1. `.env` dosyasını kontrol edin
2. `VITE_PRINTER_MODELS` satırının doğru yazıldığından emin olun
3. Geliştirme sunucusunu yeniden başlatın:
   ```bash
   # Önce durdur (Ctrl+C)
   # Sonra tekrar başlat
   npm run dev
   ```

### Değişiklikler Yansımıyor

- Tarayıcı cache'ini temizleyin (Ctrl+Shift+R veya Cmd+Shift+R)
- Geliştirme sunucusunu tamamen durdurup yeniden başlatın

### Varsayılan Modeller Kullanılıyor

- `.env` dosyasının proje kök dizininde olduğundan emin olun
- `VITE_PRINTER_MODELS` değerinin boş olmadığından emin olun

## Kod Referansı

Model yönetimi için kodlar:
- Utility: [src/constants/printerModels.js](src/constants/printerModels.js)
- Kullanım: [src/pages/Printers.jsx](src/pages/Printers.jsx)
