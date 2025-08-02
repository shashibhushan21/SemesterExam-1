
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Report from '@/models/report';
import Note from '@/models/note';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '@/models/user';

interface DecodedToken {
  id: string;
}

const reportNoteSchema = z.object({
  reason: z.string().min(10, 'Reason must be at least 10 characters long.').max(500, 'Reason must be less than 500 characters.'),
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
       return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    
    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    const body = await req.json();
    const validation = reportNoteSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.errors }, { status: 400 });
    }

    const { reason } = validation.data;
    const noteId = params.id;

    if (!mongoose.Types.ObjectId.isValid(noteId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid ID format' }, { status: 400 });
    }

    const note = await Note.findById(noteId);
    if (!note) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    }

    const existingReport = await Report.findOne({ note: noteId, user: userId });
    if (existingReport) {
      return NextResponse.json({ message: 'You have already reported this note.' }, { status: 409 });
    }

    const newReport = new Report({
        note: noteId,
        user: userId,
        reason,
    });
    
    await newReport.save();

    return NextResponse.json({ message: 'Report submitted successfully' }, { status: 201 });

  } catch (error) {
    console.error('Report Note Error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
