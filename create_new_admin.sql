-- YENİ ADMIN KULLANICISI OLUŞTURMA
-- Supabase Dashboard kullanarak:

-- 1. Authentication > Users > "Add user" butonuna tıklayın
-- 2. Bu bilgileri girin:
--    Email: admin2@oguz.com
--    Password: AdminOguz2024!
--    Auto Confirm User: ✅
-- 3. User oluşturduktan sonra bu SQL'i çalıştırın:

INSERT INTO public.profiles (id, email, first_name, last_name, role, created_at, updated_at) 
SELECT 
  u.id,
  'admin2@oguz.com',
  'Oğuz',
  'Yolyapan', 
  'admin',
  NOW(),
  NOW()
FROM auth.users u
WHERE u.email = 'admin2@oguz.com';
