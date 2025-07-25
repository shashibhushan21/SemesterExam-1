
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

interface DecodedToken {
  id: string;
  role: string;
}

const updateUserSchema = z.object({
  role: z.enum(['user', 'admin']).optional(),
  status: z.enum(['active', 'blocked']).optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().optional(),
  college: z.string().optional(),
  branch: z.string().optional(),
  semester: z.string().optional(),
}).strict(); // Ensure no extra properties are passed

// GET a specific user's details (Admin only)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        if (decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
        }

        await connectToDatabase();
        
        const user = await User.findById(params.id).select('-password');
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        console.error('GET /api/admin/users/[id] Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}


// UPDATE a user's role or status (Admin only)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        if (decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
        }

        const body = await req.json();
        const validation = updateUserSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ message: 'Invalid input', errors: validation.error.errors }, { status: 400 });
        }

        await connectToDatabase();
        
        const userIdToUpdate = params.id;
        const updatedUser = await User.findByIdAndUpdate(userIdToUpdate, validation.data, { new: true });

        if (!updatedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User updated successfully', user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error('PATCH /api/admin/users/[id] Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}


// DELETE a user (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        if (decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
        }

        await connectToDatabase();
        
        const userIdToDelete = params.id;
        
        // Prevent admin from deleting themselves
        if (userIdToDelete === decoded.id) {
            return NextResponse.json({ message: 'Cannot delete your own admin account.' }, { status: 400 });
        }

        const deletedUser = await User.findByIdAndDelete(userIdToDelete);

        if (!deletedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Optional: Also delete user's notes or other associated data
        // await Note.deleteMany({ author: userIdToDelete });

        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('DELETE /api/admin/users/[id] Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
