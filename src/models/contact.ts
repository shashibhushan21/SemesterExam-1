
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

const Contact: Model<IContact> = models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;
