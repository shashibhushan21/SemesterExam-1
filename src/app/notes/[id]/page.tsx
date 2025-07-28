
import { notFound } from 'next/navigation';
import { NoteClientPage } from './components/note-client-page';
import type { Note } from '@/lib/types';
import { connectToDatabase } from '@/lib/db';
import NoteModel from '@/models/note';
import RatingModel from '@/models/rating';
import mongoose from 'mongoose';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: string;
}

async function getNoteData(id: string) {
    try {
        await connectToDatabase();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return { note: null, userRating: null };
        }

        const note = await NoteModel.findById(id).populate('author', 'name avatar').lean();
        if (!note) {
            return { note: null, userRating: null };
        }

        let userRating: number | null = null;
        const token = cookies().get('token')?.value;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
                const userId = decoded.id;
                const ratingDoc = await RatingModel.findOne({ note: note._id, user: userId }).lean();
                if (ratingDoc) {
                    userRating = ratingDoc.rating;
                }
            } catch (error) {
                // Invalid token, ignore
                console.warn("Could not decode token for rating check:", error);
            }
        }
        
        // Convert mongoose document to plain object and ensure _id is a string
        return {
            note: JSON.parse(JSON.stringify(note)) as Note,
            userRating
        };
    } catch (error) {
        console.error("Failed to fetch note:", error);
        return { note: null, userRating: null };
    }
}


export default async function NotePage({ params }: { params: { id: string } }) {
  const { note, userRating } = await getNoteData(params.id);

  if (!note) {
    notFound();
  }
  
  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return <NoteClientPage note={note} formattedDate={formattedDate} initialUserRating={userRating} />;
}
