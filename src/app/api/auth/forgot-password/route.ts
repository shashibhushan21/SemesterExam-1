import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user';
import crypto from 'crypto';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: NextRequest) {
  if (!fromEmail) {
    console.error('RESEND_FROM_EMAIL is not set in the environment variables.');
    return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
  }

  if (!baseUrl) {
    console.error('NEXT_PUBLIC_BASE_URL is not set in the environment variables.');
    return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
  }
  
  try {
    await connectToDatabase();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      // Respond kindly to prevent user enumeration
      return NextResponse.json({ message: 'If a user with that email exists, a password reset link has been sent.' }, { status: 200 });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour

    user.resetPasswordToken = passwordResetToken;
    user.resetPasswordExpires = passwordResetExpires;
    await user.save();

    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

    try {
      await resend.emails.send({
        from: fromEmail,
        to: user.email,
        subject: 'Password Reset Request',
        html: `<p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
               <p>Please click on the following link, or paste this into your browser to complete the process:</p>
               <a href="${resetUrl}">${resetUrl}</a>
               <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Even if email fails, don't reveal that the user exists.
      // But for debugging, we might want to know this failed.
      return NextResponse.json({ message: 'Error sending password reset email.' }, { status: 500 });
    }


    return NextResponse.json({ message: 'If a user with that email exists, a password reset link has been sent.' }, { status: 200 });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
