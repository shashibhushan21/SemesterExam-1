
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface ITestimonial extends Document {
  quote: string;
  author: string;
}

const TestimonialSchema: Schema = new Schema({
  quote: { type: String, required: true },
  author: { type: String, required: true },
}, { timestamps: true });

const Testimonial: Model<ITestimonial> = models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

export default Testimonial;
