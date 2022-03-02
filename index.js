const express = require("express");
const app = express();
const mysql = require("mysql");
const server = app.listen(8080);

// EJS app view engine: for express api
app.set("view engine", "ejs");
app.use("/assets", express.static("assets"));

// creating connection string to MySQL DB Schema

//const db = mysql.createConnection({
//properties
    //host: 'localhost',
   // user: 'root',
   // password: '',
    //database: ''
//});

// db connect method to MySQL environment
//db.connect((err) => {
    //if(err) {
        //throw err;
    //}
   //console.log('Connected to MySQL Database');
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