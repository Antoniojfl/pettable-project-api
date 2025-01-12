import type { APIGatewayHandler } from "../../../../shared/types/aws-lambda";
import { HTTPError } from "../../../../shared/utils/http-error";
import { getPets } from "../../domain/get-pets.domain"
  
  export const main: APIGatewayHandler = async ( event ) => {
   try {
   const { page, pageSize } = event.queryStringParameters || {};

   if (!page || !pageSize) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          success: false,
          message: 'Missing required query parameters',
        }),
      };
    }
    const response = await getPets( Number(page), Number(pageSize) );
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