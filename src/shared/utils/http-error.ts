export class HTTPError extends Error {
    public statusCode: number;
    public headers: Record<string, string>;
  
    constructor(statusCode: number, message: string, headers: Record<string, string> = { "Content-Type": "application/json" }) {
      super(message);
      this.statusCode = statusCode;
      this.headers = headers;
  
      Object.setPrototypeOf(this, HTTPError.prototype);
    }
  }
  