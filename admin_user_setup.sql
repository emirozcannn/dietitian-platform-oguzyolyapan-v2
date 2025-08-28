-- =====================================================
-- ADMIN KULLANICISI OLUŞTURMA - SUPABASE (DÜZELTME)
-- =====================================================

-- ADIM 1: Supabase Dashboard > Authentication > Users kısmında:
--   - "Add user" butonuna tıklayın
--   - Email: admin@oguz.com
--   - Password: AdminOguz2024!
--   - Auto Confirm User: ✅ (ÖNEMLİ!)
--   - "Create user" butonuna tıklayın

-- ADIM 2: Bu SQL'i Supabase Dashboard > SQL Editor'da çalıştırın:

-- Admin profili oluştur veya güncelle
INSERT INTO public.profiles (id, email, first_name, last_name, role, created_at, updated_at) 
VALUES 
(
  -- Bu ID'yi Authentication > Users kısmından admin@oguz.com user'ının ID'si ile değiştirin
  '00000000-0000-0000-0000-000000000000', -- BURAYA GERÇEK USER ID'Yİ YAZIN
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

-- ÖNEMLİ: Önce Authentication > Users kısmından admin@oguz.com kullanıcısını oluşturun!
-- Sonra bu SQL'i çalıştırın:

INSERT INTO public.profiles (id, email, first_name, last_name, role, created_at, updated_at) 
SELECT 
  u.id,
  'admin@oguz.com',
  'Oğuz',
  'Yolyapan', 
  'admin',
  NOW(),
  NOW()
FROM auth.users u
WHERE u.email = 'admin@oguz.com'
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Kontrol sorgusu
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
