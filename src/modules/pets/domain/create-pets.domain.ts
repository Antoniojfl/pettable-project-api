import { HTTPError } from "../../../shared/utils/http-error";
import { insertPet } from '../repository/pets.repository'
import type {
    PetsDefaultResponse,
    Pet
} from "../types/pets.types"

const PET_INSERTION_FAILED:string = "Failed to insert pet into the database."

  export const createPet = async ({name, type, age, owner_name}: Pet): Promise<PetsDefaultResponse> => {
    try {
      const data = await insertPet(name, type, age, owner_name);
      console.log('result data', data)
      if (!data) {
        throw new HTTPError(500, PET_INSERTION_FAILED)
      }
  
      return {
        data: {
            id: data,
            name,
            type,
            age,
            owner_name
        },
        success: true
      }
    } catch (error) {
      throw error;
    }
  }