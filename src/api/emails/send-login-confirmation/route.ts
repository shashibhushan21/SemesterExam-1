
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const emailSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!resendApiKey || !fromEmail) {
    console.warn('⚠️ Resend is not configured. Skipping login confirmation email.');
    // Return a success response so we don't show an error to the user
    return NextResponse.json({ message: 'Email service not configured, skipped.' }, { status: 200 });
  }

  try {
    const body = await req.json();
    const validation = emailSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.errors }, { status: 400 });
    }

    const { name, email } = validation.data;

    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Successful Login to ExamNotes',
      html: `<p>Hi ${name},</p><p>This is a confirmation that you have successfully logged into your ExamNotes account just now.</p><p>If you did not initiate this login, please change your password immediately.</p><p>The ExamNotes Team</p>`,
    });

    console.log('✅ Login confirmation email sent to:', email);
    return NextResponse.json({ message: 'Confirmation email sent successfully.' }, { status: 200 });

  } catch (error) {
    console.error('❌ Login confirmation email failed:', JSON.stringify(error, null, 2));
    // Return a success response even on failure to avoid blocking user flow
    return NextResponse.json({ message: 'Failed to send confirmation email.' }, { status: 500 });
  }
}
