import React, { useState } from "react";
import axios from "axios";
import "./locationFetcher.css";

const LocationFetcher = ({onLocationObtained}) => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [address, setAddress] = useState("");

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          // Reverse geocoding using Nominatim API
          const geocodeResponse = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const addressDetails = geocodeResponse.data.address;
          setAddress(addressDetails.state_district+", "+addressDetails.state+", "+addressDetails.country);
          if (onLocationObtained) {
            console.log("Location obtained: ", address);
            onLocationObtained({ address, latitude, longitude });
          }
        },
        (error) => {
          console.error("Error obtaining location", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="location-fetcher">
      <button className="location-fetch-button" type="button" onClick={getLocation}>Obtain Location</button>
    </div>
  );
};

export default LocationFetcher;