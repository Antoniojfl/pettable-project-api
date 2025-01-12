import type { APIGatewayHandler } from "../../../../shared/types/aws-lambda";
import { HTTPError } from "../../../../shared/utils/http-error";
import { getStatsData } from "../../domain/analytics.domain"
  
  export const main: APIGatewayHandler = async ( event ) => {
   try {
    const response = await getStatsData();
    
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