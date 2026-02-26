import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mobile = searchParams.get('mobile');

  try {
    await connectToDatabase();
    if (mobile) {
      const user = await User.findOne({ mobile });
      return NextResponse.json(user);
    }
    const users = await User.find({});
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    // Check if user already exists
    const existingUser = await User.findOne({ mobile: body.mobile });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const user = await User.create(body);
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
    try {
      await connectToDatabase();
      const body = await request.json();
      const { id, ...updateData } = body;
      
      const user = await User.findByIdAndUpdate(id, updateData, { new: true });
      return NextResponse.json(user);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
