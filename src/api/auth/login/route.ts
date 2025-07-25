
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

    // Check if the default admin from .env exists, if not, create it on first login attempt
    if (email === process.env.ADMIN_EMAIL) {
      const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
      if (!adminExists && password === process.env.ADMIN_PASSWORD) {
        const hashedPassword = await bcryptjs.hash(process.env.ADMIN_PASSWORD, 12);
        const newAdmin = new User({
          name: 'Admin',
          email: process.env.ADMIN_EMAIL,
          password: hashedPassword,
          role: 'admin',
        });
        await newAdmin.save();
        console.log('Default admin user created from .env credentials.');
      }
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

    return response;

  } catch (error: any) {
    console.error('[LOGIN] CATCH BLOCK: Internal Server Error:', error.message || error, error.stack);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
