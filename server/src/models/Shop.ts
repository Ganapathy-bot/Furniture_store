import mongoose, { Document, Schema } from 'mongoose';

/**
 * Maps to the existing Atlas collection: furniture_shop.shop
 * Schema is flexible to support varied document shapes from Data Explorer.
 */
export interface IShop extends Document {
  slug?: string;
  name?: string;
  title?: string;
  productName?: string;
  price?: number;
  cost?: number;
  currency?: string;
  image?: string;
  img?: string;
  images?: string[];
  photo?: string;
  description?: string;
  desc?: string;
  category?: string;
  stock?: number;
  quantity?: number;
  isActive?: boolean;
  active?: boolean;
  [key: string]: unknown;
}

const shopSchema = new Schema<IShop>(
  {
    slug: { type: String, index: true },
    name: String,
    title: String,
    productName: String,
    price: Number,
    cost: Number,
    currency: String,
    image: String,
    img: String,
    images: [String],
    photo: String,
    description: String,
    desc: String,
    category: String,
    stock: Number,
    quantity: Number,
    isActive: Boolean,
    active: Boolean,
  },
  {
    collection: 'shop',
    strict: false,
    timestamps: true,
  }
);

shopSchema.index({ name: 'text', title: 'text', description: 'text' });

export const Shop = mongoose.model<IShop>('Shop', shopSchema);