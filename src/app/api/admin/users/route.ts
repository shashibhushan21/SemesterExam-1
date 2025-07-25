
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: string;
  role: string;
}

// GET all users (Admin only)
export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        if (decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
        }

        await connectToDatabase();
        
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });

        return NextResponse.json({ users }, { status: 200 });

    } catch (error) {
        console.error('GET /api/admin/users Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
