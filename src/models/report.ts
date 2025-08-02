
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IReport extends Document {
  note: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  reason: string;
  status: 'pending' | 'resolved';
}

const ReportSchema: Schema = new Schema({
  note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true, trim: true, minlength: 10, maxlength: 500 },
  status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
}, { timestamps: true });

const Report: Model<IReport> = models.Report || mongoose.model<IReport>('Report', ReportSchema);

export default Report;
