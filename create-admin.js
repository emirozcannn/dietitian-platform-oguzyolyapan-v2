import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// MongoDB bağlantısı
const MONGODB_URI = "mongodb+srv://emirus1214:vELRZem6OH5WEur5@cluster0.vhvvowo.mongodb.net/oguz-dietitian?retryWrites=true&w=majority&appName=Cluster0";

// User schema (basit versiyon)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'super_admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false }
}, { timestamps: true });

// Şifre hash'leme
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

// Sample data oluşturma fonksiyonu
async function createSampleData() {
  try {
    console.log('🔗 MongoDB\'ye bağlanıyor...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB bağlantısı başarılı!');

    // Admin kullanıcı oluştur
    const adminExists = await User.findOne({ email: 'admin@oguzyolyapan.com' });
    
    if (!adminExists) {
      const admin = new User({
        email: 'admin@oguzyolyapan.com',
        password: 'Admin123!',
        firstName: 'Oğuz',
        lastName: 'Yolyapan',
        role: 'admin',
        emailVerified: true,
        isActive: true
      });

      await admin.save();
      console.log('✅ Admin kullanıcı oluşturuldu!');
      console.log('📧 Email: admin@oguzyolyapan.com');
      console.log('🔑 Şifre: Admin123!');
    } else {
      console.log('ℹ️  Admin kullanıcı zaten mevcut');
    }

    // Test kullanıcısı oluştur
    const testUserExists = await User.findOne({ email: 'test@example.com' });
    
    if (!testUserExists) {
      const testUser = new User({
        email: 'test@example.com',
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
        emailVerified: true,
        isActive: true
      });

      await testUser.save();
      console.log('✅ Test kullanıcısı oluşturuldu!');
      console.log('📧 Email: test@example.com');
      console.log('🔑 Şifre: Test123!');
    } else {
      console.log('ℹ️  Test kullanıcısı zaten mevcut');
    }

    console.log('🎉 Sample data oluşturma tamamlandı!');
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔐 MongoDB bağlantısı kapatıldı');
  }
}

// Script çalıştır
createSampleData();
