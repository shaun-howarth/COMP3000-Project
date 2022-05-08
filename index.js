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

// server port number
app.listen(4400, () => {
    console.log("Server started on Port 4400");
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


// Connection string/configuration to MySQL DB Schema: Local instance: linked to dotenv credentials file
const db = mysql.createConnection({
    host: process.env["DATABASE_HOST"],
    user: process.env["DATABASE_USER"],
    password: process.env["DATABASE_PASSWORD"],
    database: process.env["DATABASE"]
}); 

// db connect method to MySQL environment
db.connect((err) => {
    if(err) {
        console.log(err);
    } else {
    console.log('Connected to MySQL Database');
    }
});


// EJS render page routes/ API end point routes --------------------------------------

// Login page GET/login API end point route
app.get("/login", (req, res) => {
    res.render("login.ejs");
});

// User sign up page GET/user sign up  API end point route
app.get("/user-sign-up" , (req, res) => {
    res.render("user-sign-up.ejs");
});


// Index page GET"/" API end point route
app.get("/", (req, res) => {
    let userID = req.query.userID;
    let token = req.query.token;

    console.log(userID, token);
    // MySQL query select statement grabbing all rows from 'user_login' table to see if an existing login token matches
    // for currently logged in user session to view "index.ejs" page
    db.query("SELECT * FROM user_login WHERE userID = ? AND login_token = ?", [userID, token], (err, logins) => {
        db.query("SELECT * FROM users WHERE userID = ?", [userID], (error, user) => {
            let username = user[0]?.username;

            if(!empty(logins) && logins.length > 0) {
                res.render("index.ejs", { username:username });
            } else {
                res.render("login.ejs");
            }
        });
    });
});

// Help page GET/help API end point route
app.get("/help", (req, res) => {
    let userID = req.query.userID;
    let token = req.query.token;

    // MySQL query select statement grabbing all rows from 'user_login' table to see if an existing login token matches
    // for currently logged in user session to view "help.ejs" page
    db.query("SELECT * FROM user_login WHERE userID = ? AND login_token = ?", [userID, token], (err, logins) => {
        if(!empty(logins) && logins.length > 0) {
            res.render("help.ejs");
        } else {
            res.render("login.ejs");
        }
    });
});

// Setting page GET/settings API end point route
app.get("/settings" , (req, res) => {
    let userID = req.query.userID;
    let token = req.query.token;

    // MySQL query select statement grabbing all rows from 'user_login' table to see if an existing login token matches
    // for currently logged in user session to view "settings.ejs" page
    db.query("SELECT * FROM user_login WHERE userID = ? AND login_token = ?", [userID, token], (err, logins) => {
        if(!empty(logins) && logins.length > 0) {
            res.render("settings.ejs");
        } else {
            res.render("login.ejs");
        }
    });
});

// Kanban-board page GET/kanban-board API end point route
app.get("/kanban-board" , (req, res) => {
    let userID = req.query.userID;
    let token = req.query.token;

    // MySQL query select statement grabbing all rows from 'user_login' table to see if an existing login token matches
    // for currently logged in user session to view "kanban-board.ejs" page
    db.query("SELECT * FROM user_login WHERE userID = ? AND login_token = ?", [userID, token], (err, logins) => {
        if(!empty(logins) && logins.length > 0) {
            res.render("kanban-board.ejs");
        } else {
            res.render("login.ejs");
        }
    });
});

// User sign up POST/sign-up API end point route
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

// User login POST/login API end point route
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
                        res.render("index.ejs", { alert: 'It worked!', token: token, userID: rows[0].userID, username: rows[0].username });
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


// HBS render page routes/ API end point routes (Personnel Management Table) --------------------------------------


// Viewing/displaying all personnel user records (personnel db table) GET/home-table API end point route
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
                    let removedUser = req.query.removed;
                    res.render("home-table.hbs", { rows, removedUser });
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

// Finding personnel user by seacrh POST/home-table API end point route
app.post("/home-table", (req, res) => {
    let searchRecord = req.body.search;
    // MySQL query for search input box feature on home-table wep page.
    db.query('SELECT * FROM personnel WHERE status = "active" AND first_name LIKE ? OR last_name LIKE ?', ['%' + searchRecord + '%', '%' + searchRecord + '%'], (err, rows) => {

        if(!err) {
            let keys = Object.keys(rows);

            // Once the rows are returned from the DB, they are looped through to remove users who aren't active.
            for(let i = 0; i < keys.length; i++) {
                let index = keys[i];
                let user = rows[index];
                let status = user?.status;

                if(status !== "active") {
                    delete rows[index];
                } 
            }

            res.render("home-table.hbs", { rows });
        } else {
            console.log(err);
        }
    });
});

// Add personnel page GET/add-personnel API end point route
app.get("/add-personnel", (req, res) => {
    let userID = req.query.userID;
    let token = req.query.token;

    // MySQL query select statement grabbing all rows from 'user_login' table to see if an existing login token matches
    // for currently logged in user session to view "add-personnel.hbs" page
    db.query("SELECT * FROM user_login WHERE userID = ? AND login_token = ?", [userID, token], (err, logins) => {
        if(!empty(logins) && logins.length > 0) {
            res.render("add-personnel.hbs");
        } else {
            res.render("login.ejs");
        }
    });
});

// Add new personnel record POST/add-personnel API end point route
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

// Edit (view) personnel record GET/edit-personnel/:id API end point route
app.get("/edit-personnel/:id", (req, res) => {
    let userID = req.query.userID;
    let token = req.query.token;

    // MySQL query select statement grabbing all rows from 'user_login' table to see if an existing login token matches
    // for currently logged in user session to view "edit-personnel.hbs" page
    db.query("SELECT * FROM user_login WHERE userID = ? AND login_token = ?", [userID, token], (err, logins) => {
        if(!empty(logins) && logins.length > 0) {
            // MySQL query for editing a personnel user record.
            db.query('SELECT * FROM personnel WHERE id = ?', [req.params.id], (err, rows) => {

                if(!err) {
                    res.render("edit-personnel.hbs", { rows });
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

// Edit (update) personnel record POST/edit-personnel/:id API end point route
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

// Deleting personnel record from table GET/:id API end point route
app.get("/:id", (req, res) => {
    
    db.query('UPDATE personnel SET status = ? WHERE id = ?', ['deleted', req.params.id], (err, rows) => {

        if(!err) {
            let removedUser = encodeURIComponent('User successfully removed.');
            res.redirect("/home-table?removed=" + removedUser );
        } else { 
            console.log(err);
        }
        console.log("Record removed: \n",rows);
    });
});

// View single personnel record details GET/view-personnel/:id API end point route
app.get("/view-personnel/:id", (req, res) => {
    let userID = req.query.userID;
    let token = req.query.token;

    // MySQL query select statement grabbing all rows from 'user_login' table to see if an existing login token matches
    // for currently logged in user session to view "view-personnel.hbs" page
    db.query("SELECT * FROM user_login WHERE userID = ? AND login_token = ?", [userID, token], (err, logins) => {
        if(!empty(logins) && logins.length > 0) {
            // MySQL query select statement grabbing to view "active" personnel users only with WHERE clause.
            db.query('SELECT * FROM personnel WHERE id = ?', [req.params.id], (err, rows) => {

                if(!err) {
                    res.render("view-personnel.hbs", { rows });
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