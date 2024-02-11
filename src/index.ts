import * as http from "http";
import {config} from "dotenv";
import * as process from "process";
import {UserType} from "./types.js";
import {addUser, getAllUsers} from "./helpers.js";

config();
const users: Array<UserType> = [];

http
  .createServer(function (req, res) {
    const {url, method} = req;
    const requestCase = method + "-" + url;
    console.log(":>", method, url, requestCase)

    switch (requestCase) {
      case "GET-/api/users":
        console.log("aaaaaaaaaaaaaaaa1")
        return getAllUsers(res, users);
      case "POST-/api/users":
        let data = "";
        req.on('data', (chunk) => {
          data += chunk;
        });
        console.log("aaaaaaaaaaaaaaaa2", data)
        req.on('end', () => {
          return addUser(res, users, data);
        });
        return;
      default:
        console.log("endddddddddddd")
    }

    res.write("CRUD API");
    res.end();
  })
  .listen(process.env.PORT);