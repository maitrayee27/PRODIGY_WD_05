let cityInput = document.querySelector("#city-input");
let searchBtn = document.querySelector("#search-btn");
let locationBtn = document.querySelector("#location-btn");

let cityName = document.querySelector("#city-name");
let temperature = document.querySelector("#temperature");
let condition = document.querySelector("#condition");
let humidity = document.querySelector("#humidity");
let wind = document.querySelector("#wind");
let errorMessage = document.querySelector("#error-message");

// Search city

searchBtn.addEventListener("click", function() {

    let city = cityInput.value;

    if (city === "") {
        errorMessage.innerText = "Enter a city name";
        return;
    }

    fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + city)
        .then(response => response.json())
        .then(data => {

            if (!data.results) {
                errorMessage.innerText = "City not found";
                return;
            }
            errorMessage.innerText = "";
            let place = data.results[0];

            getWeather(place.latitude, place.longitude, place.name);
        });
});

// Get weather

function getWeather(latitude, longitude, name) {

    let url =
        "https://api.open-meteo.com/v1/forecast" +
        "?latitude=" + latitude +
        "&longitude=" + longitude +
        "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m";

    fetch(url)
        .then(response => response.json())
        .then(data => {

            let weather = data.current;

            cityName.innerText = name;
            temperature.innerText = weather.temperature_2m + "°C";
            humidity.innerText = "💧 " + weather.relative_humidity_2m + "%";
            wind.innerText = "💨 " + weather.wind_speed_10m + " km/h";

            if (weather.weather_code === 0) {
                condition.innerText = "☀️ Clear";
            }
            else if (weather.weather_code <= 3) {
                condition.innerText = "☁️ Cloudy";
            }
            else if (weather.weather_code <= 67) {
                condition.innerText = "🌧️ Rain";
            }
            else if (weather.weather_code <= 77) {
                condition.innerText = "❄️ Snow";
            }
            else {
                condition.innerText = "⛈️ Storm";
            }
        });
}

// Current location

locationBtn.addEventListener("click", function() {

    navigator.geolocation.getCurrentPosition(function(position) {

        getWeather(
            position.coords.latitude,
            position.coords.longitude,
            "Your Location"
        );

    });
});