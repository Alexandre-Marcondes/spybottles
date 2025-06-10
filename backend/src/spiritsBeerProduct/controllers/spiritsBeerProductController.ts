import { Request, Response, NextFunction } from 'express';
import { SpiritsBeerProductService } from '../services/spiritsBeerProductService';
import { logger } from '../../utils/logger';

// POST /product/add
export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info('POST /product/add called');

  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized: No userId' });
    return;
  }

  try {
    const savedProduct = await SpiritsBeerProductService.create({
      ...req.body,
      userId,
    });

    res.status(201).json({
      message: 'Product created successfully',
      data: savedProduct,
    });
  } catch (error) {
    logger.error('Error in addProduct controller', { error });
    next(error);
  }
};

// GET /product/all
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info('GET /product/all called');

  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized: No userId' });
    return;
  }

  try {
    const products = await SpiritsBeerProductService.getAll(userId, req.query);
    res.status(200).json({ data: products });
  } catch (error) {
    logger.error('Error in getAllProducts controller', { error });
    next(error);
  }
};

// GET /product/:id
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info('GET /product/:id called', { id: req.params.id });

  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized: No userId' });
    return;
  }

  try {
    const product = await SpiritsBeerProductService.getById(req.params.id, userId);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json({ data: product });
  } catch (error) {
    logger.error('Error in getProductById controller', { error });
    next(error);
  }
};

// PUT /product/:id
export const updateProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  logger.info('PUT /product/:id called', { id, updates: req.body });

  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized: No userId' });
    return;
  }

  try {
    const updated = await SpiritsBeerProductService.updateById(id, req.body, userId);

    if (!updated) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json({
      message: 'Product updated successfully',
      data: updated,
    });
  } catch (error) {
    logger.error('Error in updateProductById controller', { error });
    next(error);
  }
};

// DELETE /product/:id
export const deleteProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  logger.info('DELETE /product/:id called', { id });

  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized: No userId' });
    return;
  }

  try {
    const deleted = await SpiritsBeerProductService.deleteById(id, userId);

    if (!deleted) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    logger.error('Error in deleteProductById controller', { error });
    next(error);
  }
};

// GET /product/search
export const searchProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const brand = typeof req.query.brand === 'string' ? req.query.brand : undefined;
    const variant = typeof req.query.variant === 'string' ? req.query.variant : undefined;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!brand && !variant) {
      res.status(400).json({ message: 'At least brand or variant must be provided' });
      return;
    }

    const results = await SpiritsBeerProductService.search({ userId, brand, variant });

    res.status(200).json({ data: results });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
