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

// Initialize arrays to store migrations and seeders
let _migrations: any[] = [];
let _seeders: any[] = [];

// Initialize function to load migrations and seeders
async function initialize() {
  if (_migrations.length === 0) {
    _migrations = await importFiles(path.join(__dirname, 'migrations'));
  }
  if (_seeders.length === 0) {
    _seeders = await importFiles(path.join(__dirname, 'seeders'));
  }
}

export const migrator = new DatabaseMigrator();
export const seeder = new DatabaseSeeder();

// Export getters for migrations and seeders
export const migrations = {
  get: async () => {
    await initialize();
    return _migrations;
  }
};

export const seeders = {
  get: async () => {
    await initialize();
    return _seeders;
  }
};

// Helper functions
export async function runMigrations() {
  const migrationFiles = await migrations.get();
  await migrator.runMigrations(migrationFiles);
}

export async function runSeeders(force = false) {
  const seederFiles = await seeders.get();
  await seeder.runSeeders(seederFiles, force);
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
  const migrationFiles = await migrations.get();
  await migrator.rollbackMigration(migrationFiles, targetVersion);
}