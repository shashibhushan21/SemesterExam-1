
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IFaq extends Document {
  question: string;
  answer: string;
}

const FaqSchema: Schema = new Schema({
  question: { type: String, required: true, unique: true },
  answer: { type: String, required: true },
}, { timestamps: true });

const Faq: Model<IFaq> = models.Faq || mongoose.model<IFaq>('Faq', FaqSchema);

export default Faq;
