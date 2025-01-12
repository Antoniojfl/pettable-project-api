export type HTTPErrorResponse = {
    statusCode: number;
    headers: {
      "Content-Type": "application/json";
    };
    body: string;
  };