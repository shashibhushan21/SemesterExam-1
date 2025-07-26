
import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface ITheme extends Document {
  primary: string;
  background: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
}

const ThemeSchema: Schema = new Schema({
  primary: { type: String, default: "262 84% 59%" },
  background: { type: String, default: "222 84% 4%" },
  card: { type: String, default: "222 84% 4.9%" },
  cardForeground: { type: String, default: "210 40% 98%" },
  popover: { type: String, default: "222 84% 4.9%" },
  popoverForeground: { type: String, default: "210 40% 98%" },
  secondary: { type: String, default: "217 33% 17%" },
  secondaryForeground: { type: String, default: "210 40% 98%" },
  muted: { type: String, default: "217 33% 17%" },
  mutedForeground: { type: String, default: "215 20% 65%" },
  accent: { type: String, default: "217 33% 17%" },
  accentForeground: { type: String, default: "210 40% 98%" },
  destructive: { type: String, default: "0 63% 31%" },
  destructiveForeground: { type: String, default: "210 40% 98%" },
  border: { type: String, default: "217 33% 17%" },
  input: { type: String, default: "217 33% 17%" },
  ring: { type: String, default: "262 84% 59%" },
}, { timestamps: true });

const Theme: Model<ITheme> = models.Theme || mongoose.model<ITheme>('Theme', ThemeSchema);

export default Theme;
