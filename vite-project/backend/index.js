const http = require("http");
const httpProxy = require("http-proxy");
const fs = require("fs");
const path = require('path');
require("dotenv").config();
const app = require("./app");
const port = process.env.PORT;

const options = {
  key: fs.readFileSync(path.join('SSL','server.key')),
  cert: fs.readFileSync(path.join('SSL','server.crt')),
  ca: fs.readFileSync(path.join('SSL','ca.crt')),
};




const server = http.createServer(app);

server.listen(port, () => {
  console.log("Server listening on port " + port);
});