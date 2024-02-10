export type UserType = {
  id: string;
  username: string;
  age: number;
  hobbies: Array<string>;
}

export type ValidationType = "notUUID" | "notExists"
