import { NextRequest, NextResponse } from 'next/server';
import { runMigrations, rollbackMigration, migrator } from '@/database';

export async function POST(request: NextRequest) {
  try {
    const { action, targetVersion } = await request.json();

    if (action === 'rollback' && targetVersion) {
      await rollbackMigration(targetVersion);
      return NextResponse.json({ message: `Successfully rolled back to version ${targetVersion}` });
    }

    await runMigrations();
    return NextResponse.json({ message: 'Migrations completed successfully' });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Failed to run migrations' },
      { status: 500 }
    );
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