// Modules
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const request = require("request");
const http = require("http").Server(app);

// Config 
const currency = "EUR";
const limit = 200;
const port = 8080;

// Global variables
let apiData;

// BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Declare static files in public folder
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/cryptoicons'));



// -- ROUTES --

// Homepages
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

// Coin page
app.get("/coins/:coinId", function (req, res) {

    res.sendFile(__dirname + "/public/coin.html")
    
});

// Redirect non-existing pages to homepage
app.get("*", function (req, res) {
    res.redirect("/");
});

// -- END ROUTES --



// Listen on specified port
http.listen(port, () => console.log("Listening on port " + port + "!"));