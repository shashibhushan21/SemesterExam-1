
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Note from '@/models/note';
import mongoose from 'mongoose';

// GET a specific note by ID (Public)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectToDatabase();
        
        const noteId = params.id;
        
        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return NextResponse.json({ message: 'Invalid note ID' }, { status: 400 });
        }

        const note = await Note.findById(noteId).populate('author', 'name avatar');

        if (!note) {
            return NextResponse.json({ message: 'Note not found' }, { status: 404 });
        }

        return NextResponse.json({ note }, { status: 200 });
    } catch (error) {
        console.error('GET /api/notes/[id] Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
