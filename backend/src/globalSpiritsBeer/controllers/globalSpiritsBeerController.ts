// src/globalSpiritsBeer/controllers/globalSpiritsBeerController.ts

import { Request, Response } from 'express';
import {
  getAllGlobalProducts,
  addGlobalProduct,
  updateGlobalProduct,
  smartMatchGlobalProduct,
} from '../services/globalSpiritsBeerService'; // ✅ updated import
import { logger } from '../../utils/logger';

/**
 * GET /global-spirits-beer
 * Returns all global spirits and beer products.
 */
export const getAllGlobalProductsHandler = async (_req: Request, res: Response) => {
  try {
    const products = await getAllGlobalProducts();
    res.status(200).json(products);
  } catch (error) {
    logger.error('Error fetching global spirits/beer products', { error });
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

/**
 * POST /global-spirits-beer
 * Adds a new global spirits or beer product.
 */
export const addGlobalProductHandler = async (req: Request, res: Response) => {
  try {
    const product = await addGlobalProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    logger.error('Error adding global spirits/beer product', { error });
    res.status(400).json({ message: 'Failed to add product' });
  }
};

/**
 * PUT /global-spirits-beer/:id
 * Updates an existing global spirits/beer product.
 */
export const updateGlobalProductHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updated = await updateGlobalProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    logger.error('Error updating global spirits/beer product', { error });
    res.status(400).json({ message: 'Failed to update product' });
  }
};
