
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

const uploadToCloudinary = (file: File): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        const fileBuffer = await file.arrayBuffer();
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'examnotes_notes',
                resource_type: 'auto', // Use 'auto' to let Cloudinary detect it's a PDF and enable page transformations
                pages: true,           // Critical for generating thumbnails from pages
                access_mode: 'public',
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    return reject(error);
                }
                resolve(result);
            }
        );

        const readableStream = new Readable();
        readableStream.push(Buffer.from(fileBuffer));
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
        
        const uploadResult = await uploadToCloudinary(file);
        
        // ** THE FIX **
        // The upload result for a PDF with `resource_type: 'auto'` gives an 'image' url.
        // We need to manually construct the 'raw' url for the PDF viewer.
        const pdfUrl = uploadResult.secure_url.replace('/image/upload/', '/raw/upload/');
        
        // Create a separate URL for the thumbnail image transformation
        const thumbnailUrl = cloudinary.url(uploadResult.public_id, {
            resource_type: 'image', // The thumbnail is an image
            page: 1,
            format: 'jpg',
            quality: 'auto',
            fetch_format: 'auto',
        });
        
        const newNote = new Note({
            title,
            university,
            subject,
            semester,
            branch,
            pdfUrl, // The correct RAW url for the viewer
            thumbnailUrl, // The correct IMAGE url for the thumbnail
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
