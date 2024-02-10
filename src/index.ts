import * as http from "http";
import {config} from "dotenv";
import * as process from "process";
import {UserType} from "@/types.js";

config();
const users: Array<UserType> = [];

http
  .createServer(function (req, res) {
    const {statusCode, method} = req;
    console.log(":>", method, statusCode)
    res.write("CRUD API");
    res.end();
  })
  .listen(process.env.PORT);