function displayScrape() {
    $getJson("/scrape", function (scrape_code) {
        if (scrape_code.code == "success") {
            $getJson("/articles", function (data) {
                $("nyt-0").empty();
                $("nyt-1").empty();
                $("nyt-2").empty();
                $("total-number").text(data.length);
                for (let i = 0; i < data.length) {


                }
            });
        }
    });
}
$(document).ready(
    function () {
        $('slider').slider();
        $('button-collapse').sideNav();
        $(',modal').modal();

    });