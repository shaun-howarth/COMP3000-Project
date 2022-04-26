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
const { request } = require("http");

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


// EJS render page routes
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


// Viewing/displaying personnel user records from personnel db table
app.get("/home-table", (req, res) => {
    // MySQL query select statement grabbing to view "active" personnel users only with WHERE clause.
    db.query('SELECT * FROM personnel WHERE status ="active"', (err, rows) => {

        if(!err) {
            res.render("home-table.hbs", { rows });
        } else {
            console.log(err);
        }
        console.log("Data records from personnel table: \n",rows);
    });
});

// Finding personnel user by seacrh
app.post("/home-table", (req, res) => {
    let searchRecord = req.body.search;
    // MySQL query for search input box feature on home-table wep page.
    db.query('SELECT * FROM personnel WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchRecord + '%', '%' + searchRecord + '%'], (err, rows) => {

        if(!err) {
            res.render("home-table.hbs", { rows });
        } else {
            console.log(err);
        }
    });
});

app.get("/add-personnel", (req, res) => {
    res.render("add-personnel.hbs");
});

// Add new user/ personnel member
app.post("/add-personnel", (req, res) => {
    const { first_name, last_name, email, telephone, comments } = req.body;

    let searchRecord = req.body.search;
    // MySQL query for adding new personnel user record on home-table wep page.
    db.query('INSERT INTO personnel SET first_name = ?, last_name = ?, email = ?, telephone = ?, comments = ?', [first_name, last_name, email, telephone, comments], (err, rows) => {

        if(!err) {
            res.render("add-personnel.hbs", { alert: 'New personnel user added successfully!'});
        } else {
            console.log(err);
        }
    });
});

// Edit (view) personnel user record
app.get("/edit-personnel/:id", (req, res) => {
    // MySQL query for editing a personnel user record.
    db.query('SELECT * FROM personnel WHERE id = ?', [req.params.id], (err, rows) => {

        if(!err) {
            res.render("edit-personnel.hbs", { rows });
        } else {
            console.log(err);
        }
        console.log("Data records from personnel table: \n",rows);
    });
});