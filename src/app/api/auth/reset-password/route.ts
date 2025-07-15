import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(6)
    .regex(/[@#$!%*?&]/, { message: 'Password must contain at least one special character' }),
  token: z.string().min(1, 'Token is required'),
});

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const validation = resetPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.errors }, { status: 400 });
    }

    const { password, token } = validation.data;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ message: 'Password reset token is invalid or has expired.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json({ message: 'Password has been reset successfully.' }, { status: 200 });

  } catch (error) {
    console.error('Reset Password Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
