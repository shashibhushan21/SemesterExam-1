
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Rating from '@/models/rating';
import mongoose from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectToDatabase();
        
        const noteId = params.id;
        
        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return NextResponse.json({ message: 'Invalid note ID' }, { status: 400 });
        }

        const reviews = await Rating.find({ note: noteId })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 });

        return NextResponse.json({ reviews }, { status: 200 });

    } catch (error) {
        console.error('GET /api/notes/[id]/reviews Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
