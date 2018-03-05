$(document).ready(function () {

    let percent = parseFloat($("#percent-number").text());

    if (percent >= 0) {
        $("#percent").addClass("positive-percent");
    } else {
        $("#percent").addClass("negative-percent");
    }

});