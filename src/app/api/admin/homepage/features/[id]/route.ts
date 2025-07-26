
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Feature from '@/models/feature';
import { checkAdmin } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        
        await connectToDatabase();
        const body = await req.json();
        
        const updatedFeature = await Feature.findByIdAndUpdate(params.id, body, { new: true });
        if (!updatedFeature) {
            return NextResponse.json({ message: 'Feature not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Feature updated', feature: updatedFeature }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        
        await connectToDatabase();
        
        const deletedFeature = await Feature.findByIdAndDelete(params.id);
        if (!deletedFeature) {
            return NextResponse.json({ message: 'Feature not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Feature deleted' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
