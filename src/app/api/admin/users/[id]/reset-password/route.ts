
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user';
import crypto from 'crypto';
import { Resend } from 'resend';
import { checkAdmin } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) {
        return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
    }

    // Configuration Check
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!resendApiKey || !fromEmail || !baseUrl) {
      console.error('Server configuration error: Missing email sending variables.');
      return NextResponse.json({ message: 'Server is not configured for sending emails.' }, { status: 500 });
    }
  
    await connectToDatabase();
    const userIdToReset = params.id;
    const user = await User.findById(userIdToReset);

    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
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
        subject: 'Admin Initiated Password Reset',
        html: `<p>An administrator has initiated a password reset for your account.</p>
               <p>Please click on the following link, or paste this into your browser to complete the process within one hour:</p>
               <p><a href="${resetUrl}" target="_blank">Reset Your Password</a></p>
               <p>If you did not request this, please contact our support team immediately.</p>`,
      });
      console.log(`Password reset email sent to: ${user.email}`);
    } catch (emailError) {
      console.error('❌ Failed to send admin-initiated password reset email:', JSON.stringify(emailError, null, 2));
      // Don't leak email sending errors to the client
    }
    
    return NextResponse.json({ message: 'Password reset link sent to the user.' }, { status: 200 });

  } catch (error) {
    console.error('❌ Reset Password API Error:', error);
    return NextResponse.json({ message: 'An internal error occurred.' }, { status: 500 });
  }
}
