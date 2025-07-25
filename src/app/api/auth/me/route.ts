import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/user';
import { connectToDatabase } from '@/lib/db';

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

    const user = await User.findById(decoded.id).select('-password'); // fetch full user data

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || null,
        phone: user.phone || null,
        college: user.college || null,
        branch: user.branch || null,
        semester: user.semester || null,
        role: user.role || 'user',
      },
    }, { status: 200 });

  } catch (error) {
    console.error('GET /api/auth/me error:', error);
    return NextResponse.json({ message: 'Invalid token or server error' }, { status: 401 });
  }
}
