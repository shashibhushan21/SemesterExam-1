
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IBranch extends Document {
  name: string;
}

const BranchSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });

const Branch: Model<IBranch> = models.Branch || mongoose.model<IBranch>('Branch', BranchSchema);

export default Branch;
