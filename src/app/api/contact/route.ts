'use server';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Contact from '@/models/contact';
import { z } from 'zod';
import { Resend } from 'resend';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(req: NextRequest) {
  const adminEmail = "semesterexaminfo@gmail.com"; 

  if (!process.env.MONGO_URI) {
     console.error('❌ MONGO_URI is not defined in .env');
     return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      console.log('❌ Invalid input:', validation.error.errors);
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.errors }, { status: 400 });
    }
    const { name, email, subject, message } = validation.data;

    await connectToDatabase();
    
    const newContactMessage = new Contact({ name, email, subject, message });
    await newContactMessage.save();
    console.log(`✅ Contact message saved to DB for: ${email}`);

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    if (resendApiKey && fromEmail) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: fromEmail,
          to: adminEmail,
          subject: `New Contact Form Submission: ${subject}`,
          reply_to: email,
          html: `
            <h1>New Message from SemesterExam.com Contact Form</h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr>
            <h2>Message:</h2>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `,
        });
        console.log(`✅ Contact form email notification sent for: ${email}`);
      } catch (emailError) {
        console.error('❌ Failed to send contact notification email:', JSON.stringify(emailError, null, 2));
      }
    } else {
        console.warn('❗ RESEND_API_KEY or RESEND_FROM_EMAIL not configured. Skipping email notification.');
    }

    return NextResponse.json({ message: 'Message received successfully!' }, { status: 201 });

  } catch (error) {
    console.error('❌ Unhandled error in /api/contact:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
