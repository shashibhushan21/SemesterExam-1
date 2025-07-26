
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Branch from '@/models/branch';
import { checkAdmin } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        
        await connectToDatabase();
        const body = await req.json();
        
        const updatedBranch = await Branch.findByIdAndUpdate(params.id, body, { new: true });
        if (!updatedBranch) {
            return NextResponse.json({ message: 'Branch not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Branch updated', branch: updatedBranch }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        
        await connectToDatabase();
        
        const deletedBranch = await Branch.findByIdAndDelete(params.id);
        if (!deletedBranch) {
            return NextResponse.json({ message: 'Branch not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Branch deleted' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
