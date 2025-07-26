
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IUniversity extends Document {
  name: string;
  location: string;
  description: string;
  bannerUrl: string;
}

const UniversitySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  bannerUrl: { type: String, required: true },
}, { timestamps: true });

const University: Model<IUniversity> = models.University || mongoose.model<IUniversity>('University', UniversitySchema);

export default University;
