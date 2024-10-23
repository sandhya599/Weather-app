import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [locationName, setLocationName] = useState("");
  const [error, setError] = useState(null);

  // Function to select the background image based on the weather condition
  const getWeatherBackground = (condition) => {
    if (condition.includes("sun")) return "/images/clear.jpg";
    if (condition.includes("rain")) return "/images/heavy-rain.webp";
    if (condition.includes("cloud")) return "./images/cloudy.webp";
    if (condition.includes("thunder")) return "./images/lightening.jpg";
    return "./images/default.jpg"; // Fallback image
  };

  const fetchWeatherData = () => {
    const weatherUrl = `https://weatherapi-com.p.rapidapi.com/current.json?q=${locationName}`;
    const forecastUrl = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${locationName}&days=4`;

    Promise.all([
      fetch(weatherUrl, {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "2322fc7f60mshdc09f2b1200a1f7p1cd2b0jsn1b109a19cd7a",
          "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
        },
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`Weather API Error: ${response.statusText}`);
        }
        return response.json();
      }),
      fetch(forecastUrl, {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "2322fc7f60mshdc09f2b1200a1f7p1cd2b0jsn1b109a19cd7a",
          "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
        },
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`Forecast API Error: ${response.statusText}`);
        }
        return response.json();
      }),
    ])
      .then(([currentData, forecastData]) => {
        setCurrentWeather(currentData.current);
        setForecast(forecastData.forecast.forecastday);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching data:", err.message);
        setError("Error fetching weather data");
        setCurrentWeather(null);
        setForecast([]);
      });
  };

  // Get the appropriate background image based on the current weather condition
  const backgroundImage = currentWeather
    ? getWeatherBackground(currentWeather.condition.text.toLowerCase())
    : "./images/default.jpg";

  return (
    <div className="App" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="container">
        <nav>
          <input
            type="text"
            placeholder="Enter location (e.g. London)"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
          />
          <button onClick={fetchWeatherData}>Get Weather</button>
        </nav>
        <main>
          {error && <p>{error}</p>}

          <div className="main-weather-container">
            {currentWeather && (
              <div className="current-weather">
                <h2>Current Weather</h2>
                <p>Temperature: {currentWeather.temp_c}°C</p>
                <p>Humidity: {currentWeather.humidity}%</p>
                <p>Condition: {currentWeather.condition.text}</p>
                <img
                  src={currentWeather.condition.icon}
                  alt={currentWeather.condition.text}
                />
              </div>
            )}

            {forecast.length > 0 && (
              <div className="forecast">
                {forecast.map((day, index) => {
                  const {
                    date,
                    day: { avgtemp_c, condition },
                  } = day;
                  return (
                    <div key={index} className="weather-day">
                      <p>Date: {date}</p>
                      <p>Average Temperature: {avgtemp_c}°C</p>
                      <p>Condition: {condition.text}</p>
                      <img src={condition.icon} alt={condition.text} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
