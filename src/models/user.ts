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
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  avatar: { type: String },
  phone: { type: String },
  college: { type: String },
  branch: { type: String },
  semester: { type: String },
}, { timestamps: true });

// Pre-save hook to ensure password is not returned by default in find queries
UserSchema.pre(/^find/, function(next) {
  // `this` refers to the query
  if ((this as any).options.select && (this as any).options.select.includes('+password')) {
    return next();
  }
  (this as any).select('-password');
  next();
});

const User: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
