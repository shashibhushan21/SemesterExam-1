
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Note from '@/models/note';
import { checkAdmin } from '@/lib/auth';
import { z } from 'zod';

const updateNoteSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  university: z.string().min(3, 'University is required'),
  subject: z.string().min(3, 'Subject is required'),
  semester: z.string().min(1, 'Semester is required'),
  branch: z.string().min(1, 'Branch is required'),
  rating: z.number().min(0, "Rating must be at least 0").max(5, "Rating must be at most 5").optional(),
});


// UPDATE a specific note by ID (Admin only)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const validation = updateNoteSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ message: 'Invalid input', errors: validation.error.errors }, { status: 400 });
        }

        await connectToDatabase();
        
        const noteId = params.id;
        const updatedNote = await Note.findByIdAndUpdate(noteId, validation.data, { new: true });

        if (!updatedNote) {
            return NextResponse.json({ message: 'Note not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Note updated successfully', note: updatedNote }, { status: 200 });
    } catch (error) {
        console.error('PATCH /api/admin/notes/[id] Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}


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
