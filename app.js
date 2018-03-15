// Modules
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const request = require("request");
const exphbs = require("express-handlebars");
const http = require("http").Server(app);
const io = require("socket.io")(http);

// Config 
const currency = "EUR";
const currencySymbol = "€";
const limit = 200;
const port = 8080;

// Global variables
let apiData;
let coinData;
let coinDataPrice;
let coinDataPercentChange;
let liveCoinData = [];
let index = 0;
let coinId;

// BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Declare static files in public folder
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/cryptoicons'));

// View engine setup
app.set("views", __dirname + "/views");
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set("view engine", "handlebars");



// API SETUP

// Build the url
let apiDataUrl = "https://api.coinmarketcap.com/v1/ticker/?convert=" + currency + "&limit=" + limit;

// Get json data from url
request.get(apiDataUrl, (error, response, body) => {
    apiData = JSON.parse(body);
});

// Update data every 6 seconds / 10 requests per minute
setInterval(function () {
    request.get(apiDataUrl, (error, response, body) => {
        apiData = JSON.parse(body);
    });
    //console.log(apiData[1]);
}, 6000);

// Send data to frontend
app.get("/coindata/json", function (req, res) {
    res.json(apiData);
});



// Homepages
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

// If current url is "../coins/coinid" get the coinid and check if it's valid. If yes, redirect to the coin page, else go to the homepage.
app.get("/coins/:coinId", function (req, res) {

    // Declare variables
    coinId = req.params.coinId;

    // Search for the coin based on url
    for (let apiDataLength = apiData.length; index < apiDataLength; index++) {
        if (apiData[index].id == coinId) {
            coinData = apiData[index];
            break;
        };
    };

    // Redirect to homepage if coin is invalid
    if (!coinData) {
        res.redirect("/");
    } else {

        // Get the coin's price
        coinDataPrice = parseFloat(coinData.price_eur.replace(/\"/g, ""));
        if (coinDataPrice > 10) {
            coinDataPrice = coinDataPrice.toFixed(2).replace(".", ",");
        } else if (coinDataPrice > 1 && coinDataPrice < 10) {
            coinDataPrice = coinDataPrice.toFixed(3).replace(".", ",");
        } else {
            coinDataPrice = coinDataPrice.toFixed(5).replace(".", ",");
        }

        // Get percent change
        coinDataPercentChange = coinData.percent_change_24h.replace(/\"/g, "").replace(".", ",");
    }

    // Render the view engine
    res.render("coin", {
        currencySymbol: currencySymbol,
        coinDataPrice: coinDataPrice,
        currency: currency,
        coinDataPercentChange: coinDataPercentChange,
        coinDataName: coinData.name,
        coinDataSymbol: coinData.symbol,
    });
    
});

// Update coin data every 6 seconds / 10 requests per minute
io.on("connection", function(socket){

    console.log("A user as connected on " + coinId + "!")
        
    let interval = setInterval(function () {
        coinData = apiData[index];

        // Get the coin's price
        console.log(coinData);
        coinDataPrice = parseFloat(coinData.price_eur.replace(/\"/g, ""));
        if (coinDataPrice > 10) {
            coinDataPrice = coinDataPrice.toFixed(2).replace(".", ",");
        } else if (coinDataPrice > 1 && coinDataPrice < 10) {
            coinDataPrice = coinDataPrice.toFixed(3).replace(".", ",");
        } else {
            coinDataPrice = coinDataPrice.toFixed(5).replace(".", ",");
        }

        // Get percent change
        coinDataPercentChange = coinData.percent_change_24h.replace(/\"/g, "").replace(".", ",");

        let updatedCoinData = [coinDataPrice, coinDataPercentChange];
        socket.emit("userReady" + coinId, updatedCoinData);
        console.log(updatedCoinData);

    }, 6000);

    socket.on("disconnect", function() {
        console.log("A user as disconnected!");
        clearInterval(interval);
    });
    
});


// Redirect non-existing pages to homepage
app.get("*", function (req, res) {
    res.redirect("/");
});


// Listen on specified port
http.listen(port, () => console.log("Listening on port " + port + "!"));