const express = require("express");
const app = express();
const server = app.listen(8080);

app.set("view engine", "ejs");
app.use("/assets", express.static("assets"));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/help", (req, res) => {
    res.render("");
});