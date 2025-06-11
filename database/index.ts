import { DatabaseMigrator } from '@/lib/database/migrator';
import { DatabaseSeeder } from '@/lib/database/seeder';
import fs from 'fs';
import path from 'path';

// Function to dynamically import files from a directory
async function importFiles(directory: string) {
  const files = fs.readdirSync(directory)
    .filter(file => file.endsWith('.ts'))
    .sort(); // Sort to ensure correct order

  const imports = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(directory, file);
      return import(filePath);
    })
  );

  return imports;
}

let migrations: any[] = [];
let seeders: any[] = [];

// Initialize function to load migrations and seeders
async function initialize() {
  migrations = await importFiles(path.join(__dirname, 'migrations'));
  seeders = await importFiles(path.join(__dirname, 'seeders'));
}

export const migrator = new DatabaseMigrator();
export const seeder = new DatabaseSeeder();

// Helper functions
export async function runMigrations() {
  if (migrations.length === 0) {
    await initialize();
  }
  await migrator.runMigrations(migrations);
}

export async function runSeeders(force = false) {
  if (seeders.length === 0) {
    await initialize();
  }
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
  if (migrations.length === 0) {
    await initialize();
  }
  await migrator.rollbackMigration(migrations, targetVersion);
}