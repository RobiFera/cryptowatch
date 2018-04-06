$(document).ready(function () {

    // Declare your website's ip
    const website = "http://127.0.0.1:8080";

    // Config
    const coinsLimit = 200;

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    // Arrays of all the currencies and symbolss
    const currencyArray = ["AUD", "BRL", "CAD", "CHF", "CLP", "CNY", "CZK", "DKK", "EUR", "GBP", "HKD", "HUF", "IDR", "ILS", "INR", "JPY", "KRW", "MXN", "MYR", "NOK", "NZD", "PHP", "PKR", "PLN", "RUB", "SEK", "SGD", "THB", "TRY", "TWD", "USD", "ZAR"]
    const currencySymbolArray = ["$", "R$", "$", "Fr. ", "$", "¥", "Kč", "kr. ", "€", "£", "$", "Ft ", "Rp ", "₪", "₹", "¥", "₩", "$", "RM", "kr ", "$", "₱", "₨ ", "zł", "₽", "kr ", "S$", "฿", "₺", "NT$", "$", "R "];

    // The default currency
    let defaultCurrency = currencyArray[8];

    // The chosen currency
    let currency = defaultCurrency;

    if(getCookie("selectedCurrency") !== ""){
        currency = getCookie("selectedCurrency");
    }

    // Get symbol based on the selected currency
    let currencySymbol = currencySymbolArray[currencyArray.indexOf(currency)];

    // Get a string based on the selected currency, so you can call the correct price data
    let currencyObject = "price_" + currency.toLowerCase();

    // Display the currencies
    for (let i = 0, currencyLength = currencyArray.length; i < currencyLength; i++) {
        $("#currency-" + (i + 1)).append("<a class=\"currencyChangeButton\">" + currencyArray[i] + "</a>");
    }
    $(".data-currency-display").append(currency);



    // Change currency
    $(".currencyChangeButton").click(function (data) {
        currency = data.currentTarget.text;
        currencySymbol = currencySymbolArray[currencyArray.indexOf(currency)];
        currencyObject = "price_" + currency.toLowerCase();
        $(".data-currency-display").empty().append(currency);

        // COOKIE
        let now = new Date(); // get the current date
        now.setFullYear(now.getFullYear() + 1); // add one year to it
        document.cookie = "selectedCurrency=" + currency + "; expires=" + now.toUTCString + "; path=/";

        // Get new data

        jsonApi = "https://api.coinmarketcap.com/v1/ticker/?convert=" + currency + "&limit=" + coinsLimit;

        // Update the Top list
        $.getJSON(jsonApi, function (topCoins) {

            for (let i = 0, topCoinsLength = topCoins.length; i < topCoinsLength; i++) {
                $("#topcoin-" + (i + 1)).empty().append("<b>" + (i + 1) + ".</b> <b class=\"topcoin-name\">" + "<a class=\"effect-underline\" href=\"/coins/" + topCoins[i].id + "\" >" + topCoins[i].name + "</b>" + "<a/>" + ": " + currencySymbol + parseFloat(topCoins[i][currencyObject]).toFixed(2));
            }

        });


    });




    // JSON API
    let jsonApi = "https://api.coinmarketcap.com/v1/ticker/?convert=" + currency + "&limit=" + coinsLimit;

    // Get the coins from Node and display the top 10 in order, assigning them the equivalent url. Example: BITCOIN = http://127.0.0.1:8080/coins/bitcoin
    $.getJSON(jsonApi, function (topCoins) {

        for (let i = 0, topCoinsLength = topCoins.length; i < topCoinsLength; i++) {
            $("#topcoin-" + (i + 1)).append("<b class=\"topcoin-name\">" + "<a class=\"effect-underline\" href=\"/coins/" + topCoins[i].id + "\" >" + topCoins[i].name + "</b>" + "<a/>" + ": " + currencySymbol + parseFloat(topCoins[i][currencyObject]).toFixed(2));
        }

    });

    // Get all the coins from Node
    $.getJSON(jsonApi, function (coinMarketCap) {
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

                    for (var i = 0; i < foundCoins.length; i++) {
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
        });
    });
});