import clientPromise from '@/lib/mongodb';
import { Db } from 'mongodb';

export interface Migration {
  version: string;
  name: string;
  up: (db: Db) => Promise<void>;
  down: (db: Db) => Promise<void>;
}

export class DatabaseMigrator {
  private db: Db | null = null;

  async connect() {
    if (!this.db) {
      const client = await clientPromise;
      this.db = client.db('interview_qa');
    }
    return this.db;
  }

  async ensureMigrationsCollection() {
    const db = await this.connect();
    const collections = await db.listCollections({ name: 'migrations' }).toArray();
    
    if (collections.length === 0) {
      await db.createCollection('migrations');
      console.log('Created migrations collection');
    }
  }

  async getAppliedMigrations(): Promise<string[]> {
    const db = await this.connect();
    await this.ensureMigrationsCollection();
    
    const migrations = await db.collection('migrations')
      .find({})
      .sort({ appliedAt: 1 })
      .toArray();
    
    return migrations.map(m => m.version);
  }

  async markMigrationAsApplied(version: string, name: string) {
    const db = await this.connect();
    await db.collection('migrations').insertOne({
      version,
      name,
      appliedAt: new Date()
    });
  }

  async markMigrationAsReverted(version: string) {
    const db = await this.connect();
    await db.collection('migrations').deleteOne({ version });
  }

  async runMigrations(migrations: Migration[]) {
    const appliedMigrations = await this.getAppliedMigrations();
    const pendingMigrations = migrations.filter(m => !appliedMigrations.includes(m.version));

    if (pendingMigrations.length === 0) {
      console.log('No pending migrations');
      return;
    }

    console.log(`Running ${pendingMigrations.length} pending migrations...`);

    for (const migration of pendingMigrations) {
      try {
        console.log(`Running migration: ${migration.version} - ${migration.name}`);
        const db = await this.connect();
        await migration.up(db);
        await this.markMigrationAsApplied(migration.version, migration.name);
        console.log(`✓ Migration ${migration.version} completed`);
      } catch (error) {
        console.error(`✗ Migration ${migration.version} failed:`, error);
        throw error;
      }
    }

    console.log('All migrations completed successfully');
  }

  async rollbackMigration(migrations: Migration[], targetVersion: string) {
    const appliedMigrations = await this.getAppliedMigrations();
    const migrationMap = new Map(migrations.map(m => [m.version, m]));
    
    // Find migrations to rollback (in reverse order)
    const migrationsToRollback = appliedMigrations
      .filter(version => version > targetVersion)
      .reverse()
      .map(version => migrationMap.get(version))
      .filter(Boolean) as Migration[];

    if (migrationsToRollback.length === 0) {
      console.log('No migrations to rollback');
      return;
    }

    console.log(`Rolling back ${migrationsToRollback.length} migrations...`);

    for (const migration of migrationsToRollback) {
      try {
        console.log(`Rolling back migration: ${migration.version} - ${migration.name}`);
        const db = await this.connect();
        await migration.down(db);
        await this.markMigrationAsReverted(migration.version);
        console.log(`✓ Migration ${migration.version} rolled back`);
      } catch (error) {
        console.error(`✗ Rollback of migration ${migration.version} failed:`, error);
        throw error;
      }
    }

    console.log('Rollback completed successfully');
  }
}