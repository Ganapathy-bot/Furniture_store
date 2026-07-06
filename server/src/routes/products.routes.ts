import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as productsController from '../controllers/products.controller';

const router = Router();

router.get('/', asyncHandler(productsController.listProducts));
router.get('/:id', asyncHandler(productsController.getProductById));

export default router;