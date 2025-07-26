
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Note from '@/models/note';
import { checkAdmin } from '@/lib/auth';

// GET all notes (Admin only)
export async function GET(req: NextRequest) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();
        
        const notes = await Note.find({})
            .populate('author', 'name') // Populate author's name
            .sort({ createdAt: -1 }); // Sort by newest first

        return NextResponse.json({ notes }, { status: 200 });

    } catch (error) {
        console.error('GET /api/admin/notes Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
