'use server';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('+password').lean();

    if (!user || !user.password) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const tokenPayload: { [key: string]: any } = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };
    
    if (user.avatar) tokenPayload.avatar = user.avatar;
    if (user.phone) tokenPayload.phone = user.phone;
    if (user.college) tokenPayload.college = user.college;
    if (user.branch) tokenPayload.branch = user.branch;
    if (user.semester) tokenPayload.semester = user.semester;

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });
    
    const userResponse = { 
        id: user._id.toString(),
        email: user.email, 
        name: user.name,
        avatar: user.avatar || null,
        phone: user.phone || null,
        college: user.college || null,
        branch: user.branch || null,
        semester: user.semester || null,
    };

    const response = NextResponse.json({
        message: 'Login successful',
        user: userResponse,
    }, { status: 200 });

    response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
