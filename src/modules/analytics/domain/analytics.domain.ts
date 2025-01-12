import { HTTPError } from "../../../shared/utils/http-error";
import { 
    getTotalStatsByType,
    getAgeRangeByType,
    getAverageAgeByType
} from '../repository/analytics.repository'
import type { 
    AnalyticsDefaultResponse
} from "../types/analytics.types"


  export const getStatsData = async (): Promise < AnalyticsDefaultResponse > => {
    try {
      const [petsByType, ageRangeByType, avgAgeByPet] = await Promise.all([
        getTotalStatsByType(),
        getAgeRangeByType(),
        getAverageAgeByType()      
      ])
      if (!petsByType || !ageRangeByType || !avgAgeByPet) {
        throw new HTTPError(500,"Failed to fetch total stats.");
      }

      const petCount =  petsByType.reduce((acc,curr) => { return acc + Number(curr.total_pets)},0) 
      
      return {
        total_pets: petCount,
        data: {
          type_statistics: petsByType,
          age_range_statistics: ageRangeByType,
          avg_age_statistics: avgAgeByPet
        },
        success: true
      };
    } catch (error) {
      throw error;
    }
  };