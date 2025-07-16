import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const updateDetailsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  college: z.string().optional(),
  branch: z.string().optional(),
  semester: z.string().optional(),
  avatar: z.string().url('Invalid URL').optional(),
});

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const userId = decoded.id;
    
    const body = await req.json();
    const validation = updateDetailsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.errors }, { status: 400 });
    }
    
    const updatedUser = await User.findByIdAndUpdate(userId, validation.data, { new: true });

    if (!updatedUser) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const newTokenPayload: { [key: string]: any } = {
      id: updatedUser._id.toString(),
      email: updatedUser.email,
      name: updatedUser.name,
    };

    if (updatedUser.avatar) newTokenPayload.avatar = updatedUser.avatar;
    if (updatedUser.phone) newTokenPayload.phone = updatedUser.phone;
    if (updatedUser.college) newTokenPayload.college = updatedUser.college;
    if (updatedUser.branch) newTokenPayload.branch = updatedUser.branch;
    if (updatedUser.semester) newTokenPayload.semester = updatedUser.semester;

    const newToken = jwt.sign(newTokenPayload, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    const userResponse = { 
      id: updatedUser._id.toString(), 
      email: updatedUser.email, 
      name: updatedUser.name, 
      phone: updatedUser.phone || null,
      college: updatedUser.college || null,
      branch: updatedUser.branch || null,
      semester: updatedUser.semester || null,
      avatar: updatedUser.avatar || null
    };

    const response = NextResponse.json({
        message: 'Profile updated successfully',
        user: userResponse,
    }, { status: 200 });

    response.cookies.set('token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });

    return response;
    
  } catch (error) {
    console.error('Update Profile Error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
