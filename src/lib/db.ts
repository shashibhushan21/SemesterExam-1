import mongoose from 'mongoose';

// Ensure the MongoDB URI is defined
const MONGODB_URI = process.env.MONGO_URI;
if (!MONGODB_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    // console.log('✅ Using cached database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    // console.log('⚪️ Creating new database connection promise');
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      // console.log('✅ New database connection established');
      return mongoose;
    }).catch(err => {
        console.error('❌ Mongoose connection error:', err);
        cached.promise = null; // Reset promise on error
        throw err;
    });
  }
  
  try {
    // console.log('⏳ Awaiting database connection promise');
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    console.error('❌ Failed to establish database connection:', e);
    throw e;
  }
  
  return cached.conn;
}
