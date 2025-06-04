import { Request, Response } from 'express';
import {
  getAllGlobalProducts,
  addGlobalProduct,
  updateGlobalProduct,
} from '../services/globalProductService';
import { logger } from '../../utils/logger';

// GET /global-products
export const getAllGlobalProductsHandler = async (_req: Request, res: Response) => {
  try {
    const products = await getAllGlobalProducts();
    res.status(200).json(products);
  } catch (error) {
    logger.error('Error fetching global products', { error });
    res.status(500).json({ message: 'Failed to fetch global products' });
  }
};

// POST /global-products
export const addGlobalProductHandler = async (req: Request, res: Response) => {
  try {
    const product = await addGlobalProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    logger.error('Error adding global product', { error });
    res.status(400).json({ message: 'Failed to add global product' });
  }
};

// PUT /global-products/:id
export const updateGlobalProductHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updated = await updateGlobalProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    logger.error('Error updating global product', { error });
    res.status(400).json({ message: 'Failed to update global product' });
  }
};
