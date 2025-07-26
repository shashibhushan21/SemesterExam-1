
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface ISubject extends Document {
  name: string;
}

const SubjectSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });

const Subject: Model<ISubject> = models.Subject || mongoose.model<ISubject>('Subject', SubjectSchema);

export default Subject;
