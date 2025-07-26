
import { notFound } from 'next/navigation';
import { NoteClientPage } from './components/note-client-page';
import type { Note } from '@/lib/types';
import { connectToDatabase } from '@/lib/db';
import NoteModel from '@/models/note';
import mongoose from 'mongoose';

async function getNote(id: string): Promise<Note | null> {
    try {
        await connectToDatabase();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        const note = await NoteModel.findById(id).populate('author', 'name avatar').lean();
        if (!note) {
            return null;
        }
        // Convert mongoose document to plain object and ensure _id is a string
        return JSON.parse(JSON.stringify(note)) as Note;
    } catch (error) {
        console.error("Failed to fetch note:", error);
        throw new Error('Failed to fetch note');
    }
}


export default async function NotePage({ params }: { params: { id: string } }) {
  const note = await getNote(params.id);

  if (!note) {
    notFound();
  }

  return <NoteClientPage note={note} />;
}
