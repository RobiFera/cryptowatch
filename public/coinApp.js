$(document).ready(function () {
    // Declare your website's ip
    const website = "http://127.0.0.1:8080";

    // Take the coin's ID
    const coinId = location.pathname.split('/').slice(-1)[0];

    // Config
    const currencySymbol = "€";
    const currency = "EUR";
    
    // JSON API
    let jsonApi = "https://api.coinmarketcap.com/v1/ticker/?convert=" + currency + "&limit=200";

    // Check if coins exists. If coin doesn't exists, redirect to homepage; if it does, display the data.
    $.getJSON(jsonApi, function (apiData) {

        // Variables
        let index = 0;
        let coinData;
        let NEWcoinDataPrice;
        let NEWcoinDataPercentChange;
        let coinDataPrice;
        let coinDataPercentChange;

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
        };


        // Take the coin's symbol
        let coinSymbol = $("#coin-symbol").html().replace(/\(/g, "").replace(/\)/g, "");

        // Take the coin's icon based on his symbol and display symbol by adding the class. https://github.com/AllienWorks/cryptocoins
        $(".cc").addClass(coinSymbol);


        // UPDATE DATA REAL-TIME
        setInterval(function () {

            $.getJSON(jsonApi, function (apiData) {

                // Get new data
                coinData = apiData[index];

                // Get the coin's price
                NEWcoinDataPrice = parseFloat(coinData.price_eur.replace(/\"/g, ""));
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
                        $("#coin-price").addClass("positive-change").animate({ color: "#ffffff" }, 10000);
                    } else {
                        $("#coin-price").addClass("negative-change").animate({ color: "#ffffff" }, 10000);
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

        }, 6000);

        // Color text in green if the percentage is positive, and in red if the percentage is negative
        if (coinDataPercentChange.replace(/,/g, '.') > 0) {
            $("#percent").addClass("positive-percent");
        } else {
            $("#percent").addClass("negative-percent");
        }

    });

});