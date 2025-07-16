import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user';

interface DecodedToken {
  id: string;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    
    await connectToDatabase();
    const user = await User.findById(decoded.id).lean();

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Ensure _id is a string and handle optional fields
    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar || null,
      phone: user.phone || null,
      college: user.college || null,
      branch: user.branch || null,
      semester: user.semester || null,
    };
    
    return NextResponse.json({ user: userResponse }, { status: 200 });

  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}
