
'use server';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user';
import bcryptjs from 'bcryptjs';
import { z } from 'zod';
import { Resend } from 'resend';

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
      return NextResponse.json(
        { message: 'Invalid input', errors: validation.error.errors },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Send welcome email
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    // Debugging: Check if environment variables are loaded
    console.log('📦 RESEND_API_KEY loaded:', !!resendApiKey);
    console.log('📦 RESEND_FROM_EMAIL loaded:', fromEmail);

    if (resendApiKey && fromEmail) {
      try {
        const resend = new Resend(resendApiKey);
        const result = await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: 'Welcome to ExamNotes!',
          html: `
            <p>Hi ${name},</p>
            <p>Thanks for signing up for <strong>ExamNotes</strong> 🎓</p>
            <p>You can now access short notes, previews, and more!</p>
            <p>Good luck in your studies!</p>
            <p>– The ExamNotes Team</p>
          `,
        });
        console.log('EMAIL RESULT:', result);
        console.log('✅ Welcome email sent to', email);
      } catch (emailErr) {
        // Log the email error but don't fail the entire request
        // The user has been successfully created.
        console.error('❌ Failed to send welcome email:', JSON.stringify(emailErr, null, 2));
      }
    } else {
      console.warn('❗ RESEND API Key or FROM email not configured. Skipping welcome email.');
    }

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });

  } catch (error) {
    console.error('❌ Signup error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
