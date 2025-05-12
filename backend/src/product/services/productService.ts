import ProductModel from '../models/productModel';
import { logger } from '../../utils/logger';

export class ProductService {
  // Create a new product
  static async create(productData: any) {
    logger.info('Creating new product', { productData });

    try {
      const newProduct = await ProductModel.create(productData);
      logger.info('Product created successfully', { id: newProduct._id });
      return newProduct;
    } catch (error) {
      logger.error('Failed to create product', { error });
      throw error;
    }
  }

  // Get all products for a user, with optional filters
  static async getAll(userId: string, filter: any = {}) {
    logger.info('Fetching products', { userId, filter });

    try {
      const query: any = { userId };

      if (filter.category) query.category = filter.category;

      const products = await ProductModel.find(query).sort({ createdAt: -1 });

      logger.info(`Found ${products.length} products`);
      return products;
    } catch (error) {
      logger.error('Failed to fetch products', { error });
      throw error;
    }
  }

  // Get a single product by ID and owner
  static async getById(id: string, userId: string) {
    logger.info('Fetching product by ID', { id, userId });

    try {
      const product = await ProductModel.findOne({ _id: id, userId });

      if (!product) {
        logger.warn('Product not found', { id });
        return null;
      }

      logger.info('Product found', { id });
      return product;
    } catch (error) {
      logger.error('Failed to fetch product by ID', { error });
      throw error;
    }
  }

  // Update product by ID, scoped to owner
  static async updateById(id: string, updates: any, userId: string) {
    logger.info('Updating product by ID', { id, updates, userId });

    try {
      const updatedProduct = await ProductModel.findOneAndUpdate(
        { _id: id, userId },
        updates,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedProduct) {
        logger.warn('Product not found for update', { id });
        return null;
      }

      logger.info('Product updated successfully', { id });
      return updatedProduct;
    } catch (error) {
      logger.error('Failed to update product', { error });
      throw error;
    }
  }

  // Delete product by ID, scoped to owner
  static async deleteById(id: string, userId: string) {
    logger.info('Deleting product by ID', { id, userId });

    try {
      const result = await ProductModel.findOneAndDelete({ _id: id, userId });

      if (!result) {
        logger.warn('Product not found for deletion', { id });
        return null;
      }

      logger.info('Product deleted', { id });
      return result;
    } catch (error) {
      logger.error('Failed to delete product', { error });
      throw error;
    }
  }

  // ✅ Add this inside the class
  static async search({
    userId,
    brand,
    variant,
  }: {
    userId: string;
    brand?: string | string[];
    variant?: string | string[];
  }) {
    const query: any = { userId };

    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }

    if (variant) {
      query.variant = { $regex: variant, $options: 'i' };
    }

    return await ProductModel.find(query).limit(10);
  }
}
