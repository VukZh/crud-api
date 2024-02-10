export const JsonContentType = "application/json";
export const TextContentType = "text/plain";

export enum StatusCode {
  SuccessOK = 200,
  SuccessCreated = 201,
  SuccessDeleted = 204,
  ClientErrorBadRequest = 400,
  ClientErrorNotFound = 404,
  ServerInternalError = 500
};

export const messages: Partial<{ [key in StatusCode]: string }> = {
  [StatusCode.ClientErrorBadRequest]: 'User ID is invalid',
  [StatusCode.ClientErrorNotFound]: "Record doesn't exist",
  [StatusCode.ServerInternalError]: 'Internal Server Error',
};
