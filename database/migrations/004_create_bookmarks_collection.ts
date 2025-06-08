import { Migration } from '@/lib/database/migrator';
import { Db } from 'mongodb';

const migration: Migration = {
  version: '004',
  name: 'create_bookmarks_collection',
  
  async up(db: Db) {
    // Create bookmarks collection
    await db.createCollection('bookmarks');
    
    // Create indexes
    await db.collection('bookmarks').createIndex({ userId: 1 });
    await db.collection('bookmarks').createIndex({ questionId: 1 });
    await db.collection('bookmarks').createIndex({ userId: 1, questionId: 1 }, { unique: true });
    await db.collection('bookmarks').createIndex({ createdAt: 1 });
    
    console.log('Created bookmarks collection with indexes');
  },
  
  async down(db: Db) {
    await db.collection('bookmarks').drop();
    console.log('Dropped bookmarks collection');
  }
};

export default migration;