
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Report from '@/models/report';
import { checkAdmin } from '@/lib/auth';

// GET all reports (Admin only)
export async function GET(req: NextRequest) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();
        
        const reports = await Report.find({})
            .populate('user', 'name email') 
            .populate('note', 'title')
            .sort({ status: 1, createdAt: -1 }); // Show pending first

        return NextResponse.json({ reports }, { status: 200 });

    } catch (error) {
        console.error('GET /api/admin/reports Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
