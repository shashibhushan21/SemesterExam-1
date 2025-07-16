'use server';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user';
import bcryptjs from 'bcryptjs';
import { z } from 'zod';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL;

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string()
    .min(6)
    .regex(/[@#$!%*?&]/, { message: 'Password must contain at least one special character' }),
});

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const validation = signupSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.errors }, { status: 400 });
    }

    const { name, email, password } = validation.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    
    // Send welcome email
    if (fromEmail) {
        try {
            await resend.emails.send({
                from: fromEmail,
                to: email,
                subject: 'Welcome to ExamNotes!',
                html: `<p>Hi ${name},</p><p>Thank you for signing up for ExamNotes. We're excited to have you on board!</p><p>Happy studying!</p><p>The ExamNotes Team</p>`,
            });
        } catch (emailError) {
            console.error('Welcome email sending error:', emailError);
            // Do not block signup if email fails, just log the error.
        }
    } else {
        console.error('RESEND_FROM_EMAIL is not configured. Skipping welcome email.');
    }

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
