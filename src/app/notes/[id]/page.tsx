
import { notFound } from 'next/navigation';
import { NoteClientPage } from './components/note-client-page';
import type { Note, Rating } from '@/lib/types';
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
            return { note: null, userRating: null, reviews: [] };
        }

        const note = await NoteModel.findById(id).populate('author', 'name avatar').lean();
        if (!note) {
            return { note: null, userRating: null, reviews: [] };
        }

        const reviews = await RatingModel.find({ note: note._id })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 })
            .lean();

        let userRating: Rating | null = null;
        const token = cookies().get('token')?.value;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
                const userId = decoded.id;
                const ratingDoc = await RatingModel.findOne({ note: note._id, user: userId }).lean();
                if (ratingDoc) {
                    userRating = JSON.parse(JSON.stringify(ratingDoc));
                }
            } catch (error) {
                // Invalid token, ignore
                console.warn("Could not decode token for rating check:", error);
            }
        }
        
        return {
            note: JSON.parse(JSON.stringify(note)) as Note,
            userRating,
            reviews: JSON.parse(JSON.stringify(reviews)) as Rating[]
        };
    } catch (error) {
        console.error("Failed to fetch note:", error);
        return { note: null, userRating: null, reviews: [] };
    }
}


export default async function NotePage({ params }: { params: { id: string } }) {
  const { note, userRating, reviews } = await getNoteData(params.id);

  if (!note) {
    notFound();
  }
  
  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return <NoteClientPage note={note} formattedDate={formattedDate} initialUserRating={userRating} reviews={reviews} />;
}
