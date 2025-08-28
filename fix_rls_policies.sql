-- RLS POLİTİKALARINI DÜZELTME SQL'İ
-- Supabase Dashboard > SQL Editor'da çalıştırın

-- Önce mevcut politikaları kaldıralım
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;

-- Yeni, daha esnek politikalar ekleyelim
CREATE POLICY "Enable read access for all users" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Kontrol sorgusu - admin profilini manuel ekleyelim
INSERT INTO public.profiles (id, email, first_name, last_name, role, created_at, updated_at) 
VALUES 
(
  'ab6add2b-85c4-4fd7-9035-c6ebe848eabb',
  'admin@oguz.com',
  'Oğuz',
  'Yolyapan',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  first_name = 'Oğuz',
  last_name = 'Yolyapan',
  updated_at = NOW();

-- Kontrol
SELECT * FROM public.profiles WHERE email = 'admin@oguz.com';
