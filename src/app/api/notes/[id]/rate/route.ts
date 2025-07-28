

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Note from '@/models/note';
import Rating from '@/models/rating';
import User from '@/models/user';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

interface DecodedToken {
  id: string;
}

const rateNoteSchema = z.object({
  rating: z.number().min(1).max(5),
  review: z.string().min(10, 'Review must be at least 10 characters long.').max(500, 'Review must be less than 500 characters.'),
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    const userId = decoded.id;
    
    if (!userId) {
        return NextResponse.json({ message: 'User ID not found in token' }, { status: 401 });
    }
    
    await connectToDatabase();
    
    const body = await req.json();
    const validation = rateNoteSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.errors }, { status: 400 });
    }

    const { rating, review } = validation.data;
    const noteId = params.id;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return NextResponse.json({ message: 'Invalid note ID' }, { status: 400 });
    }

    const note = await Note.findById(noteId);
    if (!note) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    }

    // Use findOneAndUpdate with upsert to create or update the rating
    await Rating.findOneAndUpdate(
      { note: noteId, user: userId },
      { rating, review },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    
    // Recalculate the average rating
    const stats = await Rating.aggregate([
      { $match: { note: new mongoose.Types.ObjectId(noteId) } },
      { $group: { _id: '$note', avgRating: { $avg: '$rating' } } }
    ]);
    
    const newAverageRating = stats.length > 0 ? stats[0].avgRating : 0;
    
    note.rating = newAverageRating;
    await note.save();

    return NextResponse.json({
      message: 'Rating submitted successfully',
      newAverageRating,
    }, { status: 200 });

  } catch (error) {
    console.error('Rate Note Error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
