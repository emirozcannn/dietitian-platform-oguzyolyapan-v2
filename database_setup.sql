-- =====================================================
-- OĞUZ YOLYAPAN DİYETİSYEN PLATFORMU - VERİTABANI KURULUMU
-- =====================================================

-- 1. PROFILES TABLOSU (Kullanıcı Profilleri)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  phone text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. PACKAGES TABLOSU (Hizmet Paketleri)
CREATE TABLE IF NOT EXISTS public.packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_tr text NOT NULL,
  title_en text NOT NULL,
  description_tr text,
  description_en text,
  price numeric(10,2) NOT NULL,
  duration_tr text,
  duration_en text,
  features_tr jsonb,
  features_en jsonb,
  is_popular boolean DEFAULT false,
  is_active boolean DEFAULT true,
  icon text DEFAULT 'bi-heart',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. BLOG POSTS TABLOSU
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_tr text NOT NULL,
  title_en text NOT NULL,
  slug_tr text UNIQUE NOT NULL,
  slug_en text UNIQUE NOT NULL,
  excerpt_tr text,
  excerpt_en text,
  content_tr text,
  content_en text,
  image_url text,
  image_alt_text text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamp with time zone,
  view_count integer DEFAULT 0,
  read_time integer DEFAULT 5,
  meta_title_tr text,
  meta_title_en text,
  meta_description_tr text,
  meta_description_en text,
  author_id uuid REFERENCES public.profiles(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 4. BLOG KATEGORİLERİ
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_tr text NOT NULL,
  name_en text NOT NULL,
  slug_tr text UNIQUE NOT NULL,
  slug_en text UNIQUE NOT NULL,
  color text DEFAULT '#059669',
  created_at timestamp with time zone DEFAULT now()
);

-- 5. POST-CATEGORY İLİŞKİSİ
CREATE TABLE IF NOT EXISTS public.post_categories (
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- 6. RANDEVULAR
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  appointment_date timestamp with time zone NOT NULL,
  duration_minutes integer DEFAULT 60,
  type text DEFAULT 'consultation' CHECK (type IN ('consultation', 'followup', 'group')),
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  notes text,
  meeting_link text,
  price numeric(10,2),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 7. YORUMLAR/TESTIMONIALS
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text,
  city text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  content_tr text,
  content_en text,
  program_type text,
  before_weight numeric(5,2),
  after_weight numeric(5,2),
  duration_months integer,
  avatar_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 8. FAQ
CREATE TABLE IF NOT EXISTS public.faq (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_tr text NOT NULL,
  question_en text NOT NULL,
  answer_tr text NOT NULL,
  answer_en text NOT NULL,
  category text DEFAULT 'general',
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 9. EMAIL LOGS
CREATE TABLE IF NOT EXISTS public.email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient text NOT NULL,
  subject text NOT NULL,
  type text NOT NULL,
  status text NOT NULL CHECK (status IN ('sent', 'failed', 'pending')),
  message_id text,
  error_message text,
  created_at timestamp with time zone DEFAULT now()
);

-- 10. SİSTEM AYARLARI
CREATE TABLE IF NOT EXISTS public.settings (
  key text PRIMARY KEY,
  value_tr text,
  value_en text,
  type text DEFAULT 'text' CHECK (type IN ('text', 'number', 'boolean', 'json')),
  description text,
  updated_at timestamp with time zone DEFAULT now()
);

-- =====================================================
-- RLS (ROW LEVEL SECURITY) POLİTİKALARI
-- =====================================================

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin can view all profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Packages RLS (Herkes görebilir)
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view packages" ON public.packages FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage packages" ON public.packages FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Posts RLS (Yayınlananları herkes görebilir)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view published posts" ON public.posts FOR SELECT USING (status = 'published');
CREATE POLICY "Admin can manage posts" ON public.posts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Categories RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin can manage categories" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Appointments RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own appointments" ON public.appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create appointments" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin can view all appointments" ON public.appointments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Testimonials RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view approved testimonials" ON public.testimonials FOR SELECT USING (status = 'approved');
CREATE POLICY "Admin can manage testimonials" ON public.testimonials FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- FAQ RLS
ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view active FAQ" ON public.faq FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage FAQ" ON public.faq FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Email Logs RLS
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can view email logs" ON public.email_logs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
CREATE POLICY "System can insert email logs" ON public.email_logs FOR INSERT WITH CHECK (true);

-- Settings RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Admin can manage settings" ON public.settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- =====================================================
-- ÖRNEK VERİLER (DEMO DATA)
-- =====================================================

-- Kategoriler
INSERT INTO public.categories (name_tr, name_en, slug_tr, slug_en, color) VALUES
('Beslenme', 'Nutrition', 'beslenme', 'nutrition', '#059669'),
('Kilo Yönetimi', 'Weight Management', 'kilo-yonetimi', 'weight-management', '#0ea5e9'),
('Spor Beslenmesi', 'Sports Nutrition', 'spor-beslenmesi', 'sports-nutrition', '#f59e0b'),
('Sağlıklı Yaşam', 'Healthy Living', 'saglikli-yasam', 'healthy-living', '#8b5cf6'),
('Diyet İpuçları', 'Diet Tips', 'diyet-ipuclari', 'diet-tips', '#ef4444')
ON CONFLICT (slug_tr) DO NOTHING;

-- Paketler
INSERT INTO public.packages (title_tr, title_en, description_tr, description_en, price, duration_tr, duration_en, features_tr, features_en, is_popular) VALUES
(
  'Temel Beslenme Paketi',
  'Basic Nutrition Package',
  'Kişiselleştirilmiş beslenme planı ve temel danışmanlık hizmeti.',
  'Personalized nutrition plan and basic counseling service.',
  299.00,
  '1 Ay',
  '1 Month',
  '["Kişisel beslenme planı", "2 online görüşme", "WhatsApp destek", "İlerleme takibi"]',
  '["Personal nutrition plan", "2 online consultations", "WhatsApp support", "Progress tracking"]',
  false
),
(
  'Premium Beslenme Paketi',
  'Premium Nutrition Package',
  'Kapsamlı beslenme danışmanlığı ve sürekli destek ile hedefinize ulaşın.',
  'Comprehensive nutrition counseling with continuous support to reach your goals.',
  599.00,
  '3 Ay',
  '3 Months',
  '["Detaylı beslenme analizi", "6 online görüşme", "24/7 WhatsApp destek", "Haftalık plan güncellemeleri", "Alışveriş listesi"]',
  '["Detailed nutrition analysis", "6 online consultations", "24/7 WhatsApp support", "Weekly plan updates", "Shopping list"]',
  true
),
(
  'VIP Transformasyon Paketi',
  'VIP Transformation Package',
  'Tamamen kişiselleştirilmiş yaklaşım ile yaşam tarzı dönüşümü.',
  'Complete lifestyle transformation with fully personalized approach.',
  999.00,
  '6 Ay',
  '6 Months',
  '["Bireysel diyetisyen ataması", "12 online görüşme", "Aylık vücut analizi", "Supplement önerileri", "Yaşam koçluğu", "Acil destek hattı"]',
  '["Dedicated dietitian assignment", "12 online consultations", "Monthly body analysis", "Supplement recommendations", "Life coaching", "Emergency support line"]',
  false
)
ON CONFLICT DO NOTHING;

-- Örnek testimonial
INSERT INTO public.testimonials (name, title, city, rating, content_tr, content_en, program_type, status) VALUES
(
  'Ayşe Kaya',
  'Öğretmen',
  'İstanbul',
  5,
  '3 ayda 12 kilo verdim ve kendimi çok daha enerjik hissediyorum. Oğuz Beyin profesyonel yaklaşımı ve sürekli desteği sayesinde hedeflerime ulaştım.',
  'I lost 12 kg in 3 months and feel much more energetic. Thanks to Oğuz''s professional approach and continuous support, I reached my goals.',
  'Premium Paket',
  'approved'
),
(
  'Mehmet Yılmaz',
  'Mühendis',
  'Ankara',
  5,
  'Spor yapıyordum ama beslenme konusunda bilinçsizim. Oğuz Bey sayesinde hem performansım arttı hem de ideal kilomla buluştum.',
  'I was exercising but was unconscious about nutrition. Thanks to Oğuz, both my performance increased and I met my ideal weight.',
  'Spor Beslenmesi',
  'approved'
)
ON CONFLICT DO NOTHING;

-- FAQ örnekleri
INSERT INTO public.faq (question_tr, question_en, answer_tr, answer_en, category, order_index) VALUES
(
  'Beslenme planı ne kadar sürede hazırlanır?',
  'How long does it take to prepare a nutrition plan?',
  'İlk görüşmemizden sonra 24-48 saat içinde kişiselleştirilmiş beslenme planınız hazır olur.',
  'Your personalized nutrition plan will be ready within 24-48 hours after our first consultation.',
  'general',
  1
),
(
  'Online görüşmeler nasıl yapılır?',
  'How are online consultations conducted?',
  'Zoom, Google Meet veya WhatsApp video arama üzerinden güvenli ve rahat bir şekilde görüşmelerimizi gerçekleştiriyoruz.',
  'We conduct our meetings safely and comfortably via Zoom, Google Meet or WhatsApp video call.',
  'technical',
  2
),
(
  'Plan dışında destek alabilir miyim?',
  'Can I get support outside the plan?',
  'Elbette! WhatsApp üzerinden sorularınızı sorabilir, motivasyon desteği alabilirsiniz.',
  'Of course! You can ask your questions via WhatsApp and get motivation support.',
  'support',
  3
)
ON CONFLICT DO NOTHING;

-- Temel ayarlar
INSERT INTO public.settings (key, value_tr, value_en, type, description) VALUES
('site_title', 'Uzman Diyetisyen Oğuz Yolyapan', 'Expert Dietitian Oğuz Yolyapan', 'text', 'Website title'),
('contact_phone', '+90 555 123 45 67', '+90 555 123 45 67', 'text', 'Contact phone number'),
('contact_email', 'info@oguzyolyapan.com', 'info@oguzyolyapan.com', 'text', 'Contact email'),
('office_address', 'Bahçelievler Mh. Atatürk Cd. No:123 Bahçelievler/İstanbul', 'Bahçelievler District, Atatürk Street No:123 Bahçelievler/Istanbul', 'text', 'Office address'),
('consultation_price', '200', '200', 'number', 'Default consultation price'),
('appointment_duration', '60', '60', 'number', 'Default appointment duration in minutes')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- TRİGGER FUNCTIONS (Otomatik güncellemeler)
-- =====================================================

-- Updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Tablolara trigger ekleme
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON public.packages 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faq_updated_at BEFORE UPDATE ON public.faq 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INDEX'LER (Performans Optimizasyonu)
-- =====================================================

-- Email için unique index
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);

-- Blog slug'ları için index
CREATE UNIQUE INDEX IF NOT EXISTS posts_slug_tr_idx ON public.posts(slug_tr);
CREATE UNIQUE INDEX IF NOT EXISTS posts_slug_en_idx ON public.posts(slug_en);

-- Randevu tarihleri için index  
CREATE INDEX IF NOT EXISTS appointments_date_idx ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS appointments_user_id_idx ON public.appointments(user_id);

-- Published posts için index
CREATE INDEX IF NOT EXISTS posts_published_idx ON public.posts(status, published_at DESC) WHERE status = 'published';

-- Testimonials için index
CREATE INDEX IF NOT EXISTS testimonials_status_idx ON public.testimonials(status, created_at DESC) WHERE status = 'approved';

-- =====================================================
-- KURULUM TAMAMLANDI! 
-- =====================================================

-- Kontrol sorgusu
SELECT 
  'Database setup completed successfully!' as status,
  count(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'packages', 'posts', 'categories', 'appointments', 'testimonials', 'faq', 'email_logs', 'settings');
