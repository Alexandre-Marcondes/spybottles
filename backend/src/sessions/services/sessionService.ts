import ExcelJS from 'exceljs';
import InventorySessionModel, { InventorySession, SessionStatus } from '../models/sessionModel';
import ProductModel from '../../product/models/productModel';
import { generateTempProductId } from '../../utils/generateTempID';
import TempProductModel from '../../admin/models/tempProductModel';
import { SessionItem } from '../models/sessionModel';

interface CreateSessionInput {
  userId: string;
  location?: string;
  notes?: string;
  sessionLabel?: string;
  startedAt?: Date;
  periodTag: string;
  status: SessionStatus;
  items: {
    productId?: string;
    name?: string;
    quantity_full: number;
    quantity_partial?: number;
  }[];
}

// export const createInventorySession = async (
//   data: CreateSessionInput
// ): Promise<InventorySession> => {
//   const normalizedItems = data.items.map((item) => {
//     const isMissing = !item.productId;
//     const isTemp = typeof item.productId === 'string' && item.productId.startsWith('temp');

//     return {
//       productId: isMissing ? generateTempProductId() : item.productId,
//       quantity_full: item.quantity_full,
//       quantity_partial: item.quantity_partial,
//       isTemp: isMissing || isTemp,
//     };
//   });
//   const newSession = new InventorySessionModel({
//     userId: data.userId,
//     location: data.location,
//     notes: data.notes,
//     items: normalizedItems,
//   });

//   return await newSession.save();

// };


/**
 * Service function to create and save a new inventory session
 */
export const createInventorySession = async (
  data: CreateSessionInput
): Promise<InventorySession> => {
  const normalizedItems = [];
  const tempLogs = [];

  for (const item of data.items) {
    const isMissing = !item.productId;
    const isTemp =
      typeof item.productId === 'string' && item.productId.startsWith('temp');

    const productId = isMissing ? generateTempProductId() : item.productId;
    const logTemp = isMissing || isTemp;

    normalizedItems.push({
      productId,
      quantity_full: item.quantity_full,
      quantity_partial: item.quantity_partial,
      isTemp: logTemp,
    });

    if (logTemp) {
      tempLogs.push({
        tempId: productId,
        name: item.name || 'unknown',
        spokenBy: data.userId,
        sessionId: '', // to be filled after saving
      });
    }
  }

  const newSession = new InventorySessionModel({
    userId: data.userId,
    location: data.location,
    notes: data.notes,
    sessionLabel: data.sessionLabel,
    startedAt: data.startedAt || new Date(),
    periodTag: data.periodTag,
    status: data.status,
    items: normalizedItems,
  });

  const savedSession = await newSession.save();

  for (const log of tempLogs) {
    log.sessionId = String(savedSession._id);
    await TempProductModel.updateOne(
      { tempId: log.tempId },
      log,
      { upsert: true }
    );
  }

  return savedSession;
};

// src/sessions/services/sessionService.ts
// export const getSessionsByUser = async (userId: string) => {
//   return await InventorySessionModel.find({ userId }).sort({ createdAt: -1 });
// };
export const getSessionsByUser = async (filters: Record<string, any>) => {
  return await InventorySessionModel.find(filters).sort({ createdAt: -1 });
};

export const getSessionByIdService = async (
  sessionId: string,
  userId: string
) => {
  return await InventorySessionModel.findOne({
    _id: sessionId,
    userId,
  });
};

// ******* OLD FUNCTION BEFORE TEMP_ID *************
// export const updateInventorySession = async (
//   sessionId: string,
//   userId: string,
//   updates: Partial<InventorySession>
// ): Promise<InventorySession | null> => {
//   return await InventorySessionModel.findOneAndUpdate(
//     { _id: sessionId, userId },
//     { $set: updates },
//     { new: true } // return updated document
//   );
// };

export const updateInventorySession = async (
  sessionId: string,
  userId: string,
  updates: Partial<InventorySession>
): Promise<InventorySession | null> => {
  // 🔍 Normalize items if present
  if (updates.items && Array.isArray(updates.items)) {
    updates.items = updates.items.map((item: any) => {
      const isMissing = !item.productId;
      const isTemp =
        typeof item.productId === 'string' && item.productId.startsWith('temp');

      return {
        productId: isMissing ? generateTempProductId() : item.productId,
        quantity_full: item.quantity_full,
        quantity_partial: item.quantity_partial,
        isTemp: isMissing || isTemp,
      };
    });
  }

  // 🧠 Perform the update
  return await InventorySessionModel.findOneAndUpdate(
    { _id: sessionId, userId },
    { $set: updates },
    { new: true } // return updated session
  );
};

/**
 * Service to delete a session by ID and user
 */
export const deleteInventorySession = async (
  sessionId: string,
  userId: string
): Promise<boolean> => {
  const result = await InventorySessionModel.deleteOne({
    _id: sessionId,
    userId,
  });

  return result.deletedCount === 1;
};

// 🔧 Helper to format a full product name
const formatProductName = async (item: SessionItem): Promise<string> => {
  if (item.name) return item.name;

  const product = await ProductModel.findById(item.productId).lean();
  if (!product) return 'Unknown Product';

  const {
    brand,
    variant,
    vintage,
    unit,
    appellation,
    country,
  } = product;

  const parts = [brand, variant, vintage, unit, appellation, country].filter(Boolean);
  return parts.join(' ');
};

// 📤 Final export function
export const exportSessionsToExcel = async (
  userId: string,
  periodTag: string
): Promise<ArrayBuffer> => {
  
  // 1. Fetch finalized sessions for the user and period
  const sessions = await InventorySessionModel.find({
    userId,
    status: 'finalized',
    periodTag,
  }).lean<InventorySession[]>();

  // 2. Flatten and enrich all items
  const allItems = await Promise.all(
    sessions.flatMap((session) =>
      session.items.map(async (item) => {
        const product = item.productId
          ? await ProductModel.findById(item.productId).lean()
          : null;

        const productName = await formatProductName(item);

        return {
          productName,
          quantity: Number(
            (item.quantity_full + (item.quantity_partial || 0)).toFixed(1)
          ),
          category: product?.category || item.category || 'Uncategorized',
          sessionLabel: session.sessionLabel || '',
          sessionId: String(session._id),
        };
      })
    )
  );

  // 3. Generate Excel workbook
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(`Inventory_${periodTag}`);

  // 4. Set up headers
  sheet.columns = [
    { header: 'Product', key: 'productName', width: 40 },
    { header: 'Quantity', key: 'quantity', width: 12 },
    { header: 'Category', key: 'category', width: 15 },
    { header: 'Session', key: 'sessionLabel', width: 20 },
    { header: 'Session ID', key: 'sessionId', width: 25 },
  ];

  // 5. Add enriched rows
  allItems.forEach((row) => sheet.addRow(row));

  // 6. Generate and return as ArrayBuffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as unknown as ArrayBuffer;
};