
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user';
import Note from '@/models/note';
import { checkAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();

        const totalUsers = await User.countDocuments();
        const totalNotes = await Note.countDocuments();
        
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const newUsersThisMonth = await User.countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        return NextResponse.json({
            totalUsers,
            totalNotes,
            newUsersThisMonth
        }, { status: 200 });

    } catch (error) {
        console.error('Admin Stats Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
