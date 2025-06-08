import { seeder, seeders, runSeeders, resetDatabase } from '@/database';

async function main() {
  const command = process.argv[2];

  try {
    switch (command) {
      case 'run':
        await runSeeders();
        break;
      
      case 'force':
        await runSeeders(true);
        break;
      
      case 'reset':
        await resetDatabase();
        break;
      
      case 'status':
        const appliedSeeders = await seeder.getAppliedSeeders();
        
        console.log('Seeder Status:');
        console.log('==============');
        
        for (const seederItem of seeders) {
          const status = appliedSeeders.includes(seederItem.name) ? '✓' : '✗';
          console.log(`${status} ${seederItem.name}`);
        }
        break;
      
      default:
        console.log('Usage:');
        console.log('  npm run db:seed run     - Run pending seeders');
        console.log('  npm run db:seed force   - Force run all seeders');
        console.log('  npm run db:seed reset   - Reset database and run seeders');
        console.log('  npm run db:seed status  - Show seeder status');
        break;
    }
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

main();