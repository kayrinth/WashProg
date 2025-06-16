import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { MapContainer, Marker, TileLayer, Polyline } from "react-leaflet";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import tsp from "./tsp";
import useAuthStore from "../../stores/useAuthStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const iconHome = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const iconMenunggu = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const iconSelesai = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const fixedPosition = {
  lat: -7.7544068241818485,
  lng: 110.4092258951068,
};

const getAddressFromCoords = async (lat, lng) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/reverse-geocode?lat=${lat}&lng=${lng}`
    );
    const data = await response.json();
    return data.display_name || "Lokasi tidak ditemukan";
  } catch (err) {
    console.error("Error fetching address:", err);
    return "Gagal mendapatkan alamat";
  }
};

const getRoute = async (start, end) => {
  const { token } = useAuthStore.getState();
  try {
    const response = await fetch(
      `${API_BASE_URL}/route?startLat=${start.lat}&startLng=${start.lng}&endLat=${end.lat}&endLng=${end.lng}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json();

    if (!data.routes?.length) {
      return [
        [start.lat, start.lng],
        [end.lat, end.lng],
      ];
    }

    return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
  } catch (err) {
    console.error("Gagal mengambil rute:", err);
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

const MapView = ({ orders }) => {
  const [routeMenunggu, setrouteMenunggu] = useState([]);
  const [routeSelesai, setrouteSelesai] = useState([]);
  const [fixedAddress, setFixedAddress] = useState("Mendeteksi alamat...");
  const [loading, setLoading] = useState(true);

  const menungguOrders = (orders || []).filter(
    (order) => order.status === "menunggu"
  );

  const selesaiOrders = (orders || []).filter(
    (order) => order.status === "selesai"
  );

  const alphabet = "BCDEFGHIJKLMNOPQRSTUVWXYZ";

  const menungguNodes = useMemo(() => {
    const nodes = {};
    menungguOrders.forEach((order, idx) => {
      nodes[alphabet[idx]] = {
        lat: order.lat,
        lng: order.lng,
        address: order.address,
        id: order._id,
      };
    });
    nodes["A"] = {
      lat: fixedPosition.lat,
      lng: fixedPosition.lng,
      address: "Alamat Washprog",
      id: "hardcoded",
    };
    return nodes;
  }, [menungguOrders]);

  useEffect(() => {
    const fetchRouteMenunggu = async () => {
      if (Object.keys(menungguNodes).length <= 1) return;

      const nearestNode = getNearestNode(fixedPosition, menungguNodes);
      const { path } = tsp(menungguNodes, nearestNode);
      console.log("🔍 Jalur terbaik:", path);

      let fullRoute = [];

      for (let i = 0; i < path.length - 1; i++) {
        const from = menungguNodes[path[i]];
        const to = menungguNodes[path[i + 1]];
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
        [menungguNodes[nearestNode].lat, menungguNodes[nearestNode].lng],
      ];

      setrouteMenunggu([...fixedToStart, ...fullRoute]);
      setLoading(false);
    };

    fetchRouteMenunggu();
  }, [orders]);

  const selesaiNodes = useMemo(() => {
    const nodes = {};
    selesaiOrders.forEach((order, idx) => {
      nodes[alphabet[idx]] = {
        lat: order.lat,
        lng: order.lng,
        address: order.address,
        id: order._id,
      };
    });
    nodes["A"] = {
      lat: fixedPosition.lat,
      lng: fixedPosition.lng,
      address: "Alamat Washprog",
      id: "hardcoded",
    };
    return nodes;
  }, [selesaiOrders]);

  useEffect(() => {
    const fetchRouteSelesai = async () => {
      if (Object.keys(selesaiNodes).length <= 1) return;

      const nearestNode = getNearestNode(fixedPosition, selesaiNodes);
      const { path } = tsp(selesaiNodes, nearestNode);
      console.log("🔍 Jalur terbaik:", path);

      let fullRoute = [];

      for (let i = 0; i < path.length - 1; i++) {
        const from = selesaiNodes[path[i]];
        const to = selesaiNodes[path[i + 1]];
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
        [selesaiNodes[nearestNode].lat, selesaiNodes[nearestNode].lng],
      ];

      setrouteSelesai([...fixedToStart, ...fullRoute]);
      setLoading(false);
    };

    fetchRouteSelesai();
  }, [orders]);

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

  if (menungguOrders.length === 0)
    return <p className="text-center p-4">✅ Tidak ada pesanan menunggu.</p>;
  if (selesaiOrders.length === 0)
    return <p className="text-center p-4">✅ Tidak ada pesanan selesai.</p>;
  if (loading)
    return <p className="text-center p-4">🔄 Memuat jalur terbaik...</p>;

  return (
    <div className="w-full h-screen rounded-lg overflow-hidden border border-gray-300 mt-16 lg:mt-0">
      <p className="text-sm p-2 text-gray-600 bg-white shadow">
        📍 Lokasi Anda: {fixedAddress}
      </p>
      <MapContainer
        center={[fixedPosition.lat, fixedPosition.lng]}
        zoom={17}
        style={{ height: "100vh" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {menungguOrders.map((order) => (
          <Marker
            key={order._id}
            position={[order.lat, order.lng]}
            icon={iconMenunggu}
          />
        ))}

        {selesaiOrders.map((order) => (
          <Marker
            key={order._id}
            position={[order.lat, order.lng]}
            icon={iconSelesai}
          />
        ))}
        {routeSelesai.length > 0 && (
          <Polyline positions={routeSelesai} color="green" weight={4} />
        )}
        {routeMenunggu.length > 0 && (
          <Polyline positions={routeMenunggu} color="blue" weight={4} />
        )}
        <Marker
          position={[fixedPosition.lat, fixedPosition.lng]}
          icon={iconHome}
        />
      </MapContainer>
    </div>
  );
};

MapView.propTypes = {
  orders: PropTypes.array.isRequired,
};

export default MapView;
