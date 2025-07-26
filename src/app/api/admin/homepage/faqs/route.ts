
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Faq from '@/models/faq';
import { checkAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const faqs = await Faq.find({}).sort({ createdAt: 1 });
        return NextResponse.json({ faqs }, { status: 200 });
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
        
        const newFaq = new Faq(body);
        await newFaq.save();

        return NextResponse.json({ message: 'FAQ created', faq: newFaq }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
