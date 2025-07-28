
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IContactDetails extends Document {
  email: string;
  phone: string;
  address: string;
}

const ContactDetailsSchema: Schema = new Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
}, { timestamps: true });

const ContactDetails: Model<IContactDetails> = models.ContactDetails || mongoose.model<IContactDetails>('ContactDetails', ContactDetailsSchema);

export default ContactDetails;
