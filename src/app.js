function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];

  return `${day} ${hours}:${minutes}`;
}

let dateElement = document.querySelector(".currentTime");
let time = new Date();
dateElement.innerHTML = formatDate(time);

function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-text-input");
  let locationHeading = document.querySelector(".selectedCity");
  locationHeading.innerHTML = `${searchInput.value}`;
  let apiKey = "af1d49c44d7d38c5f24b52af719be555";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}
let form = document.querySelector(".citySearch");
form.addEventListener("submit", search);

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function formatHour(timestamp) {
  let hour = new Date(timestamp * 1000);
  let hours = hour.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  return hours;
}

let backgroundColor = document.querySelector("body");
function setBackground(response) {
  let hours = time.getHours();
  if (hours > 19 || hours < 6) {
    backgroundColor.style.background =
      "radial-gradient(circle at 10% 20%, rgb(69, 86, 102) 0%, rgb(34, 34, 34) 90%)";
  }
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector(".weekForecastHeading");
  console.log(forecastElement);
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col-sm-2 weekday">
      <div class="weekdays">${formatDay(forecastDay.dt)}</div>
      <div class="temp">
        <span class="maxTemp">${Math.round(
          forecastDay.temp.max
        )}°</span> | <span class="minTemp">${Math.round(
          forecastDay.temp.min
        )}°</span>
      </div>
      <div class="weatherIcon"><img src="http://openweathermap.org/img/wn/${
        forecastDay.weather[0].icon
      }@2x.png" alt="${forecastDay.weather[0].main}" width="55"></div>
      <div class="weatherName">${forecastDay.weather[0].main}</div>
    </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;

  let forecastToday = response.data.hourly;
  let forecastTodayElement = document.querySelector("#today-forecast");
  let forecastTodayHTML = `<div class="row">`;
  forecastToday.forEach(function (forecastHour, index) {
    if (index % 4 == 0) {
      forecastTodayHTML =
        forecastTodayHTML +
        `
          <div class="col-sm-1 later">
            ${formatHour(forecastHour.dt)}h <br />
            <img src="http://openweathermap.org/img/wn/${
              forecastHour.weather[0].icon
            }@2x.png" alt="${
          forecastHour.weather[0].description
        }" width="36"/> <br />
            ${Math.round(forecastHour.temp)}°
          </div>
          `;
    }
  });

  forecastTodayHTML = forecastTodayHTML + `</div>`;
  forecastTodayElement.innerHTML = forecastTodayHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "af1d49c44d7d38c5f24b52af719be555";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeatherCondition(response) {
  document.querySelector(".selectedCity").innerHTML = response.data.name;
  let temperature = Math.round(response.data.main.temp);
  document.querySelector(".degrees").innerHTML = `${temperature}°C`;
  document.querySelector(".weatherDescription").innerHTML =
    response.data.weather[0].main;
  let humidityElement = document.querySelector(".humidityValue");
  let windElement = document.querySelector(".windValue");
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  celsiusTemperature = response.data.main.temp;

  getForecast(response.data.coord);
  setBackground(response);
}

function searchCity(city) {
  let apiKey = "af1d49c44d7d38c5f24b52af719be555";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function searchLocation(position) {
  let apiKey = "af1d49c44d7d38c5f24b52af719be555";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeatherCondition);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let currentLocationButton = document.querySelector(".locationButton");
currentLocationButton.addEventListener("click", getCurrentLocation);

let celsiusTemperature = null;

searchCity("Paris");

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector(".degrees");
  let temperatureC = Math.round(celsiusTemperature);
  temperatureElement.innerHTML = `${temperatureC}°C`;
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

let celsiusLink = document.querySelector("#units-celsius");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let temperatureElement = document.querySelector(".degrees");
  let temperatureF = Math.round(fahrenheitTemperature);
  temperatureElement.innerHTML = `${temperatureF}°F`;
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

let fahrenheitLink = document.querySelector("#units-fahrenheit");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);
