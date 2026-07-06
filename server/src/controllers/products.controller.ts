import { Request, Response } from 'express';
import { Shop } from '../models/Shop';
import { sendSuccess } from '../utils/apiResponse';
import { normalizeShopItem, ShopDocument } from '../utils/shopMapper';
import { AppError } from '../middleware/errorHandler';

export async function listProducts(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
  const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || '12'), 10)));
  const search = String(req.query.search || '').trim();
  const category = String(req.query.category || '').trim();

  const filter: Record<string, unknown> = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { title: { $regex: search, $options: 'i' } },
      { productName: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) {
    filter.category = { $regex: category, $options: 'i' };
  }

  const [docs, total] = await Promise.all([
    Shop.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Shop.countDocuments(filter),
  ]);

  const products = docs
    .map((doc) => normalizeShopItem(doc as ShopDocument))
    .filter((p) => p.isActive);

  sendSuccess(res, products, 200, undefined, {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit) || 1,
  });
}

export async function getProductById(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id);

  let doc = null;
  if (/^[0-9a-fA-F]{24}$/.test(id)) {
    doc = await Shop.findById(id).lean();
  }

  if (!doc) {
    const all = await Shop.find().lean();
    const match = all.find((item) => {
      const normalized = normalizeShopItem(item as ShopDocument);
      return normalized.slug === id;
    });
    doc = match || null;
  }

  if (!doc) {
    throw new AppError(404, 'NOT_FOUND', 'Product not found');
  }

  sendSuccess(res, normalizeShopItem(doc as ShopDocument));
}