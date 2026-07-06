import { Router, Request, Response } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import { sendSuccess } from '../utils/apiResponse';
import { ORDER_STATUS } from '@furnistore/shared';
import { Shop } from '../models/Shop';
import { User } from '../models/User';
import { Order } from '../models/Order';

const router = Router();

router.get(
  '/dashboard',
  authenticate,
  requireAdmin,
  async (_req: Request, res: Response) => {
    const [totalProducts, totalUsers, totalOrders, paidOrders] = await Promise.all([
      Shop.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),
      Order.find({ status: ORDER_STATUS.PAID }),
    ]);

    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

    sendSuccess(res, {
      message: 'Admin dashboard',
      stats: {
        totalOrders,
        totalRevenue,
        totalProducts,
        totalUsers,
      },
    });
  }
);

export default router;