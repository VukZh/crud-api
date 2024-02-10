import * as http from "http";
import {config} from "dotenv";
import * as process from "process";

config();

http
  .createServer(function (req, res) {
    res.write("CRUD API");
    res.end();
  })
  .listen(process.env.PORT);