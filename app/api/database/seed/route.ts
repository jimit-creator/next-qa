import { NextRequest, NextResponse } from 'next/server';
import { runSeeders, seeder, seeders, resetDatabase } from '@/database';

export async function GET() {
  try {
    const appliedSeeders = await seeder.getAppliedSeeders();
    
    const status = seeders.map(seederItem => ({
      name: seederItem.name,
      applied: appliedSeeders.includes(seederItem.name)
    }));

    return NextResponse.json({ seeders: status });
  } catch (error) {
    console.error('Error getting seeder status:', error);
    return NextResponse.json(
      { error: 'Failed to get seeder status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    switch (action) {
      case 'run':
        await runSeeders();
        return NextResponse.json({ message: 'Seeders completed successfully' });
        
      case 'force':
        await runSeeders(true);
        return NextResponse.json({ message: 'Seeders force run completed successfully' });
        
      case 'reset':
        await resetDatabase();
        return NextResponse.json({ message: 'Database reset and seeding completed successfully' });
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { error: 'Failed to run seeders' },
      { status: 500 }
    );
  }
}