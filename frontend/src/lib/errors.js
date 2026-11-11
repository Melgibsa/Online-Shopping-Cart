export class ApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getErrorMessage(error) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof TypeError) {
    return "Could not connect to the server. Check that the API is running.";
  }
  return "Something went wrong. Please try again.";
}
