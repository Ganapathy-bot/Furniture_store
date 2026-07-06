import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IWishlist extends Document {
  userId: Types.ObjectId;
  productIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    productIds: [{ type: Schema.Types.ObjectId, ref: 'Shop' }],
  },
  { collection: 'wishlists', timestamps: true }
);

export const Wishlist = mongoose.model<IWishlist>('Wishlist', wishlistSchema);
