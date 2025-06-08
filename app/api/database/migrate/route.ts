import { NextRequest, NextResponse } from 'next/server';
import { runMigrations, rollbackMigration, migrator, migrations } from '@/database';

export async function POST(request: NextRequest) {
  try {
    const { action, targetVersion } = await request.json();
    
    switch (action) {
      case 'up':
        await runMigrations();
        return NextResponse.json({ message: 'Migrations completed successfully' });
      
      case 'down':
        if (!targetVersion) {
          return NextResponse.json({ error: 'Target version required for rollback' }, { status: 400 });
        }
        await rollbackMigration(targetVersion);
        return NextResponse.json({ message: 'Rollback completed successfully' });
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const appliedMigrations = await migrator.getAppliedMigrations();
    
    const status = migrations.map(migration => ({
      version: migration.version,
      name: migration.name,
      applied: appliedMigrations.includes(migration.version)
    }));
    
    return NextResponse.json({ migrations: status });
  } catch (error) {
    console.error('Failed to get migration status:', error);
    return NextResponse.json({ error: 'Failed to get migration status' }, { status: 500 });
  }
}