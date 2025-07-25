
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  avatar?: string;
  phone?: string;
  college?: string;
  branch?: string;
  semester?: string;
  role: 'user' | 'admin';
  status: 'active' | 'blocked';
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  avatar: { type: String },
  phone: { type: String },
  college: { type: String },
  branch: { type: String },
  semester: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
}, { timestamps: true });

const User: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
