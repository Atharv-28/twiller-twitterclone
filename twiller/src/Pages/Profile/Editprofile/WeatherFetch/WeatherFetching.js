import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import "./WeatherFetching.css";


const WeatherFetching = ({ user }) => {
  const [weather, setWeather] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (user && user[0]) {
      setLatitude(user[0].latitude);
      setLongitude(user[0].longitude);
    }
  }, [user]);

  useEffect(() => {
    if (latitude && longitude) {
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=d6b7e8e0dd379fa0ead80d9cb65c9a46
&units=metric`)
        .then(response => {
          setWeather(response.data);
          setHeatmapData([
            [latitude, longitude, response.data.main.temp]
          ]);
          setMarkers([
            { lat: latitude, lon: longitude, name: response.data.name }
          ]);
          console.log("Weather data:", response.data);
          
        })
        .catch(error => {
          console.error("Error fetching weather data:", error);
        });
    }
  }, [latitude, longitude]);

  const HeatmapLayer = ({ data }) => {
    const map = useMap();
    useEffect(() => {
      if (data.length > 0) {
        const heatLayer = L.heatLayer(data, { radius: 25 }).addTo(map);
        return () => {
          map.removeLayer(heatLayer);
        };
      }
    }, [data, map]);
    return null;
  };

  const customMarkerIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <>
    {latitude && longitude && (
        <div children="weather-fetching">
        <MapContainer center={[latitude, longitude]} zoom={5} style={{ height: "200px", width: "100%" }}>
          <TileLayer
            url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=d6b7e8e0dd379fa0ead80d9cb65c9a46`}
            attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
          />
          <HeatmapLayer data={heatmapData} />
          {markers.map((marker, index) => (
            <Marker key={index} position={[marker.lat, marker.lon]} icon={customMarkerIcon}>
              <Tooltip permanent>
                {marker.name}
              </Tooltip>
            </Marker>
          ))}

        </MapContainer>
        <div>
          {weather && (
            <div>
              <h3>Weather in {weather.name}</h3>
              <p>Temperature: {weather.main.temp}°C</p>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind: {weather.wind.speed} m/s</p>
            </div>
          )}
        </div>
        </div>
      )}
    </>
  );
};

export default WeatherFetching;