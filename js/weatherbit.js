$(document).ready(function() {
        $("#calendar-input").daterangepicker();
    $("#search-btn").on("click", function () {

        // Necessary variables for weather
        console.log("City: " + $("#cityId").val());
        console.log("Country: " + $("#countryId").val());
        console.log("Start Date: " + $("#calendar-input").daterangepicker().val().split("-")[0].trim());
        console.log("End Date: " + $("#calendar-input").daterangepicker().val().split("-")[1].trim());
        console.log("Moment Start Date: " + moment($("#calendar-input").daterangepicker().val().split("-")[0].trim());
        console.log("Moment End Date: " + moment($("#calendar-input").daterangepicker().val().split("-")[1].trim()));

        var city = $("#cityId").val();
        var country = $("#countryId").val();
        var start_date = moment($("#calendar-input").daterangepicker().val().split("-")[0].trim());
        var end_date = moment($("#calendar-input").daterangepicker().val().split("-")[1].trim());

        // Only get up to 16 days forecast, otherwise goes back a year
        var prediction = "forecast";
        var curr_date = moment();
        if ((curr_date.diff(end_date,"days") >= 16) && end_date.isAfter(curr_date)) { 
            prediction = "history";
            start_date = start_date.subtract(1,"years");
            end_date = end_date.subtract(1,"years");
        }

        // Populate date array which holds range of dates
        var date_arr = [];
        var date_range = start_date.diff(end_date,"days");
        for (let i = 0; i < date_range; ++i) {
            date_arr[i] = start_date.add(1,"days");
        }

        // Check if country is US
        if (country === "US") {
            var is_US_state = true;
            var state = $("#stateId").val();
        } else {
            var is_US_state = false;
        }

        // This is our weather bit API key
        var APIKey = "5887b8d504574dffbe86fb6dfad4bd60";

        // DO NOT Run this repeatedly, API only allows a finite number of calls for weather data !!
        for (let i = 0; i < date_arr.length - 1; ++i) {

            // Here we are building the URL we need to query the database   
            if (is_US_state) {
                var queryURL = "https://api.weatherbit.io/v2.0/" + prediction + "/daily?" +
                "city=" + city + "," + state + "," + country + "&start_date=" +  date_arr[i] +
                "&end_date" + date_arr[i+1] + "&key=" + APIKey;
            } else {
                var queryURL = "https://api.weatherbit.io/v2.0/" + prediction + "/daily?" +
                "city=" + city + "," + country + "&start_date=" +  date_arr[i] +
                "&end_date" + date_arr[i+1] + "&key=" + APIKey;  
            }

                // Here we run our AJAX call to the OpenWeatherMap API
                $.ajax({
                    url: queryURL,
                    method: "GET"
                })
                    // We store all of the retrieved data inside of an object called "response"
                    // Documentation available at https://www.weatherbit.io/api/weather-forecast-16-day
                    .then(function(response) {
                        $("#city-div").append("<p>City: " + reponse.city-name + "</p>");
                        $("#temp-div").append("<p>Temperature (F): " + response.data.temp + "</p>");
                        $("#max-temp-div").append("<p> Max Temperature (F): " + response.data.max_temp + "</p>");
                        $("#min-temp-div").append("<p> Min Temperature (F): " + response.data.min_temp + "</p>");
                        $("#wind-speed-div").append("<p> Windspeed (mph): " + response.data.wind_spd + "</p>"); 
                        $("#wind-dir-div").append("<p> Wind direction: " + response.data.wind_cdir_full + "</p>"); 
                        $("#clouds-div").append("<p> Clouds: " + response.data.clouds + "</p>");
                        $("#visibility-div").append("<p> Visibility %: " + response.data.vis + "</p>");
                        $("#snow-div").append("<p> Snow: " + response.data.snow + "</p>");
                        $("#snow-depth-div").append("<p> Snow Depth: " + response.data.snow_depth + "</p>");
                        
                        console.log(JSON.stringify(response));
                    });
                }
    });
});
    