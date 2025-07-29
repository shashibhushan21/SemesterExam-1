
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Rating from '@/models/rating';
import Note from '@/models/note';
import { checkAdmin } from '@/lib/auth';
import { z } from 'zod';
import mongoose from 'mongoose';

const updateReviewSchema = z.object({
  review: z.string().min(10, 'Review must be at least 10 characters long.'),
  rating: z.number().min(1).max(5),
});

// UPDATE a specific review by ID (Admin only)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const validation = updateReviewSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ message: 'Invalid input', errors: validation.error.errors }, { status: 400 });
        }

        await connectToDatabase();
        
        const reviewId = params.id;
        const updatedReview = await Rating.findByIdAndUpdate(reviewId, validation.data, { new: true });

        if (!updatedReview) {
            return NextResponse.json({ message: 'Review not found' }, { status: 404 });
        }
        
        // Recalculate average rating for the associated note
        const stats = await Rating.aggregate([
            { $match: { note: new mongoose.Types.ObjectId(updatedReview.note) } },
            { $group: { _id: '$note', avgRating: { $avg: '$rating' } } }
        ]);
        
        const newAverageRating = stats.length > 0 ? stats[0].avgRating : 0;
        
        await Note.findByIdAndUpdate(updatedReview.note, { rating: newAverageRating });

        return NextResponse.json({ message: 'Review updated successfully', review: updatedReview }, { status: 200 });
    } catch (error) {
        console.error('PATCH /api/admin/reviews/[id] Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}


// DELETE a specific review by ID (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();
        
        const reviewId = params.id;
        const deletedReview = await Rating.findByIdAndDelete(reviewId);

        if (!deletedReview) {
            return NextResponse.json({ message: 'Review not found' }, { status: 404 });
        }

        // Recalculate average rating for the associated note
        const stats = await Rating.aggregate([
            { $match: { note: new mongoose.Types.ObjectId(deletedReview.note) } },
            { $group: { _id: '$note', avgRating: { $avg: '$rating' } } }
        ]);
        
        const newAverageRating = stats.length > 0 ? stats[0].avgRating : 0;
        
        await Note.findByIdAndUpdate(deletedReview.note, { rating: newAverageRating });
        
        return NextResponse.json({ message: 'Review deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('DELETE /api/admin/reviews/[id] Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
