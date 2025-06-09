import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sort = searchParams.get('sort') || 'oldest';
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const questions = client.db('interview_qa').collection('questions');
    const categories = client.db('interview_qa').collection('categories');

    let filter: any = {};
    
    if (categoryId) {
      filter.categoryId = categoryId;
    }
    
    if (search) {
      filter.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const result = await questions
      .find(filter)
      .sort({ createdAt: sort === 'newest' ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get category names
    const categoryIds = Array.from(new Set(result.map(q => q.categoryId)));
    const categoryMap = new Map();
    
    if (categoryIds.length > 0) {
      const categoryDocs = await categories.find({
        _id: { $in: categoryIds.map(id => new ObjectId(id)) }
      }).toArray();
      
      categoryDocs.forEach(cat => {
        categoryMap.set(cat._id.toString(), cat.name);
      });
    }

    const questionsWithCategories = result.map(q => ({
      ...q,
      categoryName: categoryMap.get(q.categoryId) || 'Unknown'
    }));

    const total = await questions.countDocuments(filter);

    return NextResponse.json({
      questions: questionsWithCategories,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { question, answer, categoryId, difficulty, tags } = await request.json();
    
    if (!question || !answer || !categoryId || !difficulty) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const questions = client.db('interview_qa').collection('questions');
    
    const result = await questions.insertOne({
      question,
      answer,
      categoryId,
      difficulty,
      tags: tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ _id: result.insertedId, question, answer, categoryId, difficulty, tags });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { _id, question, answer, categoryId, difficulty, tags } = await request.json();
    
    if (!_id || !question || !answer || !categoryId || !difficulty) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const questions = client.db('interview_qa').collection('questions');
    
    const result = await questions.updateOne(
      { _id: new ObjectId(_id) },
      { 
        $set: { 
          question,
          answer,
          categoryId,
          difficulty,
          tags: tags || [],
          updatedAt: new Date() 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const questions = client.db('interview_qa').collection('questions');
    
    const result = await questions.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 });
  }
}