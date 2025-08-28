import dotenv from 'dotenv';
import connectDB from './src/lib/mongodb.js';
import User from './src/models/User.js';

// Environment variables
dotenv.config();

const createUsers = async () => {
  try {
    console.log('🚀 Kullanıcı oluşturma işlemi başlatılıyor...');
    
    // MongoDB'ye bağlan
    await connectDB();
    
    // Mevcut kullanıcıları temizle (isteğe bağlı)
    console.log('🗑️ Mevcut kullanıcılar temizleniyor...');
    await User.deleteMany({});
    
    // 1. Super Admin Kullanıcısı
    const superAdmin = new User({
      firstName: 'Oğuz',
      lastName: 'Yolyapan',
      email: 'admin@oguzyolyapan.com',
      password: 'admin123',
      role: 'super_admin',
      phoneNumber: '+90 555 123 4567',
      isEmailConfirmed: true,
      permissions: [
        'admin.dashboard',
        'admin.users.view',
        'admin.users.create',
        'admin.users.edit',
        'admin.users.delete',
        'admin.packages.view',
        'admin.packages.create',
        'admin.packages.edit',
        'admin.packages.delete',
        'admin.testimonials.view',
        'admin.testimonials.approve',
        'admin.testimonials.reject',
        'admin.blog.view',
        'admin.blog.create',
        'admin.blog.edit',
        'admin.blog.delete',
        'admin.appointments.view',
        'admin.appointments.manage',
        'admin.notifications.send',
        'admin.settings.view',
        'admin.settings.edit'
      ]
    });
    
    await superAdmin.save();
    console.log('✅ Super Admin oluşturuldu:', superAdmin.email);
    
    // 2. Normal Admin Kullanıcısı
    const admin = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      phoneNumber: '+90 555 987 6543',
      isEmailConfirmed: true,
      permissions: [
        'admin.dashboard',
        'admin.users.view',
        'admin.packages.view',
        'admin.packages.edit',
        'admin.testimonials.view',
        'admin.testimonials.approve',
        'admin.blog.view',
        'admin.blog.create',
        'admin.blog.edit',
        'admin.appointments.view'
      ]
    });
    
    await admin.save();
    console.log('✅ Admin oluşturuldu:', admin.email);
    
    // 3. Test Kullanıcısı (Danışan)
    const user1 = new User({
      firstName: 'Ayşe',
      lastName: 'Demir',
      email: 'ayse.demir@example.com',
      password: 'user123',
      role: 'user',
      phoneNumber: '+90 555 111 2233',
      age: 28,
      gender: 'female',
      isEmailConfirmed: true,
      permissions: [
        'client.dashboard',
        'client.profile.view',
        'client.profile.edit',
        'client.appointments.view',
        'client.appointments.book',
        'client.packages.view',
        'client.testimonials.create'
      ]
    });
    
    await user1.save();
    console.log('✅ Test Kullanıcısı 1 oluşturuldu:', user1.email);
    
    // 4. İkinci Test Kullanıcısı
    const user2 = new User({
      firstName: 'Mehmet',
      lastName: 'Kaya',
      email: 'mehmet.kaya@example.com',
      password: 'user123',
      role: 'user',
      phoneNumber: '+90 555 444 5566',
      age: 35,
      gender: 'male',
      isEmailConfirmed: true,
      permissions: [
        'client.dashboard',
        'client.profile.view',
        'client.profile.edit',
        'client.appointments.view',
        'client.appointments.book',
        'client.packages.view',
        'client.testimonials.create'
      ]
    });
    
    await user2.save();
    console.log('✅ Test Kullanıcısı 2 oluşturuldu:', user2.email);
    
    console.log('\n🎉 Tüm kullanıcılar başarıyla oluşturuldu!');
    console.log('\n📋 GİRİŞ BİLGİLERİ:');
    console.log('─'.repeat(50));
    console.log('🔴 SUPER ADMIN:');
    console.log('   Email: admin@oguzyolyapan.com');
    console.log('   Şifre: admin123');
    console.log('   Yetki: Tüm admin paneli erişimi');
    console.log('');
    console.log('🟡 ADMIN:');
    console.log('   Email: admin@example.com');
    console.log('   Şifre: admin123');
    console.log('   Yetki: Sınırlı admin paneli erişimi');
    console.log('');
    console.log('🟢 DANIŞAN 1:');
    console.log('   Email: ayse.demir@example.com');
    console.log('   Şifre: user123');
    console.log('   Yetki: Danışan paneli erişimi');
    console.log('');
    console.log('🟢 DANIŞAN 2:');
    console.log('   Email: mehmet.kaya@example.com');
    console.log('   Şifre: user123');
    console.log('   Yetki: Danışan paneli erişimi');
    console.log('─'.repeat(50));
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Kullanıcı oluşturma hatası:', error.message);
    process.exit(1);
  }
};

createUsers();
