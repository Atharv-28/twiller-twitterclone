import React, { useState } from "react";
import axios from "axios";

const LocationFetcher = () => {
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
          // setAddress(address);
          console.log(addressDetails);
          setAddress(addressDetails.state_district+", "+addressDetails.state+", "+addressDetails.country);
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
    <div>
      <button onClick={getLocation}>Obtain Location</button>
      {address && (
        <div>
          <h4>Current Location:</h4>
          <p>{address}</p>
        </div>
      )}
      {location.latitude && location.longitude && (
        <div>
          <h4>Coordinates:</h4>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default LocationFetcher;