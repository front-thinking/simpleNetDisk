process.env.NODE_ENV  = process.env.NODE_ENV || "development";
var config = require("./config/config");
config.basePath = __dirname;
var express = require("./config/express");
var app = express();
app.listen(3000);
module.exports = app;
console.log("Server running at http://localhost:3000.\n" + "using version: " + process.env.NODE_ENV);