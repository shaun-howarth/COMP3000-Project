const express = require("express");
const app = express();
const mysql = require("mysql");
const dotenv = require("dotenv");
const ejs = require("ejs");
const crypto = require("crypto");
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


// User Sign up API end point route
app.post("/sign-up" , (req, res) => {
    const {username, email, password} = req.body;
    // if username, email and password fields are empty: do nothing
    if (!empty(username) || !empty(email) || !empty(password)) {
        // MySQL query to isnsert given input field values into 'users' table to create registering user
        db.query('INSERT INTO users SET username = ?, email = ?, password = ?', [username, email, password], (err) => {
            if(!err) {
                res.render("login.ejs", { alert: '!'});
            } else {
                console.log(err);
            }
        });
    }
});

//Login API end point route
app.post("/login" , (req, res) => {
    const {username, password} = req.body;
    // if username and email fields are empty: do nothing
    if (!empty(username) || !empty(email)) {
        // MySQL query to select userID, username & password if current username exists with correct password
        db.query('SELECT userID, username, password FROM users WHERE username = ?', [username], (err, rows) => {
            if(!err) {
                // if the password entered matches the correct exisiting password for a username
                // then assign a session/login token into the user_login table for that userID
                if (rows[0]?.password === password) {
                    // crypto bytes token string being assigned to "token" variable
                    let token = crypto.randomBytes(16).toString("hex");
                    
                    // MySQL query to insert 'userID' & it's 'login_token' into a session row in the 'user_login' table.
                    db.query("INSERT INTO user_login SET userID = ?, login_token = ?", [rows[0].userID, token], (err) => {
                        if(err) {
                            console.log(err);
                            return;
                        }
                        // Landing page to render and display if login is correct and successful
                        res.render("index.ejs", { alert: 'It worked!', token: token, userID: rows[0].userID });
                    });
                } else {
                    res.render("login.ejs", { alert: '!'});
                }
            } else {
                console.log(err);
            }
        });
    }
});

// String function used to represent if string 'value' === empty, null or undefined. Used for representing
// users table fields above
function empty(string) {
    return (string === "" || string === null || string === undefined || string === "undefined");
}



//--------------------------------------------------------------------------------------------------


// Viewing/displaying all personnel user records (personnel db table)
app.get("/home-table", (req, res) => {
    let userID = req.query.userID;
    let token = req.query.token;

    // MySQL query select statement grabbing all rows from 'user_login' table to see if an existing login token matches
    // for currently logged in user session to view "home-table.hbs" page
    db.query("SELECT * FROM user_login WHERE userID = ? AND login_token = ?", [userID, token], (err, logins) => {
        if(!empty(logins) && logins.length > 0) {
            // MySQL query select statement grabbing to view "active" personnel users only with WHERE clause.
            db.query('SELECT * FROM personnel WHERE status ="active"', (err, rows) => {

                if(!err) {
                    res.render("home-table.hbs", { rows });
                } else {
                    console.log(err);
                }
                console.log("Data records from personnel table: \n",rows);
            });
        } else {
            res.render("login.ejs");
        }
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

// Add new user/ personnel member record
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

// Edit (view user) personnel user record
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


// Edit (update user) personnel user record
app.post("/edit-personnel/:id", (req, res) => {
    const { first_name, last_name, email, telephone, comments } = req.body;
    // MySQL query for editing a personnel user record.
    db.query('UPDATE personnel SET first_name = ?, last_name = ?, email = ?, telephone = ?, comments = ?  WHERE id = ?', [first_name, last_name, email, telephone, comments, req.params.id], (err, rows) => {

        if(!err) {
            db.query('SELECT * FROM personnel WHERE id = ?', [req.params.id], (err, rows) => {

                if(!err) {
                    res.render("edit-personnel.hbs", { rows, alert: `${first_name} has been updated.` });
                } else {
                    console.log(err);
                }
                console.log("Data records from personnel table: \n",rows);
            });
        } else {
            console.log(err);
        }
        console.log("Data records from personnel table: \n",rows);
    });
});

// Deleteing pesonnel record from table
app.get("/:id", (req, res) => {
    
    db.query('UPDATE personnel SET status = ? WHERE id = ?', ['deleted', req.params.id], (err, rows) => {

        if(!err) {
            res.redirect("/home-table");
        } else {
            console.log(err);
        }
        console.log("Record removed: \n",rows);
    });
});

// View single pesonnel record details
app.get("/view-personnel/:id", (req, res) => {
    // MySQL query select statement grabbing to view "active" personnel users only with WHERE clause.
    db.query('SELECT * FROM personnel WHERE id = ?', [req.params.id], (err, rows) => {

        if(!err) {
            res.render("view-personnel.hbs", { rows });
        } else {
            console.log(err);
        }
        console.log("Data records from personnel table: \n",rows);
    });
});