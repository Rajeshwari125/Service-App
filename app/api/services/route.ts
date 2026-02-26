import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Service from '@/lib/models/Service';

export async function GET() {
  try {
    await connectToDatabase();
    const services = await Service.find({}).populate('providerId', 'name');
    return NextResponse.json(services);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const service = await Service.create(body);
    return NextResponse.json(service, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
