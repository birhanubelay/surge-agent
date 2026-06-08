// User Types
export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'SUPER_ADMIN' | 'BUSINESS_OWNER' | 'VIEWER';
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

// Business Types
export interface BusinessSetupInput {
  name: string;
  stadiumProximityM?: number;
  primaryLanguage?: string;
  supportedLanguages?: string[];
  address?: string;
  phone?: string;
}

export interface BusinessResponse {
  id: string;
  ownerId: string;
  name: string;
  stadiumProximityM: number;
  primaryLanguage: string;
  supportedLanguages: string[];
  address: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

// Forecast Types
export interface GenerateForecastInput {
  matchId: string;
}

export interface ForecastResponse {
  id: string;
  businessId: string;
  matchId: string;
  matchDate: string;
  multiplier: number;
  expectedSales: number;
  confidence: number;
  riskFactors: string[];
  weatherFactor: number;
  dayFactor: number;
  actualSales: number | null;
  forecastError: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ForecastWithRelations extends ForecastResponse {
  approval: ApprovalResponse | null;
  business: BusinessResponse;
}

// Approval Types
export interface ApprovalResponse {
  id: string;
  forecastId: string;
  actions: any[];
  status: string;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
}

// API Response Wrapper
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}