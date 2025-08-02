
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Report from '@/models/report';
import { checkAdmin } from '@/lib/auth';
import { z } from 'zod';

const updateReportSchema = z.object({
  status: z.enum(['pending', 'resolved']),
});

// UPDATE a specific report's status (Admin only)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const validation = updateReportSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ message: 'Invalid input', errors: validation.error.errors }, { status: 400 });
        }

        await connectToDatabase();
        
        const updatedReport = await Report.findByIdAndUpdate(params.id, validation.data, { new: true });

        if (!updatedReport) {
            return NextResponse.json({ message: 'Report not found' }, { status: 404 });
        }
        
        return NextResponse.json({ message: 'Report updated successfully', report: updatedReport }, { status: 200 });
    } catch (error) {
        console.error('PATCH /api/admin/reports/[id] Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}


// DELETE a specific report by ID (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();
        
        const deletedReport = await Report.findByIdAndDelete(params.id);

        if (!deletedReport) {
            return NextResponse.json({ message: 'Report not found' }, { status: 404 });
        }
        
        return NextResponse.json({ message: 'Report deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('DELETE /api/admin/reports/[id] Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
