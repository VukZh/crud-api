import {v4 as uuidv4, version, validate} from 'uuid';
// @ts-ignore
import {UserType} from "./types.ts";
// @ts-ignore
import {JsonContentType, messages, StatusCode, TextContentType} from "./constants.ts";
import {ServerResponse} from 'http';

export const generateUUID = () => uuidv4();

const uuidV4Validate = (uuid: string): boolean => {
  return validate(uuid) && version(uuid) === 4;
}

class NotExistsError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "NotExistsError"
  }
}

class BadRequestError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "BadRequestError"
  }
}

const tryFindUser = (users: Array<UserType>, id: string): UserType => {
  const isUUID = uuidV4Validate(id);
  if (!isUUID) {
    throw new BadRequestError("id isn't UUID");
  }
  const indFind = users.findIndex((_user) => {
    return _user.id === id
  });
  if (indFind === -1) throw new NotExistsError("user not exists");
  return users[indFind];
};
const tryDeleteUser = (users: Array<UserType>, id: string): boolean => {
  const isUUID = uuidV4Validate(id);
  if (!isUUID) {
    throw new BadRequestError("id isn't UUID");
  }
  const indFind = users.findIndex((_user) => {
    return _user.id === id
  });

  if (indFind === -1 || users.length === 0) throw new NotExistsError("user not exists");
  users.splice(indFind, 1);
  return true;
};


const tryChangeUser = (users: Array<UserType>, user: UserType): UserType => {
  const isUUID = uuidV4Validate(user.id);
  if (!isUUID) {
    throw new BadRequestError("id isn't UUID");
  }
  const indFind = users.findIndex((_user) => {
    return _user.id === user.id
  });

  if (indFind === -1) throw new NotExistsError("user not exists");


  users[indFind] = {...user};
  return user;
};

const tryAddUser = (user: string) => {
  const checkedUser = JSON.parse(user);
  if (!checkedUser?.username || typeof checkedUser.username !== "string" || !checkedUser?.age || typeof checkedUser.age !== "number" || !checkedUser?.hobbies || !Array.isArray(checkedUser.hobbies) || !checkedUser.hobbies.every((h: any) => typeof h === "string")) {
    throw new BadRequestError("it not contain required fields");
  }
  return {...checkedUser, id: generateUUID()};
}


const getAllUsers = (res: ServerResponse, users: Array<UserType>) => {
  res.statusCode = StatusCode.SuccessOK;
  res.setHeader("Content-Type", JsonContentType)
  return res.end(JSON.stringify(users))
}

const addUser = (res: ServerResponse, users: Array<UserType>, user: string) => {
  try {
    const newUser = tryAddUser(user);
    users.push(newUser);
    res.statusCode = StatusCode.SuccessCreated;
    res.setHeader("Content-Type", JsonContentType)
    res.end(JSON.stringify(newUser))
  } catch (e) {
    if (e instanceof BadRequestError) {
      res.setHeader("Content-Type", TextContentType)
      res.statusCode = StatusCode.ClientErrorBadRequest;
      return res.end("Not contain required fields")
    }
    res.setHeader("Content-Type", TextContentType)
    res.statusCode = StatusCode.ServerInternalError;
    return res.end(messages[StatusCode.ServerInternalError])
  }
};

const getUser = (res: ServerResponse, users: Array<UserType>, id: string) => {
  try {
    const foundUser = tryFindUser(users, id);
    res.statusCode = StatusCode.SuccessOK;
    res.setHeader("Content-Type", JsonContentType)
    return res.end(JSON.stringify(foundUser))
  } catch (e) {
    if (e instanceof BadRequestError) {
      res.setHeader("Content-Type", TextContentType)
      res.statusCode = StatusCode.ClientErrorBadRequest;
      return res.end(messages[StatusCode.ClientErrorBadRequest])
    } else if (e instanceof NotExistsError) {
      res.setHeader("Content-Type", TextContentType)
      res.statusCode = StatusCode.ClientErrorNotFound;
      return res.end(messages[StatusCode.ClientErrorNotFound])
    }
    res.setHeader("Content-Type", TextContentType)
    res.statusCode = StatusCode.ServerInternalError;
    return res.end(messages[StatusCode.ServerInternalError])
  }

}

const delUser = (res: ServerResponse, users: Array<UserType>, id: string) => {
  try {
    tryDeleteUser(users, id);
    res.statusCode = StatusCode.SuccessDeleted;
    res.setHeader("Content-Type", TextContentType)
    return res.end("user deleted")
  } catch (e) {
    if (e instanceof BadRequestError) {
      res.setHeader("Content-Type", TextContentType)
      res.statusCode = StatusCode.ClientErrorBadRequest;
      return res.end(messages[StatusCode.ClientErrorBadRequest])
    } else if (e instanceof NotExistsError) {
      res.setHeader("Content-Type", TextContentType)
      res.statusCode = StatusCode.ClientErrorNotFound;
      return res.end(messages[StatusCode.ClientErrorNotFound])
    }
    res.setHeader("Content-Type", TextContentType)
    res.statusCode = StatusCode.ServerInternalError;
    return res.end(messages[StatusCode.ServerInternalError])
  }
}

const changeUser = (res: ServerResponse, users: Array<UserType>, user: string, id: string) => {
  try {
    const parsedUser = JSON.parse(user);
    const updatedUser = parsedUser?.id ? {...parsedUser} : {...parsedUser, id: id}
    const changedUser = tryChangeUser(users, updatedUser);
    res.statusCode = StatusCode.SuccessOK;
    res.setHeader("Content-Type", JsonContentType)
    return res.end(JSON.stringify(changedUser))
  } catch (e) {
    if (e instanceof BadRequestError) {
      res.setHeader("Content-Type", TextContentType)
      res.statusCode = StatusCode.ClientErrorBadRequest;
      return res.end(messages[StatusCode.ClientErrorBadRequest])
    } else if (e instanceof NotExistsError) {
      res.setHeader("Content-Type", TextContentType)
      res.statusCode = StatusCode.ClientErrorNotFound;
      return res.end(messages[StatusCode.ClientErrorNotFound])
    }
    res.setHeader("Content-Type", TextContentType)
    res.statusCode = StatusCode.ServerInternalError;
    return res.end(messages[StatusCode.ServerInternalError])
  }
}

const notExistingEndpoint = (res: ServerResponse) => {
  res.statusCode = StatusCode.ClientErrorNotFound;
  res.setHeader("Content-Type", TextContentType)
  return res.end("url doesn't exist")
}


export {getAllUsers, changeUser, delUser, addUser, getUser, notExistingEndpoint};


