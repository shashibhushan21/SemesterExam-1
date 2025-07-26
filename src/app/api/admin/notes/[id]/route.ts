
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Note from '@/models/note';
import { checkAdmin } from '@/lib/auth';

// DELETE a specific note by ID (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
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
