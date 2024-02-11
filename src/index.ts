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
    console.log(":>", method, url)

    const requestCase = method + "-" + url;

    switch (requestCase) {
      case "GET-api/users":
        getAllUsers(res, users);
        break;
      case "POST-api/users":
        let data = "";
        req.on('data', (chunk) => {
          data += chunk;
        });
        req.on('end', () => {
          addUser(res, users, data);
        });
        break;
    }

    res.write("CRUD API");
    res.end();
  })
  .listen(process.env.PORT);