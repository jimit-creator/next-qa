import { Migration } from '@/lib/database/migrator';
import { Db } from 'mongodb';

const migration: Migration = {
  version: '002',
  name: 'create_categories_collection',
  
  async up(db: Db) {
    // Create categories collection
    await db.createCollection('categories');
    
    // Create indexes
    await db.collection('categories').createIndex({ name: 1 }, { unique: true });
    await db.collection('categories').createIndex({ createdAt: 1 });
    
    console.log('Created categories collection with indexes');
  },
  
  async down(db: Db) {
    await db.collection('categories').drop();
    console.log('Dropped categories collection');
  }
};

export default migration;