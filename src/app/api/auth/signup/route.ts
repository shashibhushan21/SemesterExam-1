import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

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

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
