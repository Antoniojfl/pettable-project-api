const ALLOWED_FIELDS : string[] = ["name", "type", "age", "owner_name"];

export const handlePagination = <T>(items:T[], page: number, pageSize: number) => {
    if (page === 0 || pageSize === 0) return { items, totalPages: 1 };
  
    const totalPages = Math.ceil(items.length / pageSize);
    const offset = (page - 1) * pageSize;
  
    const slicedItems = items.slice(offset, pageSize + offset);
  
    return { items: slicedItems, totalPages };
  };

  export const hasAtLeastOneValidField = (body: Record<string, string | number>): { valid: boolean; message?: string } => {
    const keys = Object.keys(body);
  
    const invalidFields = keys.filter((key) => !ALLOWED_FIELDS.includes(key));
    if (invalidFields.length > 0) {
      return {
        valid: false,
        message: `Invalid fields in request body: ${invalidFields.join(", ")}`,
      };
    }
  
    if (body.name && typeof body.name !== "string") {
      return { valid: false, message: "The 'name' field must be a string." };
    }
  
    if (body.type && typeof body.type !== "string") {
      return { valid: false, message: "The 'type' field must be a string." };
    }
  
    if (body.age && (typeof body.age !== "number" || body.age < 1 )) {
      return {
        valid: false,
        message: "The 'age' field must be a number higher than 0.",
      };
    }
  
    if (body.owner_name && typeof body.owner_name !== "string") {
      return { valid: false, message: "The 'owner_name' field must be a string." };
    }
  
    return { valid: true };
  }