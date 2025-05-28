import { CompanyModel } from '../../company/models/companyModel';

export const createCompanyService = async ({
  companyName,
  createdBy,
}: {
  companyName: string;
  createdBy: string;
}) => {
  const company = new CompanyModel({
    companyName,
    createdBy,
    users: [],
  });

  await company.save();

  return company;
};
