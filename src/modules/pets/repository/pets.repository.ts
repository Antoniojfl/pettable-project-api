import { query } from '../../../shared/libs/services/db/postgres';
import { Pet } from '../types/pets.types';

export const getAllPets = async (): Promise<Pet[]> => {
  const result = await query('SELECT * FROM pets order by created_at desc');
  return result.rows as Pet[];
};

export const insertPet = async (
  name:string, 
  petType: string, 
  petAge: number, 
  owner_name: string
): Promise<string> => {
  const result = await query('SELECT * FROM insert_pet($1, $2, $3, $4)',[name, petType, petAge, owner_name]);
  console.log('result', result)
  return result?.rows[0].newid;
}

export const updatePet = async ({
  id,
  name, 
  type, 
  age, 
  owner_name
} : Pet
): Promise<void> => {
  await query('SELECT * FROM update_pet_by_id($1, $2, $3, $4, $5)',[id, name, type, age, owner_name]);
}

export const getPetById = async (id: string): Promise<Pet> => {
  const result = await query('SELECT * FROM get_pet_by_id($1)',[id]);
  return result.rows[0] as Pet;
};

export const deletePetById = async (id: string): Promise<void> => {
  await query('SELECT * FROM delete_pet_by_id($1)',[id]);
};