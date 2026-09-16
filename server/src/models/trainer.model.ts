import mongoose, { Document, Schema } from 'mongoose';

export interface ITrainer extends Document {
  name: string;
  role: string;
  image: string;
  bio: string;
  experience: number;
  certifications: string[];
  specialties: string[];
  philosophy: string;
  earlyLife?: string;
  careerHighlights?: string[];
}

const trainerSchema = new Schema<ITrainer>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true },
  bio: { type: String, required: true },
  experience: { type: Number, required: true },
  certifications: [{ type: String }],
  specialties: [{ type: String }],
  philosophy: { type: String, required: true },
  earlyLife: { type: String },
  careerHighlights: [{ type: String }]
}, {
  timestamps: true,
  collection: 'trainers'
});

const Trainer = mongoose.model<ITrainer>('Trainer', trainerSchema);
export default Trainer;
