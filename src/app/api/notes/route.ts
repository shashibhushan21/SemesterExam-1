
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Note from '@/models/note';

// GET all notes (Public)
export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        
        const notes = await Note.find({})
            .populate('author', 'name avatar') // Populate author's name and avatar
            .sort({ createdAt: -1 }); // Sort by newest first

        return NextResponse.json({ notes }, { status: 200 });

    } catch (error) {
        console.error('GET /api/notes Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
