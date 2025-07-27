
import mongoose, { Schema, Document, models, Model } from 'mongoose';
import './user'; // Import to ensure User model is registered before being used in populate

export interface INote extends Document {
  title: string;
  university: string;
  subject: string;
  semester: string;
  summary: string;
  content: string;
  pdfUrl: string;
  thumbnailUrl?: string;
  author: mongoose.Schema.Types.ObjectId;
  rating: number;
  branch: string;
}

const NoteSchema: Schema = new Schema({
  title: { type: String, required: true },
  university: { type: String, required: true },
  subject: { type: String, required: true },
  semester: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String },
  pdfUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: false },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, default: 0 },
  branch: { type: String, required: true },
}, { timestamps: true });

const Note: Model<INote> = models.Note || mongoose.model<INote>('Note', NoteSchema);

export default Note;
