// Modules
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const request = require("request");
const exphbs = require("express-handlebars");

//Config 
let currency = "EUR";
let currencySymbol = "€";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Declare static files in public folder
app.use(express.static(__dirname + '/public'));

// View engine setup
app.set("views", __dirname + "/views");
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set("view engine", "handlebars");

// Homepage
app.get("/", (req, res) => res.sendFile(__dirname + "/public/index.html"));

// If current url is "../coins/coinid" get the coinid and check if it's valid. If yes, redirect to the coin page, else go to the homepage.
app.get("/coins/:coinId", function (req, res) {
    let coinId = req.params.coinId;
    let coinDataUrl = "https://api.coinmarketcap.com/v1/ticker/" + coinId + "/?convert=" + currency;

    request.get(coinDataUrl, (error, response, body) => {
        let coinData = JSON.parse(body)[0];
        console.log(coinData);
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
            let coinDataPercentChange = coinData.percent_change_24h.replace(/\"/g, "").replace(".", ",");

            // Render the view engine
            res.render("coin", {
                currencySymbol: currencySymbol,
                coinDataPrice: coinDataPrice,
                currency: currency,
                coinDataPercentChange: coinDataPercentChange,
                coinDataName: coinData.name,
                coinDataSymbol: coinData.symbol,
            });

        }

    });
    console.log(coinId);
});


// Redirect non-existing pages to homepage
app.get("*", function (req, res) {
    res.redirect("/");
});

// LISTEN ON PORT 8080
app.listen(8080, () => console.log("Listening on port 8080!"));