
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import University from '@/models/university';
import { checkAdmin } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        
        await connectToDatabase();
        const body = await req.json();
        
        const updatedUniversity = await University.findByIdAndUpdate(params.id, body, { new: true });
        if (!updatedUniversity) {
            return NextResponse.json({ message: 'University not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'University updated', university: updatedUniversity }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        
        await connectToDatabase();
        
        const deletedUniversity = await University.findByIdAndDelete(params.id);
        if (!deletedUniversity) {
            return NextResponse.json({ message: 'University not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'University deleted' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
