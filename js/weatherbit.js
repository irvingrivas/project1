$(document).ready(function() {
    // This is needed for API

    $("#search-btn").on("click", function () {

        // Necessary variables for weather
        console.log("City: " + $("#cityId").val());
        console.log("Country: " + $("#countryId").val());
        console.log("Start Date: " + $("#calendar-input").daterangepicker().val().split("-")[0].trim());
        console.log("End Date: " + $("#calendar-input").daterangepicker().val().split("-")[1].trim());
        console.log("Moment Start Date: " + moment($("#calendar-input").daterangepicker().val().split("-")[0].trim(),"MM/DD/YYYY"));
        console.log("Moment End Date: " + moment($("#calendar-input").daterangepicker().val().split("-")[1].trim(),"MM/DD/YYYY"));

        var city = $("#cityId").val().trim();
        var country = $("#countryId").val().trim();
        var start_date = moment($("#calendar-input").daterangepicker().val().split("-")[0].trim());
        var end_date = moment($("#calendar-input").daterangepicker().val().split("-")[1].trim());

        // Only get up to 16 days forecast, otherwise goes back a year
        var prediction = "forecast";
        var curr_date = moment();
        if ((curr_date.diff(end_date,"days") >= 16) && end_date.isAfter(curr_date)) { 
            prediction = "history";
            start_date.subtract(1,"years");
            end_date.subtract(1,"years");
        }

        // Populate date array which holds range of dates
        var date_range = end_date.diff(start_date,"days");

        // Check if country is US
        if (country === "United States") {
            var is_US_state = true;
            var state_fullname = $("#stateId").val().trim();
            state = abbrState(state_fullname,"abbr");
        } else {
            var is_US_state = false;
        }

        // This is our weather bit API key
        var APIKey = "5887b8d504574dffbe86fb6dfad4bd60";

        // DO NOT Run this repeatedly, API only allows a finite number of calls for weather data !!
        // Here we are building the URL we need to query the database   
        if (is_US_state && prediction == "history") {
            var queryURL_withspaces = "https://api.weatherbit.io/v2.0/" + prediction + "/daily?" +
            "city=" + city + "," + state + "&start_date=" + start_date.format("YYYY-MM-DD") +
            "&end_date=" + end_date.format("YYYY-MM-DD") + "&key=" + APIKey;
        } else if (!is_US_state && prediction == "history") {
            var queryURL_withspaces = "https://api.weatherbit.io/v2.0/" + prediction + "/daily?" +
            "city=" + city + "," + country + "&start_date=" + start_date.format("YYYY-MM-DD") +
            "&end_date=" + end_date.format("YYYY-MM-DD") + "&key=" + APIKey;  
        } else if (is_US_state && prediction == "forecast") {
            var queryURL_withspaces = "https://api.weatherbit.io/v2.0/" + prediction + "/daily?" +
            "city=" + city + "," + state + "&key=" + APIKey;
        } else if (!is_US_state && prediction == "forecast") {
            var queryURL_withspaces = "https://api.weatherbit.io/v2.0/" + prediction + "/daily?" +
            "city=" + city + "," + country + "&key=" + APIKey;  
        }

        queryURL = queryURL_withspaces.split(' ').join('+');
        for (var i = 0; i < date_range; ++i) {
            // Here we run our AJAX call to the OpenWeatherMap API
            $.ajax({
                url: queryURL,
                method: "GET"
            })

                // We store all of the retrieved data inside of an object called "response"
                // Documentation available at https://www.weatherbit.io/api/weather-forecast-16-day
                .then(function(response) {
                    console.log(response.data[i]);
                    console.log("Date: " + response.data[i].valid_date);
                    console.log("Temperature (F): " + response.data[i].temp);
                    console.log("Max Temperature (F): " + response.data[i].max_temp);
                    console.log("Min Temperature (F): " + response.data[i].min_temp);
                    
                });
        }
    });
});
    