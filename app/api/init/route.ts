import { NextResponse } from 'next/server';
import { setupDatabase } from '@/database';

export async function POST() {
  try {
    await setupDatabase();
    
    return NextResponse.json({ 
      message: 'Database initialized successfully',
      adminCredentials: {
        email: 'admin@example.com',
        password: 'admin123'
      }
    });
  } catch (error) {
    console.error('Init error:', error);
    return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 });
  }
}