import { Seeder } from '@/lib/database/seeder';
import { Db } from 'mongodb';
import bcrypt from 'bcryptjs';

const seeder: Seeder = {
  name: '001_admin_user_seeder',
  
  async run(db: Db) {
    const users = db.collection('users');
    
    // Check if admin user already exists
    const existingAdmin = await users.findOne({ email: 'admin@jimit.dev' });
    
    if (existingAdmin) {
      console.log('Admin user already exists, skipping...');
      return;
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('X9t#4mWz!Qe2', 12);
    
    await users.insertOne({
      name: 'Admin',
      email: 'admin@jimit.dev',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
    });
    
    console.log('Created admin user: admin@jimit.dev / X9t#4mWz!Qe2');
  }
};

export default seeder;