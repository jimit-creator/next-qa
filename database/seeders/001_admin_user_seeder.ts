import { Seeder } from '@/lib/database/seeder';
import { Db } from 'mongodb';
import bcrypt from 'bcryptjs';

const seeder: Seeder = {
  name: '001_admin_user_seeder',
  
  async run(db: Db) {
    const users = db.collection('users');
    
    // Check if admin user already exists
    const existingAdmin = await users.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists, skipping...');
      return;
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await users.insertOne({
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
    });
    
    console.log('Created admin user: admin@example.com / admin123');
  }
};

export default seeder;