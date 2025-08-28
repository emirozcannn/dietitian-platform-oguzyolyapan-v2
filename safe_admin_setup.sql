-- =====================================================
-- SAFE ADMIN USER SETUP - Kullanıcı oluşturduktan sonra çalıştırın
-- =====================================================

-- Bu SQL Authentication'da user oluşturduktan SONRA çalıştırılmalıdır

-- Güvenli yöntem: Email ile otomatik bulma
INSERT INTO public.profiles (id, email, first_name, last_name, role, created_at, updated_at) 
SELECT 
  u.id,
  u.email,
  'Oğuz',
  'Yolyapan', 
  'admin',
  NOW(),
  NOW()
FROM auth.users u
WHERE u.email = 'admin@oguz.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = u.id
  );

-- Eğer zaten varsa güncelle
UPDATE public.profiles 
SET 
  first_name = 'Oğuz',
  last_name = 'Yolyapan',
  role = 'admin',
  updated_at = NOW()
WHERE email = 'admin@oguz.com';

-- Kontrol sorgusu
SELECT 
  p.id, 
  p.email, 
  p.first_name, 
  p.last_name, 
  p.role,
  u.email_confirmed_at,
  u.created_at as user_created_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email = 'admin@oguz.com';

-- Eğer sonuç boşsa, önce Authentication'da kullanıcı oluşturun!
