import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "../style/GoogleMapSearch.module.css";
import L from "leaflet";

// Custom marker icon for Leaflet
const customMarker = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: styles.customMarkerIcon,
});

const DEFAULT_POSITION = { lat: 25.276987, lng: 55.296249 }; // Default to Dubai

const RecenterMap = ({ selectedLocation }: { selectedLocation: { lat: number; lng: number } }) => {
  const map = useMap();
  map.setView([selectedLocation.lat, selectedLocation.lng], 12, { animate: true });
  return null;
};

const GoogleMapSearch: React.FC<{ onLocationSelect?: (address: string, lat: number, lng: number) => void }> = ({ onLocationSelect }) => {
  const [iconSize, setIconSize] = useState<[number, number]>([25, 41]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ lat: string; lon: string; display_name: string }[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    DEFAULT_POSITION
  );

  useEffect(() => {
    const updateIconSize = () => {
      setIconSize(window.innerWidth <= 600 ? [80, 100] : [25, 41]); // Adjust icon size based on screen width
    };

    updateIconSize();
    window.addEventListener("resize", updateIconSize);
    return () => window.removeEventListener("resize", updateIconSize);
  }, []);

  useEffect(() => {
    const zoomIcons = document.querySelectorAll(
      ".leaflet-control-zoom-in span, .leaflet-control-zoom-out span"
    );
    zoomIcons.forEach((icon) => {
      (icon as HTMLElement).style.fontSize = window.innerWidth <= 600 ? "3rem" : "18px";
    });
  }, []);

  useEffect(() => {
    const updateAttributionStyle = () => {
      const attribution = document.querySelector(".leaflet-control-attribution");
      if (attribution) {
        (attribution as HTMLElement).style.fontSize = window.innerWidth <= 600 ? "3rem" : "1rem";
        
        // Also target <a> elements inside attribution
        const links = attribution.querySelectorAll("a");
        links.forEach((link) => {
          (link as HTMLElement).style.fontSize = window.innerWidth <= 600 ? "3rem" : "1rem";
        });
      }
    };

    updateAttributionStyle();
    window.addEventListener("resize", updateAttributionStyle);
  
    return () => window.removeEventListener("resize", updateAttributionStyle);
  }, []);

  // Function to search locations using Nominatim API
  const handleSearch = async (searchTerm: string) => {
    setQuery(searchTerm);
    if (searchTerm.length < 3) {
      setResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  // Function to select a location
  const handleSelectLocation = (lat: string, lon: string, name: string) => {
    setQuery(name);
    setResults([]);
    const location = { lat: parseFloat(lat), lng: parseFloat(lon) };
    setSelectedLocation(location);
  
    // Pass full address and coordinates to parent
    if (onLocationSelect) {
      onLocationSelect(name, location.lat, location.lng);
    }
  };
  
  return (
    <div style={{ width: "100%", maxWidth: "600px", margin: "auto" }}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search location..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      {results.length > 0 && (
        <ul
          style={{
            position: "absolute",
            width: "100%",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "5px",
            listStyle: "none",
            padding: "0",
            margin: "0",
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          {results.map((result, index) => (
            <li
              key={index}
              className={styles.googlelist}
              onClick={() => handleSelectLocation(result.lat, result.lon, result.display_name)}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {result.display_name}
            </li>
          ))}
        </ul>
      )}

      {/* OpenStreetMap Display */}
      <div style={{ height: "400px", marginTop: "10px" }}>
        <MapContainer
          center={selectedLocation || DEFAULT_POSITION}
          zoom={12}
          className={styles.tile1}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {selectedLocation && (
            <>
              <RecenterMap selectedLocation={selectedLocation} />
              <Marker position={selectedLocation} icon={customMarker}>
                <Popup>{query || "Selected Location"}</Popup>
              </Marker>
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default GoogleMapSearch;
