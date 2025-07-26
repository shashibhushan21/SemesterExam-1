
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Feature from '@/models/feature';
import { checkAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const features = await Feature.find({}).sort({ createdAt: 1 });
        return NextResponse.json({ features }, { status: 200 });
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
        
        const newFeature = new Feature(body);
        await newFeature.save();

        return NextResponse.json({ message: 'Feature created', feature: newFeature }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
