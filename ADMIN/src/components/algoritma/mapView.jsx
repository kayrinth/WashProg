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

const MapView = ({ orders }) => {
  const [routeMenunggu, setrouteMenunggu] = useState([]);
  const [routeDiantar, setrouteDiantar] = useState([]);
  const [googleMapsMenungguUrl, setGoogleMapsMenungguUrl] = useState("");
  const [googleMapsSelsaiUrl, setGoogleMapsSelsaiUrl] = useState("");
  const [googleMapsSemuaUrl, setGoogleMapsSemuaUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const menungguOrders = (orders || []).filter(
    (order) => order.status === "menunggu"
  );
  const selesaiOrders = (orders || []).filter(
    (order) => order.status === "diantar"
  );
  const semuaOrders = (orders || []).filter(
    (order) => order.status === "diantar" || order.status === "menunggu"
  );

  const alphabet = "BCDEFGHIJKLMNOPQRSTUVWXYZ";

  //===================MENUNGGU ORDER===================//

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

      const coordinates = path.map((nodeKey) => {
        const { lat, lng } = menungguNodes[nodeKey];
        return `${lat.toFixed(6)},${lng.toFixed(6)}`;
      });

      const googleMapsUrl = `https://www.google.com/maps/dir/${coordinates.join(
        "/"
      )}/?dirflg=d`;

      console.log("🗺️ Rute Google Maps Menunggu:", googleMapsUrl);

      setrouteMenunggu([...fixedToStart, ...fullRoute]);
      setGoogleMapsMenungguUrl(googleMapsUrl);
      setLoading(false);
    };

    fetchRouteMenunggu();
  }, [orders]);

  //===================MENUNGGU ORDER===================//

  //===================SELESAI ORDER===================//

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

      const coordinates = path.map((nodeKey) => {
        const { lat, lng } = selesaiNodes[nodeKey];
        return `${lat},${lng}`;
      });

      const googleMapsUrl = `https://www.google.com/maps/dir/${coordinates.join(
        "/"
      )}`;
      console.log("🗺️ Rute Google Maps:", googleMapsUrl);

      setrouteDiantar([...fixedToStart, ...fullRoute]);
      setGoogleMapsSelsaiUrl(googleMapsUrl);
      setLoading(false);
    };

    fetchRouteSelesai();
  }, [orders]);

  //===================SELESAI ORDER===================//

  //===================SEMUA ORDER===================//

  const semuaNode = useMemo(() => {
    const nodes = {};
    semuaOrders.forEach((order, idx) => {
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
  }, [semuaOrders]);

  useEffect(() => {
    const fetchRouteSemua = async () => {
      if (Object.keys(semuaNode).length <= 1) return;

      const nearestNode = getNearestNode(fixedPosition, semuaNode);
      const { path } = tsp(semuaNode, nearestNode);
      console.log("🔍 Jalur terbaik:", path);

      let fullRoute = [];

      for (let i = 0; i < path.length - 1; i++) {
        const from = semuaNode[path[i]];
        const to = semuaNode[path[i + 1]];
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
        [semuaNode[nearestNode].lat, semuaNode[nearestNode].lng],
      ];

      const coordinates = path.map((nodeKey) => {
        const { lat, lng } = semuaNode[nodeKey];
        return `${lat},${lng}`;
      });

      const googleMapsUrl = `https://www.google.com/maps/dir/${coordinates.join(
        "/"
      )}`;
      console.log("🗺️ SEMUA RUTE:", googleMapsUrl);

      setrouteDiantar([...fixedToStart, ...fullRoute]);
      setGoogleMapsSemuaUrl(googleMapsUrl);
      setLoading(false);
    };

    fetchRouteSemua();
  }, [orders]);

  //===================SEMUA ORDER===================//

  if (menungguOrders.length === 0)
    return <p className="text-center p-4">Tidak ada pesanan.</p>;
  if (loading)
    return <p className="text-center p-4">🔄 Memuat jalur terbaik...</p>;

  return (
    <div className="w-full h-screen rounded-lg overflow-hidden border border-gray-300 mt-16 lg:mt-0">
      <MapContainer
        center={[fixedPosition.lat, fixedPosition.lng]}
        zoom={17}
        zoomControl={false}
        style={{ height: "100vh", position: "relative" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <div className="absolute bottom-24 lg:bottom-8 right-4 z-[1000] space-y-2 text-white">
          {googleMapsMenungguUrl && (
            <button
              onClick={() =>
                window.open(
                  googleMapsMenungguUrl,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              className=" text-white block bg-blue-600 w-32 py-4 rounded hover:bg-blue-700 transition shadow"
            >
              Rute Pick Up
            </button>
          )}
          {googleMapsSelsaiUrl && (
            <button
              onClick={() =>
                window.open(
                  googleMapsSelsaiUrl,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              className="block bg-green-600 text-white w-32 py-3 rounded hover:bg-green-700 transition shadow"
            >
              Rute Delivery
            </button>
          )}
          {googleMapsSemuaUrl && (
            <button
              onClick={() =>
                window.open(googleMapsSemuaUrl, "_blank", "noopener,noreferrer")
              }
              className="block bg-yellow-500 text-white w-32 py-3 rounded hover:bg-yellow-700 transition shadow"
            >
              Semua Rute
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
        {routeDiantar.length > 0 && (
          <Polyline positions={routeDiantar} color="#10B981" weight={4} />
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
