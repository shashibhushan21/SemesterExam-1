
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ContactDetails from '@/models/contact-details';
import { checkAdmin } from '@/lib/auth';

const defaultContactDetails = {
    email: "info@semesterexam.com",
    phone: "+91 98765 43210",
    address: "4th Floor, Tech Tower, Sector V, Salt Lake, Kolkata, WB 700091"
};

// GET current contact page settings, or create if it doesn't exist
export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        let contactDetails = await ContactDetails.findOne();

        if (!contactDetails) {
            // If no document exists, create one with the default content
            contactDetails = new ContactDetails(defaultContactDetails);
            await contactDetails.save();
        }

        return NextResponse.json({ contactDetails }, { status: 200 });
    } catch (error) {
        console.error("Error fetching contact settings:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// UPDATE contact page settings (Admin only)
export async function POST(req: NextRequest) {
    try {
        const isAdmin = await checkAdmin(req);
        if (!isAdmin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        
        await connectToDatabase();
        const body = await req.json();
        
        const updatedContactDetails = await ContactDetails.findOneAndUpdate({}, body, { new: true, upsert: true });

        return NextResponse.json({ message: 'Contact details updated successfully', contactDetails: updatedContactDetails }, { status: 200 });
    } catch (error) {
        console.error("Contact Page Update Error:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
