import { prisma } from '../lib/db';
import { GenerateForecastInput, ForecastResponse, ForecastWithRelations } from '../types';
import { FivetranService } from '../lib/fivetran';
// 1. IMPORT THE MOCK AGENT HERE
import { callAgentBuilder } from '../lib/agent'; 

export class ForecastService {
  static async generateForecast(businessId: string, input: GenerateForecastInput): Promise<ForecastResponse> {
    // 2. Check data freshness via Fivetran (Real Integration)
    const syncStatus = await FivetranService.checkAllSyncs([
      'match_schedule',
      'historical_sales',
      'weather_data',
      'foot_traffic'
    ]);

    // 3. Call the "AI Agent" (Mock Implementation for Free Demo)
    // This replaces the hardcoded math with a function call, simulating an AI
    const agentResponse = await callAgentBuilder({
      businessId,
      matchId: input.matchId,
      isDataFresh: syncStatus.allFresh
    });

    // 4. Save the Agent's decision to the Database
    const forecast = await prisma.forecast.create({
      data: {
        businessId,
        matchId: input.matchId,
        matchDate: new Date(),
        multiplier: agentResponse.multiplier, // Data from Agent
        expectedSales: agentResponse.expectedSales, // Data from Agent
        confidence: agentResponse.confidence, // Data from Agent
        riskFactors: agentResponse.riskFactors, // Data from Agent
        weatherFactor: 1.2,
        dayFactor: 1.3,
        status: 'pending',
      },
    });

    return {
      id: forecast.id,
      businessId: forecast.businessId,
      matchId: forecast.matchId,
      matchDate: forecast.matchDate.toISOString(),
      multiplier: forecast.multiplier,
      expectedSales: forecast.expectedSales,
      confidence: forecast.confidence,
      riskFactors: forecast.riskFactors,
      weatherFactor: forecast.weatherFactor,
      dayFactor: forecast.dayFactor,
      actualSales: forecast.actualSales,
      forecastError: forecast.forecastError,
      status: forecast.status,
      createdAt: forecast.createdAt.toISOString(),
      updatedAt: forecast.updatedAt.toISOString(),
    };
  }

  // ... (Keep the rest of the file exactly as you had it: getForecastsByBusinessId, getForecastById, etc.)
  // I have omitted them here to save space, but DO NOT DELETE them. 
  // Just keep your existing code for those two methods below this generateForecast method.
  
  static async getForecastsByBusinessId(businessId: string): Promise<ForecastResponse[]> {
    const forecasts = await prisma.forecast.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    });

    return forecasts.map((f: any) => ({
      id: f.id,
      businessId: f.businessId,
      matchId: f.matchId,
      matchDate: f.matchDate.toISOString(),
      multiplier: f.multiplier,
      expectedSales: f.expectedSales,
      confidence: f.confidence,
      riskFactors: f.riskFactors,
      weatherFactor: f.weatherFactor,
      dayFactor: f.dayFactor,
      actualSales: f.actualSales,
      forecastError: f.forecastError,
      status: f.status,
      createdAt: f.createdAt.toISOString(),
      updatedAt: f.updatedAt.toISOString(),
    }));
  }

  static async getForecastById(id: string): Promise<ForecastWithRelations | null> {
    const forecast = await prisma.forecast.findUnique({
      where: { id },
      include: { approval: true, business: true },
    });

    if (!forecast) return null;

    return {
      id: forecast.id,
      businessId: forecast.businessId,
      matchId: forecast.matchId,
      matchDate: forecast.matchDate.toISOString(),
      multiplier: forecast.multiplier,
      expectedSales: forecast.expectedSales,
      confidence: forecast.confidence,
      riskFactors: forecast.riskFactors,
      weatherFactor: forecast.weatherFactor,
      dayFactor: forecast.dayFactor,
      actualSales: forecast.actualSales,
      forecastError: forecast.forecastError,
      status: forecast.status,
      createdAt: forecast.createdAt.toISOString(),
      updatedAt: forecast.updatedAt.toISOString(),
      approval: forecast.approval ? {
        id: forecast.approval.id,
        forecastId: forecast.approval.forecastId,
        actions: forecast.approval.actions as any[],
        status: forecast.approval.status,
        approvedBy: forecast.approval.approvedBy,
        approvedAt: forecast.approval.approvedAt?.toISOString() || null,
        createdAt: forecast.approval.createdAt.toISOString(),
      } : null,
      business: {
        id: forecast.business.id,
        ownerId: forecast.business.ownerId,
        name: forecast.business.name,
        stadiumProximityM: forecast.business.stadiumProximityM,
        primaryLanguage: forecast.business.primaryLanguage,
        supportedLanguages: forecast.business.supportedLanguages,
        address: forecast.business.address,
        phone: forecast.business.phone,
        createdAt: forecast.business.createdAt.toISOString(),
        updatedAt: forecast.business.updatedAt.toISOString(),
      },
    };
  }
}