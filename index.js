const express = require("express");
const app = express();
const mysql = require("mysql");
const server = app.listen(8080);

// EJS app view engine: for express api
app.set("view engine", "ejs");
app.use("/assets", express.static("assets"));

// Creating connection to MySQL DB Schema

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/help", (req, res) => {
    res.render("help");
});