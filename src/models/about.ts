
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IAbout extends Document {
  title: string;
  description: string;
  missionTitle: string;
  missionContent: string;
}

const AboutSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  missionTitle: { type: String, required: true },
  missionContent: { type: String, required: true },
}, { timestamps: true });

// This ensures that only one 'about' document can exist.
// It's a "singleton" model.
AboutSchema.index({ /* a unique field if you want one, but we'll enforce singleton at API level */ }, { unique: true });


const About: Model<IAbout> = models.About || mongoose.model<IAbout>('About', AboutSchema);

export default About;

    