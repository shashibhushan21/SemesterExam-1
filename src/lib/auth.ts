
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: string;
  role: string;
}

export async function checkAdmin(req: NextRequest): Promise<boolean> {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return false;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    return decoded.role === 'admin';
  } catch (error) {
    return false;
  }
}
