# 🔐 Supabase Admin User Setup

## Adım 1: Supabase Dashboard'da Admin User Oluştur

### URL: https://supabase.com/dashboard/project/gvupbilsfysmihcyhmjc

1. **Authentication > Users** sekmesine git
2. **"Add user"** butonuna tıkla
3. **User bilgileri**:
   ```
   Email: admin@oguz.com
   Password: AdminOguz2024!
   Auto Confirm User: ✅ (önemli!)
   ```
4. **Create user** butonuna tıkla

## Adım 2: SQL Editor'da Profil Oluştur

**SQL Editor** sekmesine git ve şu komutu çalıştır:

```sql
-- Admin profili oluştur veya güncelle
INSERT INTO public.profiles (id, email, first_name, last_name, role, created_at, updated_at) 
VALUES 
(
  (SELECT id FROM auth.users WHERE email = 'admin@oguz.com'),
  'admin@oguz.com',
  'Oğuz',
  'Yolyapan',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  updated_at = NOW();
```

## Adım 3: Doğrula

```sql
-- Admin kullanıcısını kontrol et
SELECT 
  p.id, 
  p.email, 
  p.first_name, 
  p.last_name, 
  p.role,
  u.email_confirmed_at,
  u.created_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin';
```

## Test Bilgileri

✅ **Login URL**: http://localhost:5174/giris
✅ **Email**: admin@oguz.com  
✅ **Password**: AdminOguz2024!

Bu adımları tamamladıktan sonra login testi yapabiliriz!
