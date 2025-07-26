
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Theme from '@/models/theme';
import { checkAdmin } from '@/lib/auth';

// GET current theme settings
export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        let theme = await Theme.findOne();
        if (!theme) {
            theme = new Theme();
            await theme.save();
        }
        return NextResponse.json({ theme }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// UPDATE theme settings (Admin only)
export async function POST(req: NextRequest) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        
        await connectToDatabase();
        const body = await req.json();
        
        let theme = await Theme.findOne();
        if (!theme) {
            theme = new Theme(body);
        } else {
            theme.set(body);
        }
        
        await theme.save();

        return NextResponse.json({ message: 'Theme updated successfully', theme }, { status: 200 });
    } catch (error) {
        console.error("Theme Update Error:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
