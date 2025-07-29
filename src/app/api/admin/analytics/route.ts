
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user';
import Note from '@/models/note';
import { checkAdmin } from '@/lib/auth';
import { subDays, format, eachDayOfInterval, parseISO } from 'date-fns';

export async function GET(req: NextRequest) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();

        const endDate = new Date();
        const startDate = subDays(endDate, 29);

        const [
            totalUsers,
            totalNotes,
            avgRatingResult,
            dailyUsers,
            dailyNotes,
            universityDistribution,
            subjectDistribution
        ] = await Promise.all([
            User.countDocuments(),
            Note.countDocuments(),
            Note.aggregate([
                { $group: { _id: null, avgRating: { $avg: '$rating' } } }
            ]),
            User.aggregate([
                { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]),
            Note.aggregate([
                { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]),
            Note.aggregate([
                { $group: { _id: '$university', count: { $sum: 1 } } },
                { $project: { name: '$_id', count: 1, _id: 0 } },
                { $sort: { count: -1 } }
            ]),
            Note.aggregate([
                { $group: { _id: '$subject', count: { $sum: 1 } } },
                { $project: { name: '$_id', count: 1, _id: 0 } },
                { $sort: { count: -1 } }
            ])
        ]);
        
        const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
        const dailyActivity = dateRange.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const userActivity = dailyUsers.find(d => d._id === dateStr);
            const noteActivity = dailyNotes.find(d => d._id === dateStr);
            return {
                date: format(day, 'MMM d'),
                users: userActivity ? userActivity.count : 0,
                notes: noteActivity ? noteActivity.count : 0
            };
        });

        return NextResponse.json({
            totalUsers,
            totalNotes,
            averageRating: avgRatingResult.length > 0 ? avgRatingResult[0].avgRating : 0,
            dailyActivity,
            universityDistribution,
            subjectDistribution
        }, { status: 200 });

    } catch (error) {
        console.error('Admin Analytics Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
