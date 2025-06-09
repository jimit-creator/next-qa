import { Seeder } from '@/lib/database/seeder';
import { Db } from 'mongodb';

const seeder: Seeder = {
  name: '002_categories_seeder',
  
  async run(db: Db) {
    const categories = db.collection('categories');
    
    // Check if categories already exist
    const existingCount = await categories.countDocuments();
    
    if (existingCount > 0) {
      console.log('Categories already exist, skipping...');
      return;
    }
    
    const sampleCategories = [
      {
        name: 'JavaScript',
        description: 'JavaScript programming language questions covering ES6+, async/await, closures, and more',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'React',
        description: 'React framework questions including hooks, state management, lifecycle methods, and best practices',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Node.js',
        description: 'Node.js runtime environment questions covering APIs, middleware, databases, and server-side development',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'TypeScript',
        description: 'TypeScript questions covering types, interfaces, generics, and advanced type system features',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Database',
        description: 'Database questions covering SQL, NoSQL, MongoDB, PostgreSQL, and database design principles',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    
    await categories.insertMany(sampleCategories);
    console.log(`Created ${sampleCategories.length} categories`);
  }
};

export default seeder;