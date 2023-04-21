import mongoose, { model } from 'mongoose';
import { User } from './types';

export const UserSchema = new mongoose.Schema<User>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    imageUrl: { type: String, required: true },
    topArtists: [{ name: { type: String, required: true }, popularity: { type: Number, required: true } }],
    savedArtists: [{ name: { type: String, required: true }, popularity: { type: Number, required: true } }],
    events: [{ name: { type: String, required: true }, url: { type: String, required: true }, going: { type: Boolean, required: true } }],
    accessToken: { type: String, required: true },
  });
export const UserModel =  model<User>('User', UserSchema);