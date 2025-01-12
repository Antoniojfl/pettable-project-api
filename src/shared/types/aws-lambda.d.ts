import type {
    Context,
    APIGatewayProxyStructuredResultV2,
    APIGatewayProxyEventV2,
    Handler,
  } from "aws-lambda";
  
  export type APIGatewayHandler<T = APIGatewayProxyStructuredResultV2> = Handler<
  APIGatewayProxyEventV2,
  T
>;
  
  export type LambdaContext = Context;