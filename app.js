// Modules
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const request = require("request");
const exphbs = require("express-handlebars");
const http = require("http").Server(app);
const io = require("socket.io")(http);

// Config 
let currency = "EUR";
let currencySymbol = "€";
let limit = 200;
let port = 8080;

// Global variable
let apiData;

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
let apiDataUrl = "https://api.coinmarketcap.com/v1/ticker/?convert=" + currency + "&limit=" + limit;
// Get json data
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
app.get("/coindata/json", function(req, res) {
    res.json(apiData);
});


// Homepages
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
}); 

// If current url is "../coins/coinid" get the coinid and check if it's valid. If yes, redirect to the coin page, else go to the homepage.
app.get("/coins/:coinId", function (req, res) {

    // Declare variables
    let coinId = req.params.coinId;
    let coinData;
    let coinDataPrice;
    let coinDataPercentChange;

    // Search for the coin based on url
    for (var i = 0, apiDataLength = apiData.length; i < apiDataLength; i++) {
        if (apiData[i].id == coinId) {
            coinData = apiData[i];
        };
    };

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


// Redirect non-existing pages to homepage
app.get("*", function (req, res) {
    res.redirect("/");
});


io.on("connection", function () {
    console.log("A user connected!");
});


// LISTEN ON PORT 8080
http.listen(8080, () => console.log("Listening on port 8080!"));