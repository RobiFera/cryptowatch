$(document).ready(function () {
    // Declare your website's ip
    const website = "http://127.0.0.1:8080";

    // Take the coin's ID
    const coinId = location.pathname.split('/').slice(-1)[0];

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


    // Arrays of all the currencies and symbols
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




    // JSON API
    let jsonApi = "https://api.coinmarketcap.com/v1/ticker/?convert=" + currency + "&limit=" + coinsLimit;

    // Check if coins exists. If coin doesn't exists, redirect to homepage; if it does, display the data.
    $.getJSON(jsonApi, function (apiData) {



        // Variables
        let index = 0;
        let coinData;
        let NEWcoinDataPrice;
        let NEWcoinDataPercentChange;
        let coinDataPrice;
        let coinDataPercentChange;
        let supply = [];

        // Check for coin based by id in the url
        for (let apiDataLength = apiData.length; index < apiDataLength; index++) {
            if (apiData[index].id == coinId) {
                coinData = apiData[index];
                break;
            };
        };
        // Redirect to homepage if coin is invalid
        if (!coinData) {
            window.location.replace(website);
        } else {

            // Get the coin's price
            coinDataPrice = parseFloat(coinData[currencyObject].replace(/\"/g, ""));
            if (coinDataPrice > 10) {
                coinDataPrice = coinDataPrice.toFixed(2).replace(".", ",");
            } else if (coinDataPrice > 1 && coinDataPrice < 10) {
                coinDataPrice = coinDataPrice.toFixed(3).replace(".", ",");
            } else {
                coinDataPrice = coinDataPrice.toFixed(5).replace(".", ",");
            }

            // Get percent change
            coinDataPercentChange = coinData.percent_change_24h.replace(/\"/g, "").replace(".", ",");

            // Get max supply and circulating supply
            supply.push(Math.round(coinData.available_supply), Math.round(coinData.max_supply));

            // Display data

            //Name
            $("#coin-data-name").html(coinData.name);
            //Coin symbol
            $("#coin-symbol").html("(" + coinData.symbol + ")");
            //Currency symbol
            $("#currency-symbol").html(currencySymbol);
            //Coin price
            $("#coin-price").html(coinDataPrice);
            //Currency
            $("#currency").html(currency);
            //Percent change
            $("#percent-number").html(coinDataPercentChange);
            //Circulating Supply
            $("#circulating-supply").html(supply[0].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " " + coinData.symbol);
            //Max Supply
            $("#max-supply").html(supply[1].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " " + coinData.symbol );
        };


        // Take the coin's symbol
        let coinSymbol = $("#coin-symbol").html().replace(/\(/g, "").replace(/\)/g, "");

        // Take the coin's icon based on his symbol and display symbol by adding the class. https://github.com/AllienWorks/cryptocoins
        $(".cc").addClass(coinSymbol);

        // Color text in green if the percentage is positive, and in red if the percentage is negative
        if (coinDataPercentChange.replace(/,/g, '.') > 0) {
            $("#percent").addClass("positive-percent");
        } else {
            $("#percent").addClass("negative-percent");
        }

    });


    // UPDATE DATA REAL-TIME
    let updateData = function() {

        $.getJSON(jsonApi, function (apiData) {

            // Variables
            let index = 0;
            let coinData;
            let NEWcoinDataPrice;
            let NEWcoinDataPercentChange;
            let coinDataPrice = $("#coin-price").html();
            let coinDataPercentChange = $("#percent-number").html();

            // Check for coin based by id in the url
            for (let apiDataLength = apiData.length; index < apiDataLength; index++) {
                if (apiData[index].id == coinId) {
                    coinData = apiData[index];
                    break;
                };
            };
            
            // Get the coin's price
            NEWcoinDataPrice = parseFloat(coinData[currencyObject].replace(/\"/g, ""));
            if (NEWcoinDataPrice > 10) {
                NEWcoinDataPrice = NEWcoinDataPrice.toFixed(2).replace(".", ",");
            } else if (NEWcoinDataPrice > 1 && NEWcoinDataPrice < 10) {
                NEWcoinDataPrice = NEWcoinDataPrice.toFixed(3).replace(".", ",");
            } else {
                NEWcoinDataPrice = NEWcoinDataPrice.toFixed(5).replace(".", ",");
            }

            // Get percent change
            NEWcoinDataPercentChange = coinData.percent_change_24h.replace(/\"/g, "").replace(".", ",");


            // Display data

            //Coin price
            if (NEWcoinDataPrice !== coinDataPrice) {

                // Color effects when the price changes
                if (NEWcoinDataPrice > coinDataPrice) {
                    $("#coin-price").css("color", "#10ff00");
                    $("#coin-price").animate({ color: "#ffffff" }, 5900);
                    var priceColorChangePositive = setInterval(function () {
                        $("#coin-price").stop();
                    }, 5900);
                    clearInterval(priceColorChangePositive);
                } else {
                    $("#coin-price").css("color", "#ff0000");
                    $("#coin-price").animate({ color: "#ffffff" }, 5900);
                    var priceColorChangeNegative = setInterval(function () {
                        $("#coin-price").stop();
                    }, 5900);
                    clearInterval(priceColorChangeNegative);
                }
                $("#coin-price").html(NEWcoinDataPrice);
                coinDataPrice = NEWcoinDataPrice;
            }

            //Percent change
            if (NEWcoinDataPercentChange !== coinDataPercentChange) {
                $("#percent-number").html(NEWcoinDataPercentChange);
                coinDataPercentChange = NEWcoinDataPercentChange;
            }

            // Color text in green if the percentage is positive, and in red if the percentage is negative
            if (coinDataPercentChange.replace(/,/g, '.') > 0) {
                $("#percent").addClass("positive-percent");
            } else {
                $("#percent").addClass("negative-percent");
            }
            
            console.log(NEWcoinDataPrice);

        });

    };

    // Start real time update
    let realTime = setInterval(updateData, 6000);



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


        // JSON API
        jsonApi = "https://api.coinmarketcap.com/v1/ticker/?convert=" + currency + "&limit=" + coinsLimit;

        $.getJSON(jsonApi, function (apiData) {
        
            // Variables
            let index2 = 0;
            let coinData;
            let coinDataPrice;

            // Check for coin based by id in the url
            for (let apiDataLength = apiData.length; index2 < apiDataLength; index2++) {
                if (apiData[index2].id == coinId) {
                    coinData = apiData[index2];
                    break;
                };
            };

            // Get the coin's price
            coinDataPrice = parseFloat(coinData[currencyObject].replace(/\"/g, ""));
            if (coinDataPrice > 10) {
                coinDataPrice = coinDataPrice.toFixed(2).replace(".", ",");
            } else if (coinDataPrice > 1 && coinDataPrice < 10) {
                coinDataPrice = coinDataPrice.toFixed(3).replace(".", ",");
            } else {
                coinDataPrice = coinDataPrice.toFixed(5).replace(".", ",");
            }


            // Display Data
            
            //Currency symbol
            $("#currency-symbol").html(currencySymbol);
            //Coin price
            $("#coin-price").html(coinDataPrice);
            //Currency
            $("#currency").html(currency);
        
        // Restart real time update
            clearInterval(realTime);
        });
        realTime = setInterval(updateData, 6000);
    });


    
});