
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Testimonial from '@/models/testimonial';
import { checkAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const testimonials = await Testimonial.find({}).sort({ createdAt: 1 });
        return NextResponse.json({ testimonials }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        
        await connectToDatabase();
        const body = await req.json();
        
        const newTestimonial = new Testimonial(body);
        await newTestimonial.save();

        return NextResponse.json({ message: 'Testimonial created', testimonial: newTestimonial }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
