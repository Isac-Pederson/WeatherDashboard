var count = 0;
var i = 0;

var uviEl = document.getElementById("uvi");
// Onclick search history is generated
$("button").on("click", function () {
    var cityP = $("<p>");
    var userInput = $("#search").val();
    cityP.addClass("city-name");
    cityP.text(capitalizeFirstLetter(userInput));
    $("#city-background").prepend(cityP);
    count++;
    if(count > 6){
        $('#city-background p').last().remove();
    }
    console.log($('#city-background p').first());
});
// on click user gets 5 day weather forecast and current forecast
$(document).ready(function(){
    $("button").on("click", function() {
        var userInput = $("#search").val();
        something(userInput)
    })
    // Wont work, can't onclick not working for .city-name and is broken with #city-background 
    $("#city-background").on("click", function () {
        var text = jQuery(this).text();
        console.log(text);


    })
});


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


 function something(x) {
        var userInput = $("#search").val();
        var weatherURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + x + "&units=imperial&city.coord.lat&appid=dfeaecc1575d1b3c6406759440f81776";
        $("img").removeClass("hide");
        $("div").removeClass("hide");
        

        $.ajax({
            url: weatherURL,
            method: "GET"
        })
            .then(function (response) {

                var curWeatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + response.city.coord.lat + "&lon=" + response.city.coord.lon + "&units=imperial&exclude=minutes,hourly&appid=dfeaecc1575d1b3c6406759440f81776";
                console.log(curWeatherURL);
                $.ajax({
                    url: curWeatherURL,
                    method: "GET"

                })
                    .then(function(response){
                        // Sets the current day variables(Temp,Humid,Wind Speed, UVI)
                        var results = response.current;
                        console.log(results);
                        var iconcode = results.weather[0].icon;
                        var iconurl = "http://openweathermap.org/img/wn/" + iconcode + "@2x.png";
                        $('#temp').text("Temperature: " + (results.temp));
                        $('#humid').text("Humidity: " + (results.humidity));
                        $('#wind-speed').text("Wind Speed : " + (results.wind_speed + " MPH"));
                        $('#current-city').text(capitalizeFirstLetter(userInput) + " (" + moment().format('dddd, h:mm') + ")");
                        $('#uvi').text("UV Index: " + results.uvi)
                        $('#wicon').attr('src', iconurl);
                        // Color for uvi
                        if(results.uvi < 3){
                            uviEl.style.backgroundColor = '#21c43a';
                        }else if(results.uvi < 9){
                            uviEl.style.backgroundColor = '#d2db23';

                        }else{
                            uviEl.style.backgroundColor = '#c90c06';
                        }

                        var resultsD = response.daily;
                        // Calls forecast for each day
                        forecast(1,"1day", "temp1", "humid1", '#wicon1');
                        forecast(2,"2day", "temp2", "humid2", '#wicon2');
                        forecast(3,"3day", "temp3", "humid3", '#wicon3');
                        forecast(4,"4day", "temp4", "humid4", '#wicon4');
                        forecast(5,"5day", "temp5", "humid5", '#wicon5');
                        // Function that gets day number, max temp for that day, humidity, sets icon for that day, and how many days away
                        function forecast(resNum,day,temp,humid,wicon){
                            var icon = resultsD[resNum].weather[0].icon;
                            var iconget = "http://openweathermap.org/img/wn/" + icon + ".png";
                            document.getElementById(day).innerText = moment().day(resNum + 1).format('dddd');
                            document.getElementById(temp).innerText = "Temperature: " + (resultsD[resNum].temp.max);
                            document.getElementById(humid).innerText = "Humidity: " + (resultsD[resNum].humidity);
                            $(wicon).attr('src', iconget);

                        }

                        
                        
                    });



            });
    

    };

