
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Note from '@/models/note';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: string;
  role: string;
}

// GET all notes (Admin only)
export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        if (decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
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
