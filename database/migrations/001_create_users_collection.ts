import { Migration } from '@/lib/database/migrator';
import { Db } from 'mongodb';

const migration: Migration = {
  version: '001',
  name: 'create_users_collection',
  
  async up(db: Db) {
    // Create users collection
    await db.createCollection('users');
    
    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    await db.collection('users').createIndex({ createdAt: 1 });
    
    console.log('Created users collection with indexes');
  },
  
  async down(db: Db) {
    await db.collection('users').drop();
    console.log('Dropped users collection');
  }
};

export default migration;