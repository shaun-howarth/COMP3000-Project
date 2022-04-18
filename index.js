const express = require("express");
const app = express();
const mysql = require("mysql");
const dotenv = require("dotenv");
const ejs = require("ejs");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const res = require("express/lib/response");
dotenv.config({ path: './.env'});

app.listen(4000, () => {
    console.log("Server started on Port 4000");
});

let engines = require("consolidate");

//TEMPLATING ENGINES FOR EXPRESS API

// ejs template engine
app.set("view engine", "ejs");
// handlebars template engine
// setting extension name for handlebars (files) "hbs"
const handlebars = exphbs.create({ extname: ".hbs",});
app.engine(".hbs", handlebars.engine);
app.set("view engine", ".hbs");


// static files location
app.use("/assets", express.static("assets"));

// parsing middleware for data
// parsing app for personnel table
app.use(bodyParser.urlencoded({extended: false}));

// parse application using JSON
app.use(bodyParser.json());


// creating connection pool to MySQL DB Schema: Local instance
const db = mysql.createConnection({
    host: process.env["DATABASE_HOST"],
    user: process.env["DATABASE_USER"],
    password: process.env["DATABASE_PASSWORD"],
    database: process.env["DATABASE"]
}); 

//db getConnection method to MySQL environment
db.connect((err) => {
    if(err) {
        console.log(err);
    } else {
    console.log('Connected to MySQL Database');
    }
});




// ejs render page routes
app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/help", (req, res) => {
    res.render("help.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/settings" , (req, res) => {
    res.render("settings.ejs");
});

app.get("/kanban-board" , (req, res) => {
    res.render("kanban-board.ejs");
});

app.get("/user-sign-up" , (req, res) => {
    res.render("user-sign-up.ejs");
});

// handlebars (hbs) page routes
//const routes = require("./server/routes/personnel");
//app.use("/home-table", routes);


// view user records from personnel db table
app.get("/home-table", (req, res) => {
    // MySQL query select statement grabbing to view active users only with WHERE clause
    db.query('SELECT * FROM personnel WHERE status ="active"', (err, rows) => {

        if(!err) {
            res.render("home-table.hbs", { rows });
        } else {
            console.log(err);
        }
        console.log("Data records from personnel table: \n",rows);
    });
});

// finding personnel user by seacrh
app.post("/home-table", (req, res) => {

    let searchRecord = req.body.search;

    // MySQL query
    db.query('SELECT * FROM personnel WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchRecord + '%', '%' + searchRecord + '%'], (err, rows) => {

        if(!err) {
            res.render("home-table.hbs", { rows });
        } else {
            console.log(err);
        }
        console.log("Data records from personnel table: \n",rows);
    });

});

