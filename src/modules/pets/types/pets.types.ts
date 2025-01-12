export type Pet = {
    id?: string;          
    name: string;        
    type: string;        
    age: number;         
    owner_name: string;
  };

export type GetPetsPaginatedResponse = {
    data: Pet[];
    total: number;
    page: number;
    totalPages: number;
}

export type PetsDefaultResponse = {
  data: Pet;
  success: boolean
}