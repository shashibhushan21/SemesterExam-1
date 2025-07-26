
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user';
import { checkAdmin } from '@/lib/auth';

// GET all users (Admin only)
export async function GET(req: NextRequest) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();
        
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });

        return NextResponse.json({ users }, { status: 200 });

    } catch (error) {
        console.error('GET /api/admin/users Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
