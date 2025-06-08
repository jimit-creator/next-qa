import { Migration } from '@/lib/database/migrator';
import { Db } from 'mongodb';

const migration: Migration = {
  version: '003',
  name: 'create_questions_collection',
  
  async up(db: Db) {
    // Create questions collection
    await db.createCollection('questions');
    
    // Create indexes
    await db.collection('questions').createIndex({ categoryId: 1 });
    await db.collection('questions').createIndex({ difficulty: 1 });
    await db.collection('questions').createIndex({ tags: 1 });
    await db.collection('questions').createIndex({ createdAt: 1 });
    
    // Text search index for question and answer content
    await db.collection('questions').createIndex(
      { question: 'text', answer: 'text', tags: 'text' },
      { name: 'text_search_index' }
    );
    
    console.log('Created questions collection with indexes');
  },
  
  async down(db: Db) {
    await db.collection('questions').drop();
    console.log('Dropped questions collection');
  }
};

export default migration;