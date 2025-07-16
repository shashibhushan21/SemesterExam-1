import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user';
import jwt from 'jsonwebtoken';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        const userId = decoded.id;

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ message: "No file uploaded." }, { status: 400 });
        }
        
        const fileBuffer = await file.arrayBuffer();
        var mime = file.type; 
        var encoding = 'base64'; 
        var base64Data = Buffer.from(fileBuffer).toString('base64');
        var fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;
        
        const result = await cloudinary.uploader.upload(fileUri, {
            folder: "examnotes_avatars",
        });
        
        const user = await User.findByIdAndUpdate(userId, { avatar: result.secure_url }, { new: true });
        
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        
        const newTokenPayload: { [key: string]: any } = {
            id: user._id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
        };

        if (user.phone) newTokenPayload.phone = user.phone;
        if (user.college) newTokenPayload.college = user.college;
        if (user.branch) newTokenPayload.branch = user.branch;
        if (user.semester) newTokenPayload.semester = user.semester;

        const newToken = jwt.sign(newTokenPayload, process.env.JWT_SECRET!, {
            expiresIn: '1d',
        });
        
        const response = NextResponse.json({
            message: 'Avatar updated successfully',
            avatarUrl: result.secure_url,
        }, { status: 200 });

        response.cookies.set('token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Upload Avatar Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
