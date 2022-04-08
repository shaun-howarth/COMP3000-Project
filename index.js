const express = require("express");
const app = express();
const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config({ path: './.env'});



// EJS app view engine: for express api
app.set("view engine", "ejs");
app.use("/assets", express.static("assets"));

// creating connection string to MySQL DB Schema: Local instance

//const db = mysql.createConnection({
    //host: process.env["DATABASE_HOST"],
    //user: process.env["DATABASE_USER"],
    //password: process.env["DATABASE_PASSWORD"],
    //database: process.env["DATABASE"]
//}) 

//db connect method to MySQL environment
//db.connect((err) => {
    //if(err) {
        //console.log(err);
   // } //else {
    //console.log('Connected to MySQL Database');
    //}
//});

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/help", (req, res) => {
    res.render("help");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/settings" , (req, res) => {
    res.render("settings");
});

app.get("/kanban-board" , (req, res) => {
    res.render("kanban-board");
});

app.get("/user-sign-up" , (req, res) => {
    res.render("user-sign-up");
});

app.listen(3000, () => {
    console.log("Server started on Port 3000")
}); 