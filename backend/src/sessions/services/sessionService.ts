import ExcelJS from 'exceljs';
import { wordsToNumbers } from 'words-to-numbers';
import InventorySessionModel, { InventorySession, SessionStatus } from '../models/sessionModel';
import  ProductModel, { Product}  from '../../product/models/productModel';
// import { parseWordNumber, parseDecimalWord } from '../../utils/wordToNumber';
import { generateTempProductId } from '../../utils/generateTempID';
import TempProductModel from '../../superAdmin/models/tempProductModel';
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
  const session = await InventorySessionModel.findOne({ _id: sessionId, userId });

  if (!session) return null;

  // 🔁 Merge item updates
  if (updates.items && Array.isArray(updates.items)) {
    for (const updateItem of updates.items) {
      const existingItem = session.items.find(
        (item) => item.productId.toString() === updateItem.productId
      );

      if (existingItem) {
        if (updateItem.quantity_full !== undefined) {
          existingItem.quantity_full = updateItem.quantity_full;
        }
        if (updateItem.quantity_partial !== undefined) {
          existingItem.quantity_partial = updateItem.quantity_partial;
        }
      } else {
        // If new item (e.g. from speech), add to items[]
        session.items.push({
          productId: updateItem.productId || generateTempProductId(),
          quantity_full: updateItem.quantity_full || 0,
          quantity_partial: updateItem.quantity_partial || 0,
          isTemp:
            !updateItem.productId ||
            updateItem.productId?.toString().startsWith('temp'),
        });
      }
    }
  }

  // ✅ Merge top-level fields (e.g., notes, location)
  if (updates.notes) session.notes = updates.notes;
  if (updates.location) session.location = updates.location;

  return await session.save();
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

/**
 * Parses a voice transcript to extract productId and quantity.
 * Assumes full and partial quantities must be spoken separately.
 */
export const parseVoiceTranscript = async (
  transcript: string,
  userId: string
): Promise<{
  productId: string;
  quantity_full: number;
  quantity_partial: number;
  message: string;
}> => {
  const cleaned = transcript.trim().toLowerCase().replace(/-/g, ' ');

  let quantity_full = 0;
  let quantity_partial = 0;

  // ✅ Match product from DB
  const products: Product[] = await ProductModel.find({ userId });

  const matchedProduct = products.find((p) => {
    const brand = p.brand?.toLowerCase() || '';
    const variant = p.variant?.toLowerCase() || '';
    return cleaned.includes(brand) && (variant === '' || cleaned.includes(variant));
  });

  if (!matchedProduct) {
    throw new Error('No matching product found');
  }

  const brand = matchedProduct.brand?.toLowerCase() || '';
  const variant = matchedProduct.variant?.toLowerCase() || '';

  // ✅ Extract full quantity (e.g., "twenty eight bottles")
  const fullMatch = cleaned.match(/(?:^|\s)([a-z\s\d]+?)(?=\s+(bottles?|full))/i);
  if (fullMatch && fullMatch[1]) {
    const rawFull = fullMatch[1].trim();
    const withoutProduct = rawFull.replace(brand, '').replace(variant, '').trim();
    const parsed = wordsToNumbers(withoutProduct, { fuzzy: true });
    if (typeof parsed === 'number') {
      quantity_full = parsed;
    }
  }

  // ✅ Extract partial quantity (e.g., "point seven")
  const partialMatch = cleaned.match(/point\s?([a-z\d\s]+)/);
  if (partialMatch && partialMatch[1]) {
    let rawPartial = partialMatch[1].trim();
    rawPartial = rawPartial.replace(/bottles?|full/, '').trim();
    const parsed = wordsToNumbers(rawPartial, { fuzzy: true });
    if (typeof parsed === 'number') {
      const divisor = parsed <= 9 ? 10 : 100;
      const forcedDecimal = parsed / divisor;
      quantity_partial = parseFloat(forcedDecimal.toFixed(2));
    }
  }

  // ✅ Guidance message (since full+partial never happen together yet)
  let message = '';

  if (quantity_full === 0 && quantity_partial > 0) {
    message = "Partial quantity detected. If you also meant full bottles, please say that separately.";
  } else if (quantity_full > 0 && quantity_partial === 0) {
    message = "Full quantity detected. If there are partials, say 'point five' in a separate sentence.";
  } else if (quantity_full === 0 && quantity_partial === 0) {
    message = "No quantity detected. Please try again.";
  }

  return {
    productId: matchedProduct._id.toString(),
    quantity_full,
    quantity_partial,
    message,
  };
};
