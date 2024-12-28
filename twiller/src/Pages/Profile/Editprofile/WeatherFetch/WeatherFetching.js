import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "./WeatherFetching.css";

const WeatherFetching = ({ user }) => {
  const [weather, setWeather] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    if (user && user[0]) {
      setLatitude(user[0].latitude);
      setLongitude(user[0].longitude);
    }
  }, [user]);

  useEffect(() => {
    if (latitude && longitude) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=d6b7e8e0dd379fa0ead80d9cb65c9a46
&units=metric`
        )
        .then((response) => {
          setWeather(response.data);
          setHeatmapData([[latitude, longitude, response.data.main.temp]]);
          setMarkers([
            { lat: latitude, lon: longitude, name: response.data.name },
          ]);
          setIcon(`https://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`);
        })
        .catch((error) => {
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
    shadowSize: [41, 41],
  });

  return (
    <div className="weather-fetchings">
      {latitude && longitude && (
        <div className="weather-fetching">
          <MapContainer
            center={[latitude, longitude]}
            zoom={5}
            style={{ height: "250px", width: "60%" }}
          >
            <TileLayer
              url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=d6b7e8e0dd379fa0ead80d9cb65c9a46`}
              
            />
            <HeatmapLayer data={heatmapData} />
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={[marker.lat, marker.lon]}
                icon={customMarkerIcon}
              >
                <Tooltip permanent>{marker.name}</Tooltip>
              </Marker>
            ))}
          </MapContainer>
          <div>
            {weather && (
              <div className="weather-details">
                <h4>Weather in {weather.name}</h4>
                <p className="ico-txt"><img src={icon} />{weather.weather[0].description}</p>
                <p>Temperature: {weather.main.temp}°C</p>
                <p>Humidity: {weather.main.humidity}%</p>
                <p>Wind: {weather.wind.speed} m/s</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherFetching;
