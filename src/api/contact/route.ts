
'use server';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Contact from '@/models/contact';
import { z } from 'zod';
import { Resend } from 'resend';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(10),
});

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.errors }, { status: 400 });
    }

    const { name, email, subject, message } = validation.data;

    // Save to database
    const newContactMessage = new Contact({ name, email, subject, message });
    await newContactMessage.save();

    // Send email notification
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const adminEmail = "semesterexaminfo@gmail.com"; 

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
      } catch (emailError) {
        console.error('Failed to send contact notification email:', emailError);
        // Don't block the user response if email fails, just log it. The main goal (saving to DB) succeeded.
      }
    } else {
        console.warn('Resend API Key or From Email not configured. Skipping email notification.');
    }

    return NextResponse.json({ message: 'Message received successfully!' }, { status: 201 });

  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
