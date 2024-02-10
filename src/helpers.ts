import {v4 as uuidv4} from 'uuid';
import {UserType} from "@/types.js";

export const generateUUID = () => uuidv4();

export const getUser = (users: Array<UserType>, id: string) => {
  let indFind = users.findIndex((_user) => {
    _user.id === id
  });
  if (indFind === -1) return false;
  return users[indFind];
};
export const deleteUser = (users: Array<UserType>, id: string) => {
  const newArrayUsers = users.filter(user => user.id !== id);
  return newArrayUsers.length === users.length ? false : newArrayUsers
};

export const addUser = (users: Array<UserType>, user: Omit<UserType, "id">) => {
  const newUser = {...user, id: generateUUID()};
  return [...users, newUser];
};

export const changeUser = (users: Array<UserType>, user: UserType) => {
  let indFind = users.findIndex((_user) => {
    _user.id === user.id
  });
  if (indFind === -1) return false;

  const changedUsers = [...users];
  changedUsers[indFind] = user;
  return changedUsers;
};
