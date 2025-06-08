import 'dotenv/config';
import { setupDatabase } from '@/database';

async function main() {
  try {
    console.log('Starting database setup...');
    await setupDatabase();
    console.log('Database setup completed successfully!');
    
    console.log('\nAdmin credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

main();