
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IRating extends Document {
  note: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
}

const RatingSchema: Schema = new Schema({
  note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

// A user can only rate a note once.
RatingSchema.index({ note: 1, user: 1 }, { unique: true });

const Rating: Model<IRating> = models.Rating || mongoose.model<IRating>('Rating', RatingSchema);

export default Rating;
