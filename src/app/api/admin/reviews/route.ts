
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Rating from '@/models/rating';
import { checkAdmin } from '@/lib/auth';

// GET all reviews (Admin only)
export async function GET(req: NextRequest) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();
        
        const reviews = await Rating.find({})
            .populate('user', 'name') 
            .populate('note', 'title')
            .sort({ createdAt: -1 });

        return NextResponse.json({ reviews }, { status: 200 });

    } catch (error) {
        console.error('GET /api/admin/reviews Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
