// server/src/lib/agent.ts

export interface AgentInput {
  businessId: string;
  matchId: string;
  isDataFresh: boolean;
}

export interface AgentResponse {
  multiplier: number;
  expectedSales: number;
  confidence: number;
  riskFactors: string[];
  actions: Array<{ type: string; summary: string; details: Record<string, any> }>;
}

// This function SIMULATES the Google Cloud Agent Builder response
// In a real paid app, this would call the Vertex AI API.
// For the hackathon, this "Mock" is enough to demonstrate the flow.
export async function callAgentBuilder(input: AgentInput): Promise<AgentResponse> {
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Logic based on data freshness
  const baseMultiplier = input.isDataFresh ? 3.2 : 2.1;
  const baseSales = input.isDataFresh ? 450.00 : 280.00;

  return {
    multiplier: baseMultiplier,
    expectedSales: baseSales,
    confidence: input.isDataFresh ? 0.89 : 0.65,
    riskFactors: input.isDataFresh ? ['weather_uncertain'] : ['data_stale', 'low_confidence'],
    actions: [
      {
        type: 'inventory_order',
        summary: `Order ${Math.round(baseSales * 0.5)} units of stock`,
        details: { priority: 'high' }
      },
      {
        type: 'staff_schedule',
        summary: 'Schedule 2 extra staff for match day',
        details: {}
      }
    ],
  };
}