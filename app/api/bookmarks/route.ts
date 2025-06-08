import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const bookmarks = client.db('interview_qa').collection('bookmarks');
    
    const result = await bookmarks.find({ userId: session.user.id }).toArray();
    
    return NextResponse.json(result.map(b => b.questionId));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { questionId } = await request.json();
    
    if (!questionId) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const bookmarks = client.db('interview_qa').collection('bookmarks');
    
    const existing = await bookmarks.findOne({ 
      userId: session.user.id, 
      questionId 
    });

    if (existing) {
      // Remove bookmark
      await bookmarks.deleteOne({ _id: existing._id });
      return NextResponse.json({ bookmarked: false });
    } else {
      // Add bookmark
      await bookmarks.insertOne({
        userId: session.user.id,
        questionId,
        createdAt: new Date(),
      });
      return NextResponse.json({ bookmarked: true });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to toggle bookmark' }, { status: 500 });
  }
}