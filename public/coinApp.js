$(document).ready(function () {

    // Take the coin's id
    let coinId = $("#coin-id").html().replace(/\(/g, "").replace(/\)/g, "")

    // Take the coin's value change of the last 24 hours
    let percent = parseFloat($("#percent-number").text());

    // Color text in green if the percentage is positive, and in red if the percentage is negative
    if (percent >= 0) {
        $("#percent").addClass("positive-percent");
    } else {
        $("#percent").addClass("negative-percent");
    }

    // Take the coin's icon based on his id and display id by adding the class. https://github.com/AllienWorks/cryptocoins
    $(".cc").addClass(coinId);
});