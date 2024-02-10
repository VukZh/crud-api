import {v4 as uuidv4, version, validate} from 'uuid';
import {UserType, ValidationType} from "@/types.js";
import {JsonContentType, messages, StatusCode, TextContentType} from "@/constants.js";
import {ServerResponse} from 'http';

export const generateUUID = () => uuidv4();

const uuidV4Validate = (uuid: string): boolean => {
  return validate(uuid) && version(uuid) === 4;
}
const tryFindUser = (users: Array<UserType>, id: string): UserType | ValidationType => {
  const isUUID = uuidV4Validate(id);
  if (!isUUID) {
    return "notUUID";
  }
  const indFind = users.findIndex((_user) => {
    _user.id === id
  });
  if (indFind === -1) return "notExists";
  return users[indFind];
};
const tryDeleteUser = (users: Array<UserType>, id: string): ValidationType => {
  const isUUID = uuidV4Validate(id);
  if (!isUUID) {
    return "notUUID";
  }
  const indFind = users.findIndex((_user) => {
    _user.id === id
  });

  if (indFind === -1) return "notExists";
  users.splice(indFind, 1);
  return;
};


const tryChangeUser = (users: Array<UserType>, user: UserType): UserType | ValidationType => {
  const isUUID = uuidV4Validate(user.id);
  if (!isUUID) {
    return "notUUID";
  }
  const indFind = users.findIndex((_user) => {
    _user.id === user.id
  });

  if (indFind === -1) return "notExists";

  users[indFind] = user;
  return user;
};


const getAllUsers = (res: ServerResponse, users: Array<UserType>) => {
  res.statusCode = StatusCode.SuccessOK;
  res.setHeader("Content-Type", JsonContentType)
  return res.end(users)
}

const addUser = (res: ServerResponse, users: Array<UserType>, user: Omit<UserType, "id">) => {
  const newUser = {...user, id: generateUUID()};
  users.push(newUser);
  res.statusCode = StatusCode.SuccessCreated;
  res.setHeader("Content-Type", JsonContentType)
  res.end(newUser)
  // return [...users, newUser];
};

const getUser = (res: ServerResponse, users: Array<UserType>, id: string) => {
  const checkUser = tryFindUser(users, id);
  if (checkUser === "notUUID") {
    res.setHeader("Content-Type", TextContentType)
    res.statusCode = StatusCode.ClientErrorBadRequest;
    return res.end(messages[StatusCode.ClientErrorBadRequest])
  }
  if (checkUser === "notExists") {
    res.setHeader("Content-Type", TextContentType)
    res.statusCode = StatusCode.ClientErrorNotFound;
    return res.end(messages[StatusCode.ClientErrorNotFound])
  }
  res.statusCode = StatusCode.SuccessOK;
  res.setHeader("Content-Type", JsonContentType)
  return res.end(checkUser)
}

const delUser = (res: ServerResponse, users: Array<UserType>, id: string) => {
  const checkUser = tryDeleteUser(users, id);
  if (checkUser === "notUUID") {
    res.setHeader("Content-Type", TextContentType)
    res.statusCode = StatusCode.ClientErrorBadRequest;
    return res.end(messages[StatusCode.ClientErrorBadRequest])
  }
  if (checkUser === "notExists") {
    res.setHeader("Content-Type", TextContentType)
    res.statusCode = StatusCode.ClientErrorNotFound;
    return res.end(messages[StatusCode.ClientErrorNotFound])
  }
  res.statusCode = StatusCode.SuccessDeleted;
  res.setHeader("Content-Type", TextContentType)
  return res.end()
}

const changeUser = (res: ServerResponse, users: Array<UserType>, user: UserType) => {
  const checkUser = tryChangeUser(users, user);
  if (checkUser === "notUUID") {
    res.setHeader("Content-Type", TextContentType)
    res.statusCode = StatusCode.ClientErrorBadRequest;
    return res.end(messages[StatusCode.ClientErrorBadRequest])
  }
  if (checkUser === "notExists") {
    res.setHeader("Content-Type", TextContentType)
    res.statusCode = StatusCode.ClientErrorNotFound;
    return res.end(messages[StatusCode.ClientErrorNotFound])
  }
  res.statusCode = StatusCode.SuccessOK;
  res.setHeader("Content-Type", JsonContentType)
  return res.end(checkUser)
}

export {getAllUsers, changeUser, delUser, addUser , getUser};


