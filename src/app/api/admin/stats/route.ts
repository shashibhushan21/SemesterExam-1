
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user';
import Note from '@/models/note';
import Rating from '@/models/rating';
import Report from '@/models/report';
import { checkAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();

        const [totalUsers, totalNotes, totalReviews, totalReports] = await Promise.all([
             User.countDocuments(),
             Note.countDocuments(),
             Rating.countDocuments(),
             Report.countDocuments({ status: 'pending' })
        ]);
        

        return NextResponse.json({
            totalUsers,
            totalNotes,
            totalReviews,
            totalReports
        }, { status: 200 });

    } catch (error) {
        console.error('Admin Stats Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
