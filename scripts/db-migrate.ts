import 'dotenv/config';
import { migrator, migrations, runMigrations, rollbackMigration } from '@/database';

async function main() {
  const command = process.argv[2];
  const targetVersion = process.argv[3];

  try {
    switch (command) {
      case 'up':
        await runMigrations();
        break;
      
      case 'down':
        if (!targetVersion) {
          console.error('Please provide target version for rollback');
          process.exit(1);
        }
        await rollbackMigration(targetVersion);
        break;
      
      case 'status':
        const appliedMigrations = await migrator.getAppliedMigrations();
        const migrationFiles = await migrations.get();
        
        console.log('Migration Status:');
        console.log('================');
        
        for (const migration of migrationFiles) {
          const status = appliedMigrations.includes(migration.version) ? '✓' : '✗';
          console.log(`${status} ${migration.version} - ${migration.name}`);
        }
        break;
      
      default:
        console.log('Usage:');
        console.log('  npm run db:migrate up           - Run pending migrations');
        console.log('  npm run db:migrate down <version> - Rollback to version');
        console.log('  npm run db:migrate status       - Show migration status');
        break;
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main();