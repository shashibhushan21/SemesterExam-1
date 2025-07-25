
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Note from '@/models/note';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: string;
  role: string;
}

// DELETE a specific note by ID (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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
        
        const noteId = params.id;
        const deletedNote = await Note.findByIdAndDelete(noteId);

        if (!deletedNote) {
            return NextResponse.json({ message: 'Note not found' }, { status: 404 });
        }
        
        // Optionally, delete from Cloudinary as well if you have the public_id
        // const { v2: cloudinary } = await import('cloudinary');
        // cloudinary.config(...)
        // await cloudinary.uploader.destroy(public_id);

        return NextResponse.json({ message: 'Note deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('DELETE /api/admin/notes/[id] Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
