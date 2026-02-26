import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { action, mobile, password, identifier } = await request.json();

    if (action === 'login') {
      const user = await User.findOne({ 
        $or: [
          { mobile: identifier },
          { name: identifier } // For admin login
        ]
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      if (password && user.password !== password) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }

      return NextResponse.json(user);
    }

    if (action === 'check-exists') {
      const user = await User.findOne({ mobile });
      return NextResponse.json({ exists: !!user });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
