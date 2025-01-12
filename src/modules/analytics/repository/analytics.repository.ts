import { query } from '../../../shared/libs/services/db/postgres';
import { TypeStats } from '../types/analytics.types';

  export const getTotalStatsByType = async (): Promise<TypeStats[]> => {
    const result = await query('SELECT * FROM view_total_pets_by_type');
    return result.rows as TypeStats[];
  };

  export const getAgeRangeByType = async (): Promise<TypeStats[]> => {
    const result = await query('SELECT * FROM view_age_range_by_type');
    return result.rows as TypeStats[];
  };

  export const getAverageAgeByType = async (): Promise<TypeStats[]> => {
    const result = await query('SELECT * FROM view_average_age_by_type');
    return result.rows as TypeStats[];
  };

