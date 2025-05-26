import { hashPassword } from '../../utils/authUtils';
import mongoose from 'mongoose';
import { UserModel, UserRole } from '../../user/models/userModel';
import { CompanyModel } from '../../company/models/companyModel';

interface BizUserInput {
  email: string;
  password: string;
  companyName: string;
  phoneNumber: string;
}

export const createBizUserService = async ({
  email,
  password,
  companyName,
  phoneNumber,
}: BizUserInput) => {
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const hashedPassword = await hashPassword(password);

  const newUser = new UserModel({
    email,
    password: hashedPassword,
    role: UserRole.CompanyAdmin,
    phoneNumber,
    isSelfPaid: false,
    companies: [],
  });

  await newUser.save();

  const newCompany = new CompanyModel({
    name: companyName,
    createdBy: newUser._id,
    users: [newUser._id],
  });

  await newCompany.save();

  // Link the company to the user
  newUser.companies = [newCompany._id as mongoose.Types.ObjectId];
  await newUser.save();

  return { user: newUser, company: newCompany };
};
