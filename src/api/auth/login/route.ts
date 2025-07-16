'use server';

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL;

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('[LOGIN] User not found for email:', email);
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    
    if (!user.password) {
      console.log('[LOGIN] User found, but password not stored in DB for user:', user._id);
      return NextResponse.json({ message: 'Invalid credentials - no password' }, { status: 401 });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      console.log('[LOGIN] Password comparison failed for user:', user._id);
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      console.error('[LOGIN] JWT_SECRET is not defined in .env file');
      throw new Error('JWT_SECRET is not configured on the server.');
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
    
    // Send login notification email
    if (fromEmail) {
        try {
            await resend.emails.send({
                from: fromEmail,
                to: user.email,
                subject: 'Successful Login to ExamNotes',
                html: `<p>Hi ${user.name},</p><p>We detected a new login to your ExamNotes account. If this was you, you can safely ignore this email.</p><p>If you did not initiate this login, please change your password immediately.</p><p>The ExamNotes Team</p>`,
            });
        } catch (emailError) {
            console.error('Login notification email sending error:', emailError);
             // Do not block login if email fails, just log the error.
        }
    } else {
        console.warn('RESEND_FROM_EMAIL is not configured. Skipping login notification email.');
    }

    return response;

  } catch (error: any) {
    console.error('[LOGIN] CATCH BLOCK: Internal Server Error:', error.message || error, error.stack);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
