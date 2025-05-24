import mongoose from 'mongoose';
import InventorySessionModel from "../../sessions/models/sessionModel"

export const replaceTempProductId = async (
  tempId: string,
  realProductId: mongoose.Types.ObjectId
): Promise<number> => {
  const result = await InventorySessionModel.updateMany(
    { 'items.productId': tempId },
    {
      $set: {
        'items.$[elem].productId': realProductId,
        'items.$[elem].isTemp': false,
      },
    },
    {
      arrayFilters: [{ 'elem.productId': tempId }],
    }
  );

  return result.modifiedCount || 0;
};
