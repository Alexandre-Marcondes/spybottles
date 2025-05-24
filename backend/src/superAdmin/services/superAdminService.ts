import InventorySessionModel from '../../sessions/models/sessionModel';
import TempProductModel from '../../sessions/models/sessionModel';
import mongoose from 'mongoose';

export const resolveTempProductService = async (
  tempProductId: string,
  realProductId: string
): Promise<{ updatedCount: number; updatedLog: boolean }> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 🔁 Step 1: Replace tempId in all session items
    const updateResult = await InventorySessionModel.updateMany(
      { 'items.productId': tempProductId },
      {
        $set: {
          'items.$[elem].productId': new mongoose.Types.ObjectId(realProductId),
          'items.$[elem].isTemp': false,
        },
      },
      {
        arrayFilters: [{ 'elem.productId': tempProductId }],
        session,
      }
    );

    // ✍️ Step 2: Update temp_products log
    const updatedLog = await TempProductModel.updateOne(
      { tempId: tempProductId },
      { $set: { matchedTo: realProductId } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      updatedCount: updateResult.modifiedCount,
      updatedLog: updatedLog.modifiedCount === 1,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
