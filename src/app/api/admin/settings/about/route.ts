
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import About from '@/models/about';
import { checkAdmin } from '@/lib/auth';

const defaultAboutContent = {
    title: "Empowering Students Through Smart Learning",
    description: "At SemesterExam, we provide high-quality academic resources designed to help students across universities succeed with ease and confidence.",
    missionTitle: "Our Mission",
    missionContent: "Our mission is to provide students with a centralized platform to access and share high-quality study materials. We believe in the power of collaborative learning and aim to make education more accessible for everyone, everywhere."
};

// GET current about page settings, or create if it doesn't exist
export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        let about = await About.findOne();

        if (!about) {
            // If no document exists, create one with the default content
            about = new About(defaultAboutContent);
            await about.save();
        }

        return NextResponse.json({ about }, { status: 200 });
    } catch (error) {
        console.error("Error fetching about settings:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// UPDATE about page settings (Admin only)
export async function POST(req: NextRequest) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        
        await connectToDatabase();
        const body = await req.json();
        
        // Use findOneAndUpdate with upsert:true to either update the existing doc or create a new one.
        // This is a robust way to handle the singleton pattern.
        const updatedAbout = await About.findOneAndUpdate({}, body, { new: true, upsert: true });

        return NextResponse.json({ message: 'About page content updated successfully', about: updatedAbout }, { status: 200 });
    } catch (error) {
        console.error("About Page Update Error:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

    