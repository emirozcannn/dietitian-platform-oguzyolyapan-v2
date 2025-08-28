import dotenv from 'dotenv';
import connectDB from './src/lib/mongodb.js';
import User from './src/models/User.js';

// Environment variables
dotenv.config();

async function checkUsers() {
  console.log('🔍 Kullanıcıları kontrol ediyorum...');
  
  try {
    await connectDB();
    
    const users = await User.find({}).select('email role firstName lastName');
    
    console.log('\n📋 MEVCUT KULLANICILAR:');
    console.log('──────────────────────────────────────────────────');
    
    users.forEach(user => {
      const roleIcon = user.role === 'super_admin' ? '🔴' : 
                      user.role === 'admin' ? '🟡' : '🟢';
      console.log(`${roleIcon} ${user.email}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   İsim: ${user.firstName} ${user.lastName}`);
      console.log('');
    });
    
    console.log('──────────────────────────────────────────────────');
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    process.exit(0);
  }
}

checkUsers();
