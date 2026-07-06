export type ShopDocument = Record<string, unknown> & {
  _id: { toString(): string };
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export interface NormalizedProduct {
  _id: string;
  id: string;
  slug: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  images: string[];
  description: string;
  category: string;
  stock: number;
  isActive: boolean;
}

export function normalizeShopItem(doc: ShopDocument): NormalizedProduct {
  const name = String(
    doc.name || doc.title || doc.productName || doc.product_name || 'Unnamed Product'
  );

  const price = Number(doc.price ?? doc.cost ?? doc.amount ?? 0);
  const stock = Number(doc.stock ?? doc.quantity ?? 10);

  const images = doc.images as string[] | undefined;
  const rawImage = String(
    doc.image || doc.img || doc.photo || (Array.isArray(images) && images[0]) || doc.imageUrl || ''
  );

  const image = rawImage.startsWith('http') || rawImage.startsWith('/')
    ? rawImage
    : rawImage
      ? `/images/${rawImage.replace(/^images\//, '')}`
      : '/images/01.jpg';

  const category = String(doc.category || doc.categoryName || 'Furniture');

  const description = String(doc.description || doc.desc || doc.details || '');

  const isActive = doc.isActive !== false && doc.active !== false;

  const slug = doc.slug ? String(doc.slug) : slugify(name) || doc._id.toString();

  return {
    _id: doc._id.toString(),
    id: doc._id.toString(),
    slug,
    name,
    price,
    currency: String(doc.currency || 'INR'),
    image,
    images: Array.isArray(doc.images) ? doc.images : image ? [image] : [],
    description,
    category,
    stock: stock >= 0 ? stock : 10,
    isActive,
  };
}