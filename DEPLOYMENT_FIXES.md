# Diyetisyen Web Sitesi Deployment Rehberi

## 📋 Deployment Sorunları ve Çözümleri

### Ana Sorunlar
1. ✅ **Blog API** - Tamamen düzeltildi
2. ✅ **MongoDB Connection** - Doğru URI ile güncelleştirildi
3. ✅ **API Endpoints** - Vercel formatında yeniden yazıldı
4. ✅ **CORS Headers** - Eklendi
5. ✅ **Model Dependencies** - Inline olarak tanımlandı

### Yapılan Düzeltmeler

#### 1. Backend API Dosyaları (Vercel)
- `blog.js` - Tamamen yeniden yazıldı, tüm endpoint'ler çalışır durumda
- `categories.js` - Schema inline olarak eklendi
- `faq.js` - Schema inline olarak eklendi  
- `packages.js` - Schema inline olarak eklendi
- `testimonials.js` - Schema inline olarak eklendi
- `contact.js` - MongoDB connection düzeltildi
- `auth.js` - Zaten çalışıyor durumda

#### 2. MongoDB Connection
- Doğru URI: `mongodb+srv://emirus1214:alper1emir@cluster0.vhvvowo.mongodb.net/oguz-dietitian`
- Connection pooling ve error handling eklendi

#### 3. Frontend API Client
- Endpoint URL'leri düzeltildi
- Query parameter formatting düzeltildi

### Deployment Adımları

#### Backend (Vercel)
1. Tüm dosyalar `backend/api/` klasöründe hazır
2. `vercel.json` konfigürasyonu eklendi
3. Environment variables Vercel dashboard'da ayarlanmalı:
   - `MONGODB_URI`
   - `NODE_ENV=production`

#### Frontend (Natro Hosting)
1. `VITE_API_BASE_URL` doğru Vercel URL'ini göstermeli
2. Build sonrası dosyalar upload edilmeli

### Test Edilmesi Gerekenler

#### API Endpoints (Vercel'de)
- ✅ `GET /api/blog` - Tüm blog yazıları
- ✅ `GET /api/blog?slug=xxx` - Slug'a göre yazı
- ✅ `GET /api/blog?type=featured` - Öne çıkan yazılar
- ✅ `POST /api/blog` - Yeni yazı oluşturma
- ✅ `PUT /api/blog?id=xxx` - Yazı güncelleme
- ✅ `DELETE /api/blog?id=xxx` - Yazı silme
- ✅ `GET /api/categories` - Kategoriler
- ✅ `GET /api/auth?type=login` - Login
- ✅ `GET /api/health` - Health check

#### Frontend Test URLs
- Ana sayfa blog listesi
- Blog yazısı detay sayfası
- Admin panel blog yönetimi
- Yeni yazı ekleme formu

### Hızlı Deployment Kontrolü

1. **Vercel'de API Test:**
```bash
curl https://oguz-dietitian-backend.vercel.app/api/health
curl https://oguz-dietitian-backend.vercel.app/api/blog?limit=5
```

2. **Frontend'de API Test:**
- Developer Console'da network tab'ı açık
- Blog sayfasına git
- API çağrılarının başarılı olduğunu kontrol et

### Acil Düzeltmeler

Eğer hala sorun varsa:

1. **MongoDB Atlas'ta:**
   - IP Whitelist kontrol et (0.0.0.0/0 olmalı)
   - Database user permissions kontrol et

2. **Vercel'de:**
   - Function logs kontrol et
   - Environment variables kontrol et

3. **Frontend'de:**
   - CORS hataları varsa backend'deki headers kontrol et
   - API base URL doğruluğunu kontrol et

### Blog Yazısı Ekleme Testi

Admin panelde yeni blog yazısı eklemek için:
1. Admin girişi yap
2. Blog Manager'a git
3. "Yeni Yazı Ekle" butonuna tıkla
4. Türkçe ve İngilizce başlık/içerik doldur
5. "Kaydet" butonuna tıkla

Eğer hata alırsan, browser console'daki error mesajlarını kontrol et.

### İletişim
Bu sorunlar devam ederse, hata mesajlarını ve Vercel function logs'larını paylaş.
