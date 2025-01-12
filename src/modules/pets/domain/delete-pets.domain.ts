
import { HTTPError } from "../../../shared/utils/http-error";
import { 
  getPetById,
  deletePetById
 } from '../repository/pets.repository'

const PET_NOT_FOUND: string = "Pet not found."

  export const deletePetData = async ( id: string ): Promise<void> => {
    try {
      const petToDelete = await getPetById(id);
      console.log(petToDelete)
      if(!petToDelete){
        throw new HTTPError(404, PET_NOT_FOUND)
      }
     
      await deletePetById(id);

    } catch (error) {
      throw error;
    }
  }