import type { APIGatewayHandler } from "../../../../shared/types/aws-lambda";
import { HTTPError } from "../../../../shared/utils/http-error";
import { updatePetData } from "../../domain/update-pets.domain"
import { hasAtLeastOneValidField } from "../../domain/utils/pets.utils"
  
  export const main: APIGatewayHandler = async ( event ) => {
   try {

   const { id } = event.pathParameters || {};

   if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        success: false, 
        message: "Missing required path parameter 'id'." 
      }),
    };
  }
  const parsedBody = event.body ? JSON.parse(event.body) : {}
  const { valid } = hasAtLeastOneValidField(parsedBody)
      
   if (!valid) {
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        success: false, 
        message: "No fields provided to update." 
      }),
    };
  }
    const response = await updatePetData(id, parsedBody);
    console.log('handler response:', response)
  
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...response
      }),
    }
  } catch (error ) {
    console.log('error: ', error)

    if (error instanceof HTTPError) {
      return {
        statusCode: error.statusCode,
        headers: error.headers,
        body: JSON.stringify({ success: false, message: error.message }),
      };
    }
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: false,
        message: "Internal Server Error",
      }),
    };
  }
  };