
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user';
import Note from '@/models/note';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: string;
  role: string;
}

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        if (decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

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
        if (error instanceof jwt.JsonWebTokenError) {
          return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
