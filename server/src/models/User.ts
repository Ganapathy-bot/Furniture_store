import mongoose, { Document, Schema } from 'mongoose';
import { ROLES, Role } from '@furnistore/shared';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
  refreshTokenHash?: string;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    refreshTokenHash: { type: String, select: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  { collection: 'users', timestamps: true }
);

userSchema.index({ role: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
