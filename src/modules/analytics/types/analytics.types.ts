export type TypeStats = {
    type: string;  
    average?: number;        
    total_pets?: number;
    minAge?: number;
    maxAge?: number;

  };

export type AnalyticsDefaultResponse = {
  total_pets: number
  data: Record<string,TypeStats[]>
  success: boolean
}