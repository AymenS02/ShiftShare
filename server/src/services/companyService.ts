import Company from '../models/Company.js';

export async function createCompany(
  name: string,
  ownerId: string,
  companyCode: string
) {
  // Check if company code already exists
  const existingCompany = await Company.findOne({
    companyCode,
  });

  if (existingCompany) {
    throw new Error("Company code already exists");
  }

  // Create company
  const company = await Company.create({
    name,
    owner: ownerId,
    companyCode,
  });

  return company;
}

export async function getMyCompany(ownerId: string) {
  // Find company by owner ID
  const company = await Company.findOne({
    owner: ownerId,
  });
  
  return company;
}