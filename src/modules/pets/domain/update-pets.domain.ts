
import { HTTPError } from "../../../shared/utils/http-error";
import { 
  getPetById,
  updatePet
 } from '../repository/pets.repository'
import type {
    PetsDefaultResponse,
    Pet
} from "../types/pets.types"

const PET_NOT_FOUND: string = "Pet not found."

  export const updatePetData = async ( id: string, newProps: Record<string, string | number> ): Promise<PetsDefaultResponse> => {
    try {
      const originalPet = await getPetById(id);

      if(!originalPet){
        throw new HTTPError(404, PET_NOT_FOUND)
      }
      
      const updatedPet = {...originalPet, ...newProps }
      await updatePet(updatedPet);

      return {
        data: updatedPet,
        success: true
      }
    } catch (error) {
      throw error;
    }
  }


