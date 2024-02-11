import * as http from "http";
import {config} from "dotenv";
import * as process from "process";
import {UserType} from "./types.js";
import {addUser, changeUser, delUser, getAllUsers, getUser, notExistingEndpoint} from "./helpers.js";
import * as urlModule from "url";

config();
const users: Array<UserType> = [];

http
  .createServer(function (req, res) {
    const {url, method} = req;
    let parsedURL = urlModule.parse(url, true).pathname.split('/');
    if (parsedURL[parsedURL.length - 1] === "") {
      parsedURL.pop();
    }
    console.log(":>", method, url, parsedURL)

    if (method === "GET" && parsedURL.length === 3 && (parsedURL[1] + "-" + parsedURL[2]) === "api-users") {
      return getAllUsers(res, users);
    } else if (method === "POST" && parsedURL.length === 3 && (parsedURL[1] + "-" + parsedURL[2]) === "api-users") {
      let data = "";
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        return addUser(res, users, data);
      });
      return;
    } else if (method === "DELETE" && parsedURL.length === 4 && (parsedURL[1] + "-" + parsedURL[2]) === "api-users") {
      return delUser(res, users, parsedURL[3])
    } else if (method === "GET" && parsedURL.length === 4 && (parsedURL[1] + "-" + parsedURL[2]) === "api-users") {
      return getUser(res, users, parsedURL[3])
    } else if (method === "PUT" && parsedURL.length === 4 && (parsedURL[1] + "-" + parsedURL[2]) === "api-users") {
      let data = "";
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        return changeUser(res, users, data, parsedURL[3]);
      });
      return;
    } else {
      return notExistingEndpoint(res);
    }
  })
  .listen(process.env.PORT);