import { DatabaseMigrator } from '@/lib/database/migrator';
import { DatabaseSeeder } from '@/lib/database/seeder';

// Import migrations
import migration001 from './migrations/001_create_users_collection';
import migration002 from './migrations/002_create_categories_collection';
import migration003 from './migrations/003_create_questions_collection';
import migration004 from './migrations/004_create_bookmarks_collection';

// Import seeders
import seeder001 from './seeders/001_admin_user_seeder';
import seeder002 from './seeders/002_categories_seeder';
import seeder003 from './seeders/003_questions_seeder';

export const migrations = [
  migration001,
  migration002,
  migration003,
  migration004,
];

export const seeders = [
  seeder001,
  seeder002,
  seeder003,
];

export const migrator = new DatabaseMigrator();
export const seeder = new DatabaseSeeder();

// Helper functions
export async function runMigrations() {
  await migrator.runMigrations(migrations);
}

export async function runSeeders(force = false) {
  await seeder.runSeeders(seeders, force);
}

export async function setupDatabase() {
  console.log('Setting up database...');
  await runMigrations();
  await runSeeders();
  console.log('Database setup completed');
}

export async function resetDatabase() {
  console.log('Resetting database...');
  await seeder.resetDatabase();
  await runMigrations();
  await runSeeders(true);
  console.log('Database reset completed');
}

export async function rollbackMigration(targetVersion: string) {
  await migrator.rollbackMigration(migrations, targetVersion);
}