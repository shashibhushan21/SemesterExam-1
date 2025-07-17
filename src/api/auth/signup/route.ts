'use server';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user';
import bcryptjs from 'bcryptjs';
import { z } from 'zod';
import { Resend } from 'resend';

// Schema validation using zod
const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string()
    .min(6)
    .regex(/[@#$!%*?&]/, { message: 'Password must contain at least one special character' }),
});

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL;

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    const body = await req.json();
    const validation = signupSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validation.error.errors },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Create and save user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Send welcome email
    if (resend && fromEmail) {
      try {
        const result = await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: 'Welcome to ExamNotes!',
          html: `
            <p>Hi ${name},</p>
            <p>Thank you for signing up for <strong>ExamNotes</strong>. We're excited to have you!</p>
            <p>Good luck with your studies!</p>
            <p>– The ExamNotes Team</p>
          `,
        });

        console.log('✅ Email sent:', JSON.stringify(result, null, 2));
      } catch (emailError) {
        console.error('❌ Email sending failed:', JSON.stringify(emailError, null, 2));
      }
    } else {
      console.warn('⚠️ Missing RESEND_API_KEY or RESEND_FROM_EMAIL. Email not sent.');
    }

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });

  } catch (error) {
    console.error('❌ Signup error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
