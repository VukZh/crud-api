const JsonContentType = "application/json";

export enum StatusCode {
  SuccessOK = 200,
  SuccessCreated = 201,
  SuccessDeleted = 204,
  ClientErrorBadRequest = 400,
  ClientErrorNotFound = 404,
  ServerInternalError = 500
};
