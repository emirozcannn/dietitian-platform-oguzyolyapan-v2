# Supabase Veritabanı Kurulumu

## 📊 Gerekli Tablolar

Supabase Dashboard'da SQL Editor'ı açın ve şu dosyayı çalıştırın:

```bash
database/notification_tables.sql
```

## 🔧 Hızlı Kurulum

Supabase Dashboard'da:

1. **SQL Editor** sekmesine gidin
2. **Yeni Query** oluşturun  
3. Aşağıdaki SQL'i çalıştırın:

```sql
-- Email log tablosu
CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient text NOT NULL,
  subject text NOT NULL,
  type text NOT NULL,
  status text NOT NULL CHECK (status IN ('sent', 'failed', 'pending')),
  message_id text,
  error_message text,
  created_at timestamp with time zone DEFAULT now()
);

-- Row Level Security (RLS) aktif et
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Admin kullanıcıları için policy
CREATE POLICY "Admin can view email logs" ON email_logs
  FOR ALL USING (
    auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
  );

-- Sistem için policy (email servisi için)
CREATE POLICY "System can insert email logs" ON email_logs
  FOR INSERT WITH CHECK (true);
```

## ✅ Kurulum Kontrolü

Tabloların oluşturulduğunu kontrol edin:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'email_logs';
```

## 🚀 Sonraki Adım

Tablolar oluşturulduktan sonra email test sayfasını tekrar deneyin.
