
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Faq from '@/models/faq';
import { checkAdmin } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        
        await connectToDatabase();
        const body = await req.json();
        
        const updatedFaq = await Faq.findByIdAndUpdate(params.id, body, { new: true });
        if (!updatedFaq) {
            return NextResponse.json({ message: 'FAQ not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'FAQ updated', faq: updatedFaq }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        
        await connectToDatabase();
        
        const deletedFaq = await Faq.findByIdAndDelete(params.id);
        if (!deletedFaq) {
            return NextResponse.json({ message: 'FAQ not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'FAQ deleted' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
