-- ADMIN KULLANICISINI DÜZELTME SQL'İ
-- Supabase Dashboard > SQL Editor'da çalıştırın

-- Önce admin kullanıcısının ID'sini bulalım
SELECT id, email, created_at FROM auth.users WHERE email = 'admin@oguz.com';

-- Admin profili oluştur/güncelle
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
  role = 'admin',
  updated_at = NOW();

-- Kontrol sorgusu
SELECT 
  p.id, 
  p.email, 
  p.first_name, 
  p.last_name, 
  p.role,
  u.email_confirmed_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email = 'admin@oguz.com';
