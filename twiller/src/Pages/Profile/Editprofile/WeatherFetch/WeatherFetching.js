import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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
      axios.get(`https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${latitude},${longitude}`)
        .then(response => {
          setWeather(response.data);
        })
        .catch(error => {
          console.error("Error fetching weather data:", error);
        });
    }
  }, [latitude, longitude]);

  return (
    <div>
      {latitude && longitude && (
        <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: "300px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Marker position={[latitude, longitude]}>
            <Popup>
              {weather ? (
                <div>
                  <h3>{weather.location.name}</h3>
                  <p>{weather.current.condition.text}</p>
                  <p>{weather.current.temp_c}°C</p>
                </div>
              ) : (
                <p>Loading weather...</p>
              )}
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default WeatherFetching;