import React, { useEffect, useState } from "react";
import axios from "axios";

const WeatherFetching = ({ user }) => {
  const [weather, setWeather] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    if (user && user[0]) {
      setLatitude(user[0].latitude);
      setLongitude(user[0].longitude);
    }
  }, [user]);

  useEffect(() => {
    if (latitude && longitude) {
      // Fetch weather data using weatherapi.com API
      const fetchWeather = async () => {
        try {
          const weatherResponse = await axios.get(
            `https://api.weatherapi.com/v1/current.json?key=06dbdad212c54edb9e8111325242012&q=${latitude},${longitude}`
          );
          setWeather(weatherResponse.data);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      };
      fetchWeather();
    }
  }, [latitude, longitude]);

  return (
    <div>
      {weather && (
        <div>
          <h4>Weather Conditions:</h4>
          <img src={weather.current.condition.icon} alt="Weather icon" />

          <p>{weather.current.condition.text}</p>
          <p>Temperature: {weather.current.temp_c}°C</p>
        </div>
      )}
    </div>
  );
};

export default WeatherFetching;