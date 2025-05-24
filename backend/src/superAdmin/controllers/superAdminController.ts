import { Request, Response } from 'express';
import { resolveTempProductService } from '../services/superAdminService';

export const resolveTempProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tempProductId, realProductId } = req.body;

    // ✅ Validate inputs
    if (!tempProductId || !realProductId) {
      res.status(400).json({ message: 'Both tempProductId and realProductId are required' });
      return;
    }

    const result = await resolveTempProductService(tempProductId, realProductId);

    res.status(200).json({
      message: 'Temp product successfully resolved',
      updatedSessions: result.updatedCount,
      updatedLog: result.updatedLog,
    });
  } catch (error) {
    console.error('Error resolving temp product:', error);
    res.status(500).json({ message: 'Server error resolving temp product' });
  }
};
