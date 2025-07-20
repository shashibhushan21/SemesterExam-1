
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user';
import crypto from 'crypto';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!resendApiKey || !fromEmail || !baseUrl) {
      console.error('Server configuration error: Missing RESEND_API_KEY, RESEND_FROM_EMAIL, or NEXT_PUBLIC_BASE_URL');
      return NextResponse.json({ message: 'Server is not configured for sending emails.' }, { status: 500 });
    }
  
    await connectToDatabase();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      // To prevent user enumeration, always return a success-like message.
      console.log(`Password reset requested for non-existent user: ${email}`);
      return NextResponse.json({ message: 'If an account with that email exists, a password reset link has been sent.' }, { status: 200 });
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
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: fromEmail,
        to: user.email,
        subject: 'Your Password Reset Request',
        html: `<p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
               <p>Please click on the following link, or paste this into your browser to complete the process within one hour:</p>
               <p><a href="${resetUrl}" target="_blank">Reset Your Password</a></p>
               <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
      });
      console.log(`Password reset email sent to: ${user.email}`);
    } catch (emailError) {
      console.error('❌ Failed to send password reset email:', JSON.stringify(emailError, null, 2));
      // Do not reveal the error to the client to prevent information leaks.
      // The token is saved, so they can try again or contact support.
    }

    return NextResponse.json({ message: 'If an account with that email exists, a password reset link has been sent.' }, { status: 200 });

  } catch (error) {
    console.error('❌ Forgot Password Error:', error);
    return NextResponse.json({ message: 'An internal error occurred.' }, { status: 500 });
  }
}
