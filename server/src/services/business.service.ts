import { prisma } from '../lib/db';
import { BusinessSetupInput, BusinessResponse } from '../types';

export class BusinessService {
  static async setupBusiness(ownerId: string, input: BusinessSetupInput): Promise<BusinessResponse> {
    const existing = await prisma.business.findUnique({ where: { ownerId } });
    if (existing) {
      throw new Error('Business already registered for this user');
    }

    const business = await prisma.business.create({
      data: {
        ownerId,
        name: input.name,
        stadiumProximityM: input.stadiumProximityM || 500,
        primaryLanguage: input.primaryLanguage || 'en',
        supportedLanguages: input.supportedLanguages || ['en'],
        address: input.address,
        phone: input.phone,
      },
    });

    await prisma.user.update({
      where: { id: ownerId },
      data: { role: 'BUSINESS_OWNER' },
    });

    return {
      id: business.id,
      ownerId: business.ownerId,
      name: business.name,
      stadiumProximityM: business.stadiumProximityM,
      primaryLanguage: business.primaryLanguage,
      supportedLanguages: business.supportedLanguages,
      address: business.address,
      phone: business.phone,
      createdAt: business.createdAt.toISOString(),
      updatedAt: business.updatedAt.toISOString(),
    };
  }

  static async getBusinessByOwnerId(ownerId: string): Promise<BusinessResponse | null> {
    const business = await prisma.business.findUnique({ where: { ownerId } });
    if (!business) return null;

    return {
      id: business.id,
      ownerId: business.ownerId,
      name: business.name,
      stadiumProximityM: business.stadiumProximityM,
      primaryLanguage: business.primaryLanguage,
      supportedLanguages: business.supportedLanguages,
      address: business.address,
      phone: business.phone,
      createdAt: business.createdAt.toISOString(),
      updatedAt: business.updatedAt.toISOString(),
    };
  }
}