import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const categories = client.db('interview_qa').collection('categories');
    const questions = client.db('interview_qa').collection('questions');
    
    const result = await categories.aggregate([
      {
        $lookup: {
          from: 'questions',
          let: { categoryId: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$categoryId', '$$categoryId'] }
              }
            }
          ],
          as: 'questions'
        }
      },
      {
        $addFields: {
          questionCount: { $size: '$questions' }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          createdAt: 1,
          updatedAt: 1,
          questionCount: 1
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]).toArray();
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description } = await request.json();
    
    if (!name || !description) {
      return NextResponse.json({ error: 'Name and description are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const categories = client.db('interview_qa').collection('categories');
    
    const existingCategory = await categories.findOne({ name });
    if (existingCategory) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
    }

    const result = await categories.insertOne({
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ _id: result.insertedId, name, description });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { _id, name, description } = await request.json();
    
    if (!_id || !name || !description) {
      return NextResponse.json({ error: 'ID, name and description are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const categories = client.db('interview_qa').collection('categories');
    
    const result = await categories.updateOne(
      { _id: new ObjectId(_id) },
      { 
        $set: { 
          name, 
          description, 
          updatedAt: new Date() 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
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
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const categories = client.db('interview_qa').collection('categories');
    const questions = client.db('interview_qa').collection('questions');
    
    // Check if category has questions
    const questionCount = await questions.countDocuments({ categoryId: id });
    if (questionCount > 0) {
      return NextResponse.json({ error: 'Cannot delete category with existing questions' }, { status: 400 });
    }

    const result = await categories.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}