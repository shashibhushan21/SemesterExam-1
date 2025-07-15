import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
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

    const resetUrl = `${req.nextUrl.origin}/reset-password/${resetToken}`;

    // In a real app, you would send an email here.
    // For this demo, we'll log it to the console.
    console.log('Password Reset URL:', resetUrl);

    // Example of how you would use nodemailer:
    /*
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const mailOptions = {
      from: 'no-reply@semesterexam.com',
      to: user.email,
      subject: 'Password Reset Request',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    */

    return NextResponse.json({ message: 'If a user with that email exists, a password reset link has been sent.' }, { status: 200 });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
