import clientPromise from '@/lib/mongodb';
import { Db } from 'mongodb';
import bcrypt from 'bcryptjs';

export interface Seeder {
  name: string;
  run: (db: Db) => Promise<void>;
}

export class DatabaseSeeder {
  private db: Db | null = null;

  async connect() {
    if (!this.db) {
      const client = await clientPromise;
      this.db = client.db('interview_qa');
    }
    return this.db;
  }

  async ensureSeedersCollection() {
    const db = await this.connect();
    const collections = await db.listCollections({ name: 'seeders' }).toArray();
    
    if (collections.length === 0) {
      await db.createCollection('seeders');
      console.log('Created seeders collection');
    }
  }

  async getAppliedSeeders(): Promise<string[]> {
    const db = await this.connect();
    await this.ensureSeedersCollection();
    
    const seeders = await db.collection('seeders')
      .find({})
      .sort({ appliedAt: 1 })
      .toArray();
    
    return seeders.map(s => s.name);
  }

  async markSeederAsApplied(name: string) {
    const db = await this.connect();
    await db.collection('seeders').insertOne({
      name,
      appliedAt: new Date()
    });
  }

  async runSeeders(seeders: Seeder[], force = false) {
    const appliedSeeders = force ? [] : await this.getAppliedSeeders();
    const pendingSeeders = seeders.filter(s => !appliedSeeders.includes(s.name));

    if (pendingSeeders.length === 0 && !force) {
      console.log('No pending seeders');
      return;
    }

    const seedersToRun = force ? seeders : pendingSeeders;
    console.log(`Running ${seedersToRun.length} seeders...`);

    for (const seeder of seedersToRun) {
      try {
        console.log(`Running seeder: ${seeder.name}`);
        const db = await this.connect();
        await seeder.run(db);
        if (!force) {
          await this.markSeederAsApplied(seeder.name);
        }
        console.log(`✓ Seeder ${seeder.name} completed`);
      } catch (error) {
        console.error(`✗ Seeder ${seeder.name} failed:`, error);
        throw error;
      }
    }

    console.log('All seeders completed successfully');
  }

  async resetDatabase() {
    const db = await this.connect();
    
    console.log('Resetting database...');
    
    // Drop all collections except system collections
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      if (!collection.name.startsWith('system.')) {
        await db.collection(collection.name).drop();
        console.log(`Dropped collection: ${collection.name}`);
      }
    }
    
    console.log('Database reset completed');
  }
}