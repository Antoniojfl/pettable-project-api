import type { APIGatewayHandler } from "../../../../shared/types/aws-lambda";
import { HTTPError } from "../../../../shared/utils/http-error";
import { deletePetData } from "../../domain/delete-pets.domain"
  
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
    const response = await deletePetData(id);
    console.log('handler response:', response)
  
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "success": true
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