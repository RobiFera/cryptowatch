$(document).ready(function () {

    // Declare your website's ip
    const website = "http://127.0.0.1:8080";



    // Config

    // Arrays of all the currencies and symbols
    const currencyArray = ["AUD", "BRL", "CAD", "CHF", "CLP", "CNY", "CZK", "DKK", "EUR", "GBP", "HKD", "HUF", "IDR", "ILS", "INR", "JPY", "KRW", "MXN", "MYR", "NOK", "NZD", "PHP", "PKR", "PLN", "RUB", "SEK", "SGD", "THB", "TRY", "TWD", "ZAR"]
    const currencySymbolArray = ["$", "R$", "$", "Fr. ", "$", "¥", "Kč", "kr. ", "€", "£", "$", "Ft ", "Rp ", "₪", "₹", "¥", "₩", "$", "RM", "kr ", "$", "₱", "₨ ", "zł", "₽", "kr ", "S$", "฿", "₺", "NT$", "R "];

    // The default currency that is already selected
    const currencyDefault = currencyArray[8];

    // The chosen currency
    const currency = currencyDefault

    // Get symbol based on the selected currency
    const currencySymbol = currencySymbolArray[currencyArray.indexOf(currency)];

    // Get a string based on the selected currency, so you can call the correct price data
    const currencyObject = "price_" + currency.toLowerCase();



    // JSON API
    let jsonApi = "https://api.coinmarketcap.com/v1/ticker/?convert=" + currency + "&limit=200";

    // Get the coins from Node and display the top 10 in order, assigning them the equivalent url. Example: BITCOIN = http://127.0.0.1:8080/coins/bitcoin
    $.getJSON(jsonApi, function (topCoins) {
        console.log(topCoins);
        $("#topcoin-1").append("<b class=\"topcoin-name\">" + "<a class=\"effect-underline\" href=\"/coins/" + topCoins[0].id + "\" >" + topCoins[0].name + "</b>" + "<a/>" + ": " + currencySymbol + parseFloat(topCoins[0][currencyObject]).toFixed(2));
        $("#topcoin-2").append("<b class=\"topcoin-name\">" + "<a class=\"effect-underline\" href=\"/coins/" + topCoins[1].id + "\" >" + topCoins[1].name + "</b>" + "<a/>" + ": " + currencySymbol + parseFloat(topCoins[1][currencyObject]).toFixed(2));
        $("#topcoin-3").append("<b class=\"topcoin-name\">" + "<a class=\"effect-underline\" href=\"/coins/" + topCoins[2].id + "\" >" + topCoins[2].name + "</b>" + "<a/>" + ": " + currencySymbol + parseFloat(topCoins[2][currencyObject]).toFixed(2));
        $("#topcoin-4").append("<b class=\"topcoin-name\">" + "<a class=\"effect-underline\" href=\"/coins/" + topCoins[3].id + "\" >" + topCoins[3].name + "</b>" + "<a/>" + ": " + currencySymbol + parseFloat(topCoins[3][currencyObject]).toFixed(2));
        $("#topcoin-5").append("<b class=\"topcoin-name\">" + "<a class=\"effect-underline\" href=\"/coins/" + topCoins[4].id + "\" >" + topCoins[4].name + "</b>" + "<a/>" + ": " + currencySymbol + parseFloat(topCoins[4][currencyObject]).toFixed(2));
        $("#topcoin-6").append("<b class=\"topcoin-name\">" + "<a class=\"effect-underline\" href=\"/coins/" + topCoins[5].id + "\" >" + topCoins[5].name + "</b>" + "<a/>" + ": " + currencySymbol + parseFloat(topCoins[5][currencyObject]).toFixed(2));
        $("#topcoin-7").append("<b class=\"topcoin-name\">" + "<a class=\"effect-underline\" href=\"/coins/" + topCoins[6].id + "\" >" + topCoins[6].name + "</b>" + "<a/>" + ": " + currencySymbol + parseFloat(topCoins[6][currencyObject]).toFixed(2));
        $("#topcoin-8").append("<b class=\"topcoin-name\">" + "<a class=\"effect-underline\" href=\"/coins/" + topCoins[7].id + "\" >" + topCoins[7].name + "</b>" + "<a/>" + ": " + currencySymbol + parseFloat(topCoins[7][currencyObject]).toFixed(2));
        $("#topcoin-9").append("<b class=\"topcoin-name\">" + "<a class=\"effect-underline\" href=\"/coins/" + topCoins[8].id + "\" >" + topCoins[8].name + "</b>" + "<a/>" + ": " + currencySymbol + parseFloat(topCoins[8][currencyObject]).toFixed(2));
        $("#topcoin-10").append("<b class=\"topcoin-name\">" + "<a class=\"effect-underline\" href=\"/coins/" + topCoins[9].id + "\" >" + topCoins[9].name + "</b>" + "<a/>" + ": " + currencySymbol + parseFloat(topCoins[9][currencyObject]).toFixed(2));
    });

    // Get all the coins from Node
    $.getJSON(jsonApi, function (coinMarketCap) {
        console.log(coinMarketCap);
        // When the form is submitted
        $(".main-form").submit(function (event) {
            let startTime = performance.now();
            // Delete the previous results
            $("#search-results").empty();

            // Check if coin exists
            event.preventDefault();
            function checkCoin(coin) {
                let foundCoins = [];
                for (var i = 0; i < coinMarketCap.length; i++) {
                    /* if (coinMarketCap[i].id == coin.toLowerCase()) {
                        window.location.assign(website + "/coins/" + coinMarketCap[i].id);
                     if (coinMarketCap[i].name == coin) {
                        window.location.assign(website + "/coins/" + coinMarketCap[i].id);
                        return coinMarketCap[i].id; */
                     if (coinMarketCap[i].symbol == coin.toUpperCase()) {
                        window.location.assign(website + "/coins/" + coinMarketCap[i].id);
                        return coinMarketCap[i].id;

                    // Search engine
                    } else {
                        if (coinMarketCap[i].id.search(coin.toLowerCase()) !== -1) {
                            foundCoins.push(coinMarketCap[i].id);
                        }
                    }
                };

                // If only a coin was found, redirect to its page directly
                if (foundCoins.length == 1) {
                    window.location.assign(website + "/coins/" + foundCoins[0]);
                    return coinMarketCap[i].id;
                
                // If more coins were found, show the results
                } else if (foundCoins.length > 1) {
                    
                    $(".coins-table").hide();
                    $("#search").css("visibility", "visible");
                    $("#search-info").css("visibility", "visible");

                    for(var i = 0; i < foundCoins.length; i++) {
                        $("#search-results").append("<p class=\"text-info\">" + "<a class=\"effect-underline\" href=\"/coins/" + foundCoins[i] + "\" >" + foundCoins[i] + "</a></p>");
                    }

                    $("#search-info-text").html((foundCoins.length) + " coins found (" + ((performance.now() - startTime) / 1000).toFixed(4) + " seconds)");
                    return foundCoins;

                // If no coins were found, throw the error message
                } else {
                    $(".error-message").css("visibility", "visible");
                    return null;
                }
            };

            // Fire the checkCoin function, and store the coin in a variable called "coin"
            let coin = checkCoin($("#coin").val());
            console.log(coin);
        });
    });
});