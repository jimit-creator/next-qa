import { NextResponse } from 'next/server';
import { setupDatabase } from '@/database';

export async function POST() {
  try {
    await setupDatabase();
    
    return NextResponse.json({ 
      message: 'Database setup completed successfully',
      adminCredentials: {
        email: 'admin@example.com',
        password: 'admin123'
      }
    });
  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json({ error: 'Failed to setup database' }, { status: 500 });
  }
}