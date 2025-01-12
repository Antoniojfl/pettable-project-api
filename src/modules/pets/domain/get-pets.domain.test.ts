import { getPets } from '../domain/get-pets.domain';
import { getAllPets } from '../repository/pets.repository';
import { handlePagination } from '../domain/utils/pets.utils';
import { HTTPError } from "../../../shared/utils/http-error";

// Mock dependencies
jest.mock('../repository/pets.repository', () => ({
  getAllPets: jest.fn(),
}));

jest.mock('../domain/utils/pets.utils', () => ({
  handlePagination: jest.fn(),
}));

describe('getPets', () => {
  const mockedGetAllPets = getAllPets as jest.MockedFunction<typeof getAllPets>
  const mockedHandlePagination = handlePagination as jest.MockedFunction<typeof handlePagination>

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return paginated pets data when pets are available', async () => {
    // Arrange 
    const mockPetsData = [
      {
        id: "e14e47eb-a5aa-4b0e-94e7-6ce84ffb4e6a",
        name: "Max",
        type: "dog",
        age: 5,
        owner_name: "Jane Smith",
      },
      {
        id: "db3d3962-20bc-4c78-b56f-d8d46cbd47a5",
        name: "Luna",
        type: "cat",
        age: 2,
        owner_name: "Alice Johnson",
      },
      {
        id: "1daaaac6-db35-4a65-ad04-cebbffa1b2ed",
        name: "Charlie",
        type: "rabbit",
        age: 1,
        owner_name: "Bob Brown",
      },
      {
        id: "a5128982-5ad2-4b13-9c7f-e1dda2e4f6b6",
        name: "Lucy",
        type: "dog",
        age: 4,
        owner_name: "Karen Davis",
      },
      {
        id: "daaea143-3aff-46df-86bc-f4e9492b535b",
        name: "Daisy",
        type: "cat",
        age: 3,
        owner_name: "Michael Wilson",
      },
    ];

    mockedGetAllPets.mockResolvedValue(mockPetsData);

    const mockPaginatedItems = mockPetsData.slice(0, 2);
    mockedHandlePagination.mockReturnValue({
      items: mockPaginatedItems,
      totalPages: 3,
    });

    //ACT
    const result = await getPets(1, 2);

    //Assert
    expect(mockedGetAllPets).toHaveBeenCalledTimes(1);
    expect(mockedHandlePagination).toHaveBeenCalledWith(mockPetsData, 1, 2);

    expect(result).toEqual({
      data: mockPaginatedItems,
      total: mockPetsData.length,
      page: 1,
      totalPages: 3,
    });
  });

  it('should throw a 404 error if no pets are found', async () => {
    mockedGetAllPets.mockResolvedValue([]);

    await expect(getPets(1, 2)).rejects.toThrow(new HTTPError(404, "No pets found"));

    expect(mockedGetAllPets).toHaveBeenCalledTimes(1);
    expect(mockedHandlePagination).not.toHaveBeenCalled();
  });
});