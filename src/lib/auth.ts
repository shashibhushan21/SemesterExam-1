
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from './db';
import User from '@/models/user';

interface DecodedToken {
  id: string;
}

export async function checkAdmin(req: NextRequest): Promise<boolean> {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return false;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    
    await connectToDatabase();
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'admin') {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}
