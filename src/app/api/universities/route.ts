
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import University from '@/models/university';

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const universities = await University.find({}).sort({ name: 1 });
        return NextResponse.json({ universities }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
