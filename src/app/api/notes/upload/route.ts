
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { connectToDatabase } from '@/lib/db';
import Note from '@/models/note';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import mongoose from 'mongoose';
import { Readable } from 'stream';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const uploadNoteSchema = z.object({
  title: z.string().min(5),
  university: z.string().min(3),
  subject: z.string().min(3),
  semester: z.string().min(1),
  branch: z.string().min(1),
  noteContent: z.string().optional(),
});

interface DecodedToken {
  id: string;
  role: string;
}

const uploadToCloudinary = (fileBuffer: Buffer, options: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    return reject(error);
                }
                resolve(result);
            }
        );

        const readableStream = new Readable();
        readableStream.push(fileBuffer);
        readableStream.push(null);
        readableStream.pipe(stream);
    });
};


export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        const userId = decoded.id;
        
        if (decoded.role !== 'admin') {
             return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ message: "No file uploaded." }, { status: 400 });
        }

        const validation = uploadNoteSchema.safeParse({
            title: formData.get('title'),
            university: formData.get('university'),
            subject: formData.get('subject'),
            semester: formData.get('semester'),
            branch: formData.get('branch'),
            noteContent: formData.get('noteContent'),
        });
        
        if (!validation.success) {
            return NextResponse.json({ message: 'Invalid input', errors: validation.error.errors }, { status: 400 });
        }

        const { title, university, subject, semester, branch, noteContent } = validation.data;
        
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // 1. Upload as 'raw' for the PDF viewer URL
        const rawUploadResult = await uploadToCloudinary(fileBuffer, {
            folder: 'examnotes_notes_raw',
            resource_type: 'raw',
            public_id: `${title.replace(/\s+/g, "-").toLowerCase()}.pdf`,
            type: 'upload',
        });
        if (!rawUploadResult || !rawUploadResult.secure_url) {
            throw new Error('Cloudinary raw upload failed.');
        }
        const pdfUrl = rawUploadResult.secure_url.split('?')[0];

        // 2. Upload as 'auto' for thumbnail generation
        const autoUploadResult = await uploadToCloudinary(fileBuffer, {
            folder: 'examnotes_notes_auto',
            resource_type: 'auto',
            type: 'upload',
        });
        if (!autoUploadResult || !autoUploadResult.public_id) {
            throw new Error('Cloudinary auto upload for thumbnailing failed.');
        }
        
        // Generate thumbnail from the 'auto' upload's public_id
        const thumbnailUrl = cloudinary.url(autoUploadResult.public_id, {
            resource_type: 'image',
            page: 1,
            format: 'jpg',
            width: 400,
            height: 200,
            crop: 'fill',
        });
        
        const newNote = new Note({
            title,
            university,
            subject,
            semester,
            branch,
            pdfUrl, // From raw upload
            thumbnailUrl, // From auto upload
            author: new mongoose.Types.ObjectId(userId),
            summary: noteContent || 'No summary provided.',
            content: noteContent || '',
            rating: 0,
        });

        await newNote.save();

        return NextResponse.json({
            message: 'Note uploaded successfully!',
            note: newNote,
        }, { status: 201 });

    } catch (error) {
        console.error('Upload Note Error:', error);
        if (error instanceof jwt.JsonWebTokenError) {
          return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
