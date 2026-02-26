import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const role = searchParams.get('role');

  try {
    await connectToDatabase();
    let query = {};
    if (userId) {
      if (role === 'provider') {
        query = { providerId: userId };
      } else {
        query = { customerId: userId };
      }
    }
    const bookings = await Booking.find(query)
      .populate('serviceId')
      .populate('customerId', 'name')
      .populate('providerId', 'name')
      .sort({ createdAt: -1 });
    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const booking = await Booking.create(body);
    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { id, ...updateData } = body;
    const booking = await Booking.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(booking);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
