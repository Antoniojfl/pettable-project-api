import type { APIGatewayHandler } from "../../../../shared/types/aws-lambda";
import { HTTPError } from "../../../../shared/utils/http-error";
import { createPet } from "../../domain/create-pets.domain"
  
  export const main: APIGatewayHandler = async ( event ) => {
   try {
    const parsedBody = event.body ? JSON.parse(event.body) : {}
   const { name, type, age, owner_name } = parsedBody || {};

   if (!name || !type || !age || (age < 1) || !owner_name) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          success: false,
          message: 'Invalid request body',
        }),
      };
    }
    const response = await createPet({name, type, age, owner_name});
    console.log('handler response:', response)
  
    return {
      statusCode: 201,
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