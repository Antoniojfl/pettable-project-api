import { HTTPError } from "../../../shared/utils/http-error";
import { getAllPets } from '../repository/pets.repository'
import { handlePagination } from "../domain/utils/pets.utils"
import type { 
  GetPetsPaginatedResponse, 
  Pet
} from "../types/pets.types"

const NO_PETS_FOUND_ERROR:string = "No pets found"



  export const getPets = async (page: number, pageSize: number): Promise < GetPetsPaginatedResponse > => {
    try {
      const data = await getAllPets();

      if (!data || !data.length) {
        throw new HTTPError(404, NO_PETS_FOUND_ERROR)
      }
  
      const count = data.length;
      const { items: paginatedItems, totalPages } = handlePagination<Pet>(data, page, pageSize);
      const mappedResponse: Pet[] = paginatedItems.map((pet) => {
        return {
          id: pet.id,
          name: pet.name,
          type: pet.type,
          age: pet.age,
          owner_name: pet.owner_name,
        };
      });
      
      return {
        data: mappedResponse,
        total: count,
        page,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  };