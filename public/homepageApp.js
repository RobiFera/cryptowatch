$(document).ready(function () {

    // Declare your website's ip
    let website = "http://127.0.0.1:8080";
    
    // Get the Top 10 Coins and display them in order, assigning them the equivalent url. Example: BITCOIN = http://127.0.0.1:8080/coins/bitcoin
    $.getJSON("https://api.coinmarketcap.com/v1/ticker/?convert=EUR&limit=10", function (topCoins) {
        console.log(topCoins);
        $("#topcoin-1").append("<b class=\"topcoin-name\">" + "<a class=\"effect-underline\" href=\"/coins/" + topCoins[0].id + "\" >" + topCoins[0].name + "</b>" + "<a/>" + ": " + "€" + parseFloat(topCoins[0].price_eur).toFixed(2));
        $("#topcoin-2").append("<b class=\"topcoin-name\">" + "<a class=\"effect-underline\" href=\"/coins/" + topCoins[1].id + "\" >" + topCoins[1].name + "</b>" + "<a/>" + ": " + "€" + parseFloat(topCoins[1].price_eur).toFixed(2));
        $("#topcoin-3").append("<b class=\"topcoin-name\">" + "<a class=\"effect-underline\" href=\"/coins/" + topCoins[2].id + "\" >" + topCoins[2].name + "</b>" + "<a/>" + ": " + "€" + parseFloat(topCoins[2].price_eur).toFixed(2));
        $("#topcoin-4").append("<b class=\"topcoin-name\">" + "<a class=\"effect-underline\" href=\"/coins/" + topCoins[3].id + "\" >" + topCoins[3].name + "</b>" + "<a/>" + ": " + "€" + parseFloat(topCoins[3].price_eur).toFixed(2));
        $("#topcoin-5").append("<b class=\"topcoin-name\">" + "<a class=\"effect-underline\" href=\"/coins/" + topCoins[4].id + "\" >" + topCoins[4].name + "</b>" + "<a/>" + ": " + "€" + parseFloat(topCoins[4].price_eur).toFixed(2));
        $("#topcoin-6").append("<b class=\"topcoin-name\">" + "<a class=\"effect-underline\" href=\"/coins/" + topCoins[5].id + "\" >" + topCoins[5].name + "</b>" + "<a/>" + ": " + "€" + parseFloat(topCoins[5].price_eur).toFixed(2));
        $("#topcoin-7").append("<b class=\"topcoin-name\">" + "<a class=\"effect-underline\" href=\"/coins/" + topCoins[6].id + "\" >" + topCoins[6].name + "</b>" + "<a/>" + ": " + "€" + parseFloat(topCoins[6].price_eur).toFixed(2));
        $("#topcoin-8").append("<b class=\"topcoin-name\">" + "<a class=\"effect-underline\" href=\"/coins/" + topCoins[7].id + "\" >" + topCoins[7].name + "</b>" + "<a/>" + ": " + "€" + parseFloat(topCoins[7].price_eur).toFixed(2));
        $("#topcoin-9").append("<b class=\"topcoin-name\">" + "<a class=\"effect-underline\" href=\"/coins/" + topCoins[8].id + "\" >" + topCoins[8].name + "</b>" + "<a/>" + ": " + "€" + parseFloat(topCoins[8].price_eur).toFixed(2));
        $("#topcoin-10").append("<b class=\"topcoin-name\">" + "<a class=\"effect-underline\" href=\"/coins/" + topCoins[9].id + "\" >" + topCoins[9].name + "</b>" + "<a/>" + ": " + "€" + parseFloat(topCoins[9].price_eur).toFixed(2));
    });

    // Get all the coins, but not more than 200
    $.getJSON("https://api.coinmarketcap.com/v1/ticker/?convert=EUR&limit=200", function (coinMarketCap) {
        console.log(coinMarketCap);
        // When the form is submitted
        $(".main-form").submit(function (event) {
            //Check if coin exists
            event.preventDefault();
            function checkCoin(coin) {
                for (var i = 0; i < coinMarketCap.length; i++) {
                    if (coinMarketCap[i].id == coin.toLowerCase()) {
                        window.location.assign(website + "/coins/" + coinMarketCap[i].id);
                        return coinMarketCap[i].id;
                    } else if (coinMarketCap[i].name == coin) {
                        window.location.assign(website + "/coins/" + coinMarketCap[i].id);
                        return coinMarketCap[i].id;
                    } else if (coinMarketCap[i].symbol == coin.toUpperCase()) {
                        window.location.assign(website + "/coins/" + coinMarketCap[i].id);
                        return coinMarketCap[i].id;
                    }
                };
                //If it doesn't exist, throw the error message
                $(".error-message").css("visibility", "visible");
            };
            
            //Fire the checkCoin function, and store the coin in a variable called "coin"
            let coin = checkCoin($("#coin").val());
            console.log(coin);
        });
    });
});