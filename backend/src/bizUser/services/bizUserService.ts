import mongoose from 'mongoose';
import { hashPassword } from '../../utils/authUtils';
import { UserModel, UserRole } from '../../user/models/userModel';
import { CompanyModel } from '../../company/models/companyModel';
import { Types } from 'mongoose';

interface BizUserInput {
  email: string;
  password: string;
  companyName: string;
}

export const createBizUserService = async ({
  email,
  password,
  companyName,
}: BizUserInput) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await UserModel.findOne({ email }).session(session);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new UserModel({
      email,
      password: hashedPassword,
      role: UserRole.CompanyAdmin,
      isSelfPaid: false,
      companies: [],
    });

    await newUser.save({ session });

    const newCompany = new CompanyModel({
      companyName,
      createdBy: newUser._id as Types.ObjectId,
      users: [newUser._id],
      tier: 'pro',
      isPaid: true,
    });

    await newCompany.save({ session });

    newUser.companies = [newCompany._id as Types.ObjectId];
    await newUser.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      user: newUser,
      company: newCompany,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
