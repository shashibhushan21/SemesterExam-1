
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured on the server.');
    }

    const userPayload = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      avatar: user.avatar || null,
      phone: user.phone || null,
      college: user.college || null,
      branch: user.branch || null,
      semester: user.semester || null,
      role: user.role || 'user',
    };
    
    const token = jwt.sign(userPayload, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });
    
    const response = NextResponse.json({
        message: 'Login successful',
        user: userPayload,
    }, { status: 200 });

    response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });
    
    // Send login confirmation email
    if (resend && fromEmail) {
        try {
            await resend.emails.send({
                from: fromEmail,
                to: user.email,
                subject: 'Successful Login to ExamNotes',
                html: `<p>Hi ${user.name},</p><p>This is a confirmation that you have successfully logged into your ExamNotes account.</p><p>If you did not initiate this login, please change your password immediately.</p><p>The ExamNotes Team</p>`,
            });
            console.log('✅ Login confirmation email sent to:', user.email);
        } catch (emailError) {
            console.error('❌ Login confirmation email failed:', JSON.stringify(emailError, null, 2));
            // Do not block login if email fails, just log it.
        }
    } else {
        console.warn('⚠️ Resend is not configured. Skipping login confirmation email.');
    }

    return response;

  } catch (error: any) {
    console.error('[LOGIN] CATCH BLOCK: Internal Server Error:', error.message || error, error.stack);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
