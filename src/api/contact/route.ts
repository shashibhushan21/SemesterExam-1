
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
  // Step 1: Check for all required environment variables at the beginning.
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const adminEmail = "semesterexaminfo@gmail.com"; 

  if (!process.env.MONGO_URI) {
     console.error('❌ MONGO_URI is not defined in .env');
     return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  }

  try {
    // Step 2: Parse and validate the incoming request body.
    const body = await req.json();
    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      console.log('❌ Invalid input:', validation.error.errors);
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.errors }, { status: 400 });
    }
    const { name, email, subject, message } = validation.data;

    // Step 3: Connect to the database.
    await connectToDatabase();
    
    // Step 4: Save the contact message to the database (Primary Goal).
    const newContactMessage = new Contact({ name, email, subject, message });
    await newContactMessage.save();
    console.log(`✅ Contact message saved to DB for: ${email}`);

    // Step 5: Attempt to send an email notification (Secondary Goal).
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
        // Log the email error but don't crash the request since the data is already saved.
        console.error('❌ Failed to send contact notification email:', JSON.stringify(emailError, null, 2));
      }
    } else {
        console.warn('❗ RESEND_API_KEY or RESEND_FROM_EMAIL not configured. Skipping email notification.');
    }

    // Always return a success response if the database save was successful.
    return NextResponse.json({ message: 'Message received successfully!' }, { status: 201 });

  } catch (error) {
    console.error('❌ Unhandled error in /api/contact:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
