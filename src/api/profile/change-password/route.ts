
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(6, 'New password must be at least 6 characters')
    .regex(/[@#$!%*?&]/, { message: 'Password must contain at least one special character' }),
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
    const validation = changePasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.errors }, { status: 400 });
    }

    const { currentPassword, newPassword } = validation.data;
    
    const user = await User.findById(userId).select('+password');
    if (!user || !user.password) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isPasswordCorrect = await bcryptjs.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: 'Incorrect current password' }, { status: 400 });
    }
    
    const hashedNewPassword = await bcryptjs.hash(newPassword, 12);
    user.password = hashedNewPassword;
    await user.save();

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });

  } catch (error) {
    console.error('Change Password Error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
