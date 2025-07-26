
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IFeature extends Document {
  icon: string;
  title: string;
  description: string;
  color: string;
}

const FeatureSchema: Schema = new Schema({
  icon: { type: String, required: true },
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  color: { type: String, required: true },
}, { timestamps: true });

const Feature: Model<IFeature> = models.Feature || mongoose.model<IFeature>('Feature', FeatureSchema);

export default Feature;
