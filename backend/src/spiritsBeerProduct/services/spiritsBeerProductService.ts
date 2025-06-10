// src/spiritsBeerProduct/services/spiritsBeerProductService.ts

import SpiritsBeerProductModel from '../models/SpiritsBeerModel';
import { logger } from '../../utils/logger';

export class SpiritsBeerProductService {
  // Create a new product
  static async create(productData: any) {
    logger.info('Creating new spirits/beer product', { productData });

    try {
      const newProduct = await SpiritsBeerProductModel.create(productData);
      logger.info('Product created successfully', { id: newProduct._id });
      return newProduct;
    } catch (error) {
      logger.error('Failed to create product', { error });
      throw error;
    }
  }

  // Get all products for a user
  static async getAll(userId: string, filter: any = {}) {
    logger.info('Fetching all spirits/beer products', { userId, filter });

    try {
      const query: any = { userId };

      if (filter.category) query.category = filter.category;

      const products = await SpiritsBeerProductModel.find(query).sort({ createdAt: -1 });
      logger.info(`Found ${products.length} products`);
      return products;
    } catch (error) {
      logger.error('Failed to fetch products', { error });
      throw error;
    }
  }

  // Get a single product by ID and user
  static async getById(id: string, userId: string) {
    logger.info('Fetching product by ID', { id, userId });

    try {
      const product = await SpiritsBeerProductModel.findOne({ _id: id, userId });

      if (!product) {
        logger.warn('Product not found', { id });
        return null;
      }

      return product;
    } catch (error) {
      logger.error('Failed to fetch product by ID', { error });
      throw error;
    }
  }

  // Update product by ID
  static async updateById(id: string, updates: any, userId: string) {
    logger.info('Updating product', { id, updates, userId });

    try {
      const updatedProduct = await SpiritsBeerProductModel.findOneAndUpdate(
        { _id: id, userId },
        updates,
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        logger.warn('Product not found for update', { id });
        return null;
      }

      return updatedProduct;
    } catch (error) {
      logger.error('Failed to update product', { error });
      throw error;
    }
  }

  // Delete product by ID
  static async deleteById(id: string, userId: string) {
    logger.info('Deleting product', { id, userId });

    try {
      const result = await SpiritsBeerProductModel.findOneAndDelete({ _id: id, userId });

      if (!result) {
        logger.warn('Product not found for deletion', { id });
        return null;
      }

      return result;
    } catch (error) {
      logger.error('Failed to delete product', { error });
      throw error;
    }
  }

  // Search by brand or variant
  static async search({
    userId,
    brand,
    variant,
  }: {
    userId: string;
    brand?: string | string[];
    variant?: string | string[];
  }) {
    logger.info('Searching products', { userId, brand, variant });

    const query: any = { userId };

    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }

    if (variant) {
      query.variant = { $regex: variant, $options: 'i' };
    }

    try {
      return await SpiritsBeerProductModel.find(query).limit(10);
    } catch (error) {
      logger.error('Failed to search products', { error });
      throw error;
    }
  }
}
