
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Subject from '@/models/subject';
import { checkAdmin } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        
        await connectToDatabase();
        const body = await req.json();
        
        const updatedSubject = await Subject.findByIdAndUpdate(params.id, body, { new: true });
        if (!updatedSubject) {
            return NextResponse.json({ message: 'Subject not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Subject updated', subject: updatedSubject }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        
        await connectToDatabase();
        
        const deletedSubject = await Subject.findByIdAndDelete(params.id);
        if (!deletedSubject) {
            return NextResponse.json({ message: 'Subject not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Subject deleted' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
