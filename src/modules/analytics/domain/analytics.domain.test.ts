import { HTTPError } from "../../../shared/utils/http-error";
import { getStatsData } from '../domain/analytics.domain';
import { getTotalStatsByType, getAgeRangeByType, getAverageAgeByType } from '../repository/analytics.repository';
import type { AnalyticsDefaultResponse } from "../types/analytics.types";

// mock repo functions
jest.mock('../repository/analytics.repository', () => ({
  getTotalStatsByType: jest.fn(),
  getAgeRangeByType: jest.fn(),
  getAverageAgeByType: jest.fn(),
}));

describe('getStatsData', () => {
  const mockedGetTotalStatsByType = getTotalStatsByType as jest.MockedFunction<typeof getTotalStatsByType>;
  const mockedGetAgeRangeByType = getAgeRangeByType as jest.MockedFunction<typeof getAgeRangeByType>;
  const mockedGetAverageAgeByType = getAverageAgeByType as jest.MockedFunction<typeof getAverageAgeByType>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return aggregated stats data when all repository calls succeed', async () => {
   // Arrange
    const mockPetsByType = [
      { type: 'dog', total_pets: 7 },
      { type: 'cat', total_pets: 6 },
      { type: 'rabbit', total_pets: 4 },
    ];
    const mockAgeRangeByType = [
      { type: 'dog', min_age: 1, max_age: 15 },
      { type: 'cat', min_age: 2, max_age: 12 },
    ];
    const mockAvgAgeByType = [
      { type: 'dog', avg_age: 7.5 },
      { type: 'cat', avg_age: 6.3 },
    ];

    mockedGetTotalStatsByType.mockResolvedValue(mockPetsByType);
    mockedGetAgeRangeByType.mockResolvedValue(mockAgeRangeByType);
    mockedGetAverageAgeByType.mockResolvedValue(mockAvgAgeByType);
    // Act
    const result: AnalyticsDefaultResponse = await getStatsData();

    //Assert
    expect(mockedGetTotalStatsByType).toHaveBeenCalledTimes(1);
    expect(mockedGetAgeRangeByType).toHaveBeenCalledTimes(1);
    expect(mockedGetAverageAgeByType).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      total_pets: 17,
      data: {
        type_statistics: mockPetsByType,
        age_range_statistics: mockAgeRangeByType,
        avg_age_statistics: mockAvgAgeByType,
      },
      success: true,
    });
  });

  it('should throw an error if any of the repository calls fail', async () => {
    mockedGetTotalStatsByType.mockRejectedValue(new Error('Failed to fetch total stats.'));

    await expect(getStatsData()).rejects.toThrow(new HTTPError(500, "Failed to fetch total stats."));

    expect(mockedGetTotalStatsByType).toHaveBeenCalledTimes(1);
    expect(mockedGetAgeRangeByType).toHaveBeenCalled();
    expect(mockedGetAverageAgeByType).toHaveBeenCalled();
  });
});