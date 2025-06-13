import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MapContainer, Marker, TileLayer, Polyline } from "react-leaflet";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import nodes from "./nodes";
import tsp from "./tsp";

const markerIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const getRoute = async (start, end) => {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/walking/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
    );

    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const data = await response.json();

    if (!data.routes?.length) {
      console.warn("❌ Route not found", { start, end });
      return [
        [start.lat, start.lng],
        [end.lat, end.lng],
      ];
    }

    return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
  } catch (err) {
    console.error("❌ Gagal mengambil rute:", err);
    return [
      [start.lat, start.lng],
      [end.lat, end.lng],
    ];
  }
};

const getNearestNode = (position, nodes) => {
  let nearest = null;
  let minDist = Infinity;

  for (const [key, coord] of Object.entries(nodes)) {
    const dist = Math.sqrt(
      Math.pow(coord.lat - position.lat, 2) +
        Math.pow(coord.lng - position.lng, 2)
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = key;
    }
  }

  return nearest;
};

const MapView = () => {
  const [routeAll, setRouteAll] = useState([]);
  const [fixedAddress, setFixedAddress] = useState("Mendeteksi alamat...");

  const fixedPosition = {
    lat: -7.7544068241818485,
    lng: 110.4092258951068,
  };

  const getAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || "Lokasi tidak ditemukan";
    } catch (err) {
      console.error("Error fetching address:", err);
      return "Gagal mendapatkan alamat";
    }
  };

  useEffect(() => {
    const fetchAddress = async () => {
      const address = await getAddressFromCoords(
        fixedPosition.lat,
        fixedPosition.lng
      );
      setFixedAddress(address);
    };
    fetchAddress();
  }, []);

  useEffect(() => {
    const fetchRoute = async () => {
      const nearestNode = getNearestNode(fixedPosition, nodes);

      const { path } = tsp(nodes, nearestNode);
      console.log("🔍 Jalur terbaik:", path);

      let fullRoute = [];

      for (let i = 0; i < path.length - 1; i++) {
        const from = nodes[path[i]];
        const to = nodes[path[i + 1]];
        const segment = await getRoute(from, to);
        fullRoute = fullRoute.concat(
          fullRoute.length > 0 &&
            JSON.stringify(fullRoute.at(-1)) === JSON.stringify(segment[0])
            ? segment.slice(1)
            : segment
        );
      }

      const fixedToStart = [
        [fixedPosition.lat, fixedPosition.lng],
        [nodes[nearestNode].lat, nodes[nearestNode].lng],
      ];

      setRouteAll([...fixedToStart, ...fullRoute]);
    };

    fetchRoute();
  }, []);

  return (
    <div className="w-full h-screen rounded-lg overflow-hidden border border-gray-300">
      <p className="text-sm p-2 text-gray-600 bg-white shadow">
        📍 Lokasi Anda: {fixedAddress}
      </p>
      <MapContainer
        center={[nodes["A"].lat, nodes["A"].lng]}
        zoom={17}
        style={{ height: "100vh" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {Object.entries(nodes).map(([key, coord]) => (
          <Marker
            key={key}
            position={[coord.lat, coord.lng]}
            icon={markerIcon}
          />
        ))}
        <Marker
          position={[fixedPosition.lat, fixedPosition.lng]}
          icon={markerIcon}
        />
        {routeAll.length > 0 && (
          <Polyline positions={routeAll} color="blue" weight={4} />
        )}
      </MapContainer>
    </div>
  );
};

MapView.propTypes = {
  onLocationSelect: PropTypes.func,
};

export default MapView;
