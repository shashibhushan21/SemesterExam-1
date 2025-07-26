
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Testimonial from '@/models/testimonial';
import { checkAdmin } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        
        await connectToDatabase();
        const body = await req.json();
        
        const updatedTestimonial = await Testimonial.findByIdAndUpdate(params.id, body, { new: true });
        if (!updatedTestimonial) {
            return NextResponse.json({ message: 'Testimonial not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Testimonial updated', testimonial: updatedTestimonial }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        
        await connectToDatabase();
        
        const deletedTestimonial = await Testimonial.findByIdAndDelete(params.id);
        if (!deletedTestimonial) {
            return NextResponse.json({ message: 'Testimonial not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Testimonial deleted' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
