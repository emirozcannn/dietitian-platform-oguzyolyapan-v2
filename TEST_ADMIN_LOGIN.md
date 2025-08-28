# 🔧 Admin Login Test Rehberi

## Mevcut Durum
- ✅ Dev server çalışıyor: http://localhost:5174/
- ✅ Supabase client yapılandırıldı
- ✅ AuthContext mevcut
- ❓ Admin kullanıcısı test edilmeli

## Admin Login Test

### 1. Supabase Admin Kullanıcısı
Database'de admin profili var:
- **ID**: `200aa98d-b5d0-4969-a7cb-ea3c4f63aef2`
- **Email**: `admin@oguz.com`
- **Role**: `admin`

### 2. Test Adımları

1. **Giriş sayfasına git**: http://localhost:5174/giris
2. **Test bilgileri**:
   - Email: `admin@oguz.com`
   - Şifre: Supabase Auth'da bu kullanıcı için belirlenen şifre

### 3. Olası Sorunlar ve Çözümler

#### A) Kullanıcı Supabase Auth'da yok
**Çözüm**: Supabase Dashboard > Authentication > Users'da manuel oluştur:
```
Email: admin@oguz.com
Password: AdminOguz2024!
```

#### B) Profil tablosu senkronize değil
**Çözüm**: SQL çalıştır:
```sql
UPDATE public.profiles 
SET 
  email = 'admin@oguz.com',
  first_name = 'Oğuz',
  last_name = 'Yolyapan',
  role = 'admin'
WHERE id = '200aa98d-b5d0-4969-a7cb-ea3c4f63aef2';
```

#### C) AuthContext sorunu
**Kontrol**: Browser console'da:
- `🔧 Environment check` logları
- `🔗 Supabase client initializing` logları
- `🔍 Auth context` logları

### 4. Admin Panel Yolu
Giriş başarılı olursa yönlendirilecek:
- **Türkçe**: `/yonetici-paneli`
- **İngilizce**: `/en/admin-panel`

## Hızlı Test Scripti

Console'da çalıştır:
```javascript
// Supabase bağlantı testi
import { supabase } from './src/lib/supabaseClient.js';

// 1. Bağlantı kontrolü
supabase.from('profiles').select('*').eq('role', 'admin').then(console.log);

// 2. Auth kullanıcıları
supabase.auth.admin.listUsers().then(console.log);
```

## Sonraki Adımlar
1. ✅ Admin kullanıcısı oluştur/doğrula
2. ✅ Login test et
3. ✅ Admin panel erişimi kontrol et
4. 🚀 Production'a deploy et
