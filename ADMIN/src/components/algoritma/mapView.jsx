import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import {
  MapContainer,
  Marker,
  TileLayer,
  Polyline,
  Popup,
} from "react-leaflet";
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
  lat: -7.754656948044742,
  lng: 110.40922455841186,
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

const buildNodes = (orders, alphabet) => {
  const nodes = {};
  orders.forEach((order, idx) => {
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
};

const buildGMapsUrl = (path, nodes) => {
  const coords = path.map((key) => {
    const { lat, lng } = nodes[key];
    return `${lat.toFixed(6)},${lng.toFixed(6)}`;
  });

  if (
    coords[0] ===
    `${fixedPosition.lat.toFixed(6)},${fixedPosition.lng.toFixed(6)}`
  ) {
    coords[0] = "Current+Location";
  }

  return `https://www.google.com/maps/dir/${coords.join("/")}/?dirflg=d`;
};

const MapView = ({ orders }) => {
  const [routePickUp, setRoutePickUp] = useState([]);
  const [routeDelivery, setRouteDelivery] = useState([]);
  const [gmapsPickUp, setGmapsPickUp] = useState("");
  const [gmapsDelivery, setGmapsDelivery] = useState("");
  const [loading, setLoading] = useState(true);

  const alphabet = "BCDEFGHIJKLMNOPQRSTUVWXYZ";

  const menungguOrders = useMemo(
    () => orders.filter((o) => o.status === "menunggu"),
    [orders]
  );
  const selesaiOrders = useMemo(
    () => orders.filter((o) => o.status === "diantar"),
    [orders]
  );

  const menungguNodes = useMemo(
    () => buildNodes(menungguOrders, alphabet),
    [menungguOrders]
  );
  const selesaiNodes = useMemo(
    () => buildNodes(selesaiOrders, alphabet),
    [selesaiOrders]
  );

  const buildRoute = async (nodes, setterRoute, setterUrl) => {
    if (Object.keys(nodes).length <= 1) return;

    const nearest = getNearestNode(fixedPosition, nodes);
    const { path } = tsp(nodes, nearest);

    let fullRoute = [];
    for (let i = 0; i < path.length - 1; i++) {
      const from = nodes[path[i]];
      const to = nodes[path[i + 1]];
      const seg = await getRoute(from, to);

      fullRoute = fullRoute.concat(
        fullRoute.length > 0 &&
          JSON.stringify(fullRoute.at(-1)) === JSON.stringify(seg[0])
          ? seg.slice(1)
          : seg
      );
    }

    setterRoute(fullRoute);
    setterUrl(buildGMapsUrl(path, nodes));
    setLoading(false);
  };

  useEffect(() => {
    buildRoute(menungguNodes, setRoutePickUp, setGmapsPickUp);
  }, [menungguNodes]);

  useEffect(() => {
    buildRoute(selesaiNodes, setRouteDelivery, setGmapsDelivery);
  }, [selesaiNodes]);

  if (menungguOrders.length === 0)
    return <p className="text-center p-4">Tidak ada pesanan.</p>;
  if (loading)
    return (
      <p className="flex items-center justify-center h-screen">
        🔄 Memuat jalur terbaik...
      </p>
    );

  return (
    <div className="w-full h-screen rounded-lg overflow-hidden border border-gray-300 mt-16 lg:mt-0">
      <MapContainer
        center={[fixedPosition.lat, fixedPosition.lng]}
        zoom={17}
        zoomControl={false}
        style={{ height: "100vh", position: "relative" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <div className="absolute bottom-24 lg:bottom-8 right-4 z-[1000] space-y-2">
          {gmapsPickUp && (
            <button
              onClick={() =>
                window.open(gmapsPickUp, "_blank", "noopener,noreferrer")
              }
              className="block bg-blue-500 text-white w-32 py-3 rounded hover:bg-blue-700 transition shadow"
            >
              Rute Pick Up
            </button>
          )}
          {gmapsDelivery && (
            <button
              onClick={() =>
                window.open(gmapsDelivery, "_blank", "noopener,noreferrer")
              }
              className="block bg-green-500 text-white w-32 py-3 rounded hover:bg-green-700 transition shadow"
            >
              Rute Delivery
            </button>
          )}
        </div>

        {menungguOrders.map((order) => (
          <Marker
            key={order._id}
            position={[order.lat, order.lng]}
            icon={iconMenunggu}
          >
            <Popup>
              <div>
                <p className="font-semibold text-sm mb-1">📦 {order.address}</p>
                <a
                  href={`https://www.google.com/maps?q=${order.lat},${order.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline text-sm"
                >
                  📍 Buka di Google Maps
                </a>
              </div>
            </Popup>
          </Marker>
        ))}

        {selesaiOrders.map((order) => (
          <Marker
            key={order._id}
            position={[order.lat, order.lng]}
            icon={iconSelesai}
          />
        ))}

        {routeDelivery.length > 0 && (
          <Polyline positions={routeDelivery} color="#10B981" weight={4} />
        )}

        {routePickUp.length > 0 && (
          <Polyline positions={routePickUp} color="blue" weight={4} />
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
