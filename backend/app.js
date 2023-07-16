// app.js
const express = require("express");
const cors = require("cors");
const app = express();

const users = require("./router/user");


require("dotenv").config()

app.use(express.static("public"));



app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));
app.use(cors());
app.use("/api/users/", users);



module.exports = app;
