// src/components/MapView.jsx
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
import { runTSPWorker } from "./tspClient";
import { haversineDistance } from "./haversine";

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

const iconDiantar = L.icon({
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

const MapView = ({ orders }) => {
  // CONFIG: ubah ini kalau mau matikan road-distances
  const useRoadDistances = true;
  const ROAD_DISTANCE_LIMIT = 18;

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [routeDiantar, setRouteDiantar] = useState([]);
  const [routeMenunggu, setRouteMenunggu] = useState([]);
  const [googleMapsDiantarUrl, setGoogleMapsDiantarUrl] = useState("");
  const [googleMapsMenungguUrl, setGoogleMapsMenungguUrl] = useState("");
  const [error, setError] = useState(null);

  const routeCacheRef = useRef(new Map());
  const distanceCacheRef = useRef(new Map());
  const abortControllerRef = useRef(null);

  // Pisahkan orders berdasarkan status
  const diantarOrders = useMemo(() => {
    return (orders || []).filter((order) => order.status === "diantar");
  }, [orders]);

  const menungguOrders = useMemo(() => {
    return (orders || []).filter((order) => order.status === "menunggu");
  }, [orders]);

  const alphabet = "BCDEFGHIJKLMNOPQRSTUVWXYZ";

  // Nodes untuk orders yang sedang diantar
  const diantarNodes = useMemo(() => {
    const nodes = {};
    diantarOrders.forEach((order, idx) => {
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
  }, [diantarOrders]);

  // Nodes untuk orders yang menunggu
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

  const token = "demo-token";

  const fetchRouteApi = useCallback(
    async (start, end, signal) => {
      const key = `${start.lat},${start.lng}::${end.lat},${end.lng}`;
      if (routeCacheRef.current.has(key)) {
        return routeCacheRef.current.get(key);
      }

      try {
        const res = await fetch(
          `${API_BASE_URL}/route?startLat=${start.lat}&startLng=${start.lng}&endLat=${end.lat}&endLng=${end.lng}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            signal,
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!data.routes?.length) {
          const straight = [
            [start.lat, start.lng],
            [end.lat, end.lng],
          ];
          routeCacheRef.current.set(key, straight);
          return straight;
        }

        const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [
          lat,
          lng,
        ]);
        routeCacheRef.current.set(key, coords);
        return coords;
      } catch (err) {
        if (err.name === "AbortError") throw err;
        console.error("fetchRouteApi failed:", err);
        const straight = [
          [start.lat, start.lng],
          [end.lat, end.lng],
        ];
        routeCacheRef.current.set(key, straight);
        return straight;
      }
    },
    [token]
  );

  const polylineLengthKm = (poly) => {
    let s = 0;
    for (let i = 0; i < poly.length - 1; i++) {
      const a = { lat: poly[i][0], lng: poly[i][1] };
      const b = { lat: poly[i + 1][0], lng: poly[i + 1][1] };
      s += haversineDistance(a, b);
    }
    return s;
  };

  const buildDistanceMatrix = useCallback(
    async (nodes, signal) => {
      const keys = Object.keys(nodes);
      const matrix = {};
      for (const k of keys) matrix[k] = {};

      const useRoad = useRoadDistances && keys.length <= ROAD_DISTANCE_LIMIT;

      const pairs = [];
      for (let i = 0; i < keys.length; i++) {
        for (let j = i + 1; j < keys.length; j++) {
          pairs.push([keys[i], keys[j]]);
        }
      }

      let done = 0;
      const total = pairs.length || 1;

      const BATCH = 6;
      for (let p = 0; p < pairs.length; p += BATCH) {
        if (signal.aborted) throw new DOMException("aborted", "AbortError");
        const batch = pairs.slice(p, p + BATCH);
        const promises = batch.map(async ([ka, kb]) => {
          const cacheKey = `${ka}::${kb}`;
          if (distanceCacheRef.current.has(cacheKey)) {
            const d = distanceCacheRef.current.get(cacheKey);
            matrix[ka][kb] = d;
            matrix[kb][ka] = d;
            return;
          }

          if (useRoad) {
            const start = nodes[ka];
            const end = nodes[kb];
            const poly = await fetchRouteApi(start, end, signal);
            const len = polylineLengthKm(poly);
            distanceCacheRef.current.set(cacheKey, len);
            matrix[ka][kb] = len;
            matrix[kb][ka] = len;
          } else {
            const d = haversineDistance(nodes[ka], nodes[kb]);
            distanceCacheRef.current.set(cacheKey, d);
            matrix[ka][kb] = d;
            matrix[kb][ka] = d;
          }
        });

        await Promise.all(promises);
        done += batch.length;
        setProgress(5 + Math.round((done / total) * 20));
      }

      for (const k of keys) matrix[k][k] = 0;
      return matrix;
    },
    [fetchRouteApi, useRoadDistances]
  );

  const getRouteCached = useCallback(
    async (fromNode, toNode, signal) => {
      return fetchRouteApi(fromNode, toNode, signal);
    },
    [fetchRouteApi]
  );

  const fetchAllRoutes = useCallback(
    async (path, nodes, signal) => {
      const promises = [];
      for (let i = 0; i < path.length - 1; i++) {
        const from = nodes[path[i]];
        const to = nodes[path[i + 1]];
        promises.push(getRouteCached(from, to, signal));
      }
      return Promise.all(promises);
    },
    [getRouteCached]
  );

  const buildGoogleMapsUrl = (path, nodes) => {
    const coordinates = path.map((nodeKey) => {
      const { lat, lng } = nodes[nodeKey];
      return `${lat},${lng}`;
    });

    if (coordinates.length > 0) {
      coordinates[0] = "Current+Location";
    }

    return `https://www.google.com/maps/dir/${coordinates.join("/")}/?dirflg=d`;
  };

  useEffect(() => {
    let mounted = true;

    const computeRoutes = async () => {
      if (
        Object.keys(diantarNodes).length <= 1 &&
        Object.keys(menungguNodes).length <= 1
      ) {
        setLoading(false);
        return;
      }

      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setLoading(true);
      setProgress(0);
      setError(null);

      try {
        // Compute route untuk DIANTAR
        if (Object.keys(diantarNodes).length > 1) {
          setProgress(1);
          const distMatrixDiantar = await buildDistanceMatrix(
            diantarNodes,
            signal
          );
          if (!mounted || signal.aborted) return;

          setProgress(15);

          const resultDiantar = await runTSPWorker(diantarNodes, "A", {
            onProgress: (pct) => setProgress(15 + Math.round((pct / 100) * 30)),
            distMatrix: distMatrixDiantar,
          });

          if (!mounted || signal.aborted) return;

          setProgress(45);
          const segmentsDiantar = await fetchAllRoutes(
            resultDiantar.path,
            diantarNodes,
            signal
          );
          if (!mounted || signal.aborted) return;

          let fullRouteDiantar = [];
          for (const segment of segmentsDiantar) {
            if (!Array.isArray(segment) || segment.length === 0) continue;
            if (
              fullRouteDiantar.length > 0 &&
              JSON.stringify(fullRouteDiantar.at(-1)) ===
                JSON.stringify(segment[0])
            ) {
              fullRouteDiantar = fullRouteDiantar.concat(segment.slice(1));
            } else {
              fullRouteDiantar = fullRouteDiantar.concat(segment);
            }
          }

          const googleUrlDiantar = buildGoogleMapsUrl(
            resultDiantar.path,
            diantarNodes
          );

          if (mounted && !signal.aborted) {
            setRouteDiantar(fullRouteDiantar);
            setGoogleMapsDiantarUrl(googleUrlDiantar);
          }
        }

        // Compute route untuk MENUNGGU
        if (Object.keys(menungguNodes).length > 1) {
          setProgress(50);
          const distMatrixMenunggu = await buildDistanceMatrix(
            menungguNodes,
            signal
          );
          if (!mounted || signal.aborted) return;

          setProgress(60);

          const resultMenunggu = await runTSPWorker(menungguNodes, "A", {
            onProgress: (pct) => setProgress(60 + Math.round((pct / 100) * 30)),
            distMatrix: distMatrixMenunggu,
          });

          if (!mounted || signal.aborted) return;

          setProgress(90);
          const segmentsMenunggu = await fetchAllRoutes(
            resultMenunggu.path,
            menungguNodes,
            signal
          );
          if (!mounted || signal.aborted) return;

          let fullRouteMenunggu = [];
          for (const segment of segmentsMenunggu) {
            if (!Array.isArray(segment) || segment.length === 0) continue;
            if (
              fullRouteMenunggu.length > 0 &&
              JSON.stringify(fullRouteMenunggu.at(-1)) ===
                JSON.stringify(segment[0])
            ) {
              fullRouteMenunggu = fullRouteMenunggu.concat(segment.slice(1));
            } else {
              fullRouteMenunggu = fullRouteMenunggu.concat(segment);
            }
          }

          const googleUrlMenunggu = buildGoogleMapsUrl(
            resultMenunggu.path,
            menungguNodes
          );

          if (mounted && !signal.aborted) {
            setRouteMenunggu(fullRouteMenunggu);
            setGoogleMapsMenungguUrl(googleUrlMenunggu);
            setProgress(100);
          }
        }
      } catch (err) {
        if (err.name !== "AbortError" && mounted) {
          console.error("computeRoutes error:", err);
          setError(
            "Gagal menghitung rute optimal. Coba lagi atau matikan mode 'road distances'."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setProgress(0);
        }
      }
    };

    computeRoutes();

    return () => {
      mounted = false;
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [diantarNodes, menungguNodes, buildDistanceMatrix, fetchAllRoutes]);

  if (diantarOrders.length === 0 && menungguOrders.length === 0) {
    return <p className="text-center p-4">Tidak ada pesanan.</p>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>🔄 Memuat jalur terbaik... {progress ? `${progress}%` : ""}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reload
        </button>
      </div>
    );
  }

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
          {googleMapsDiantarUrl && (
            <button
              onClick={() =>
                window.open(
                  googleMapsDiantarUrl,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              className="block bg-green-500 text-white w-32 py-3 rounded hover:bg-green-700 transition shadow"
            >
              Rute Diantar
            </button>
          )}
          {googleMapsMenungguUrl && (
            <button
              onClick={() =>
                window.open(
                  googleMapsMenungguUrl,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              className="block bg-blue-500 text-white w-32 py-3 rounded hover:bg-blue-700 transition shadow"
            >
              Rute Menunggu
            </button>
          )}
        </div>

        {diantarOrders.map((order) => (
          <Marker
            key={order._id}
            position={[order.lat, order.lng]}
            icon={iconDiantar}
          >
            <Popup>
              <div>
                <p className="font-semibold text-sm mb-1">🚚 {order.address}</p>
                <p className="text-xs text-gray-600 mb-1">Status: Diantar</p>
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

        {menungguOrders.map((order) => (
          <Marker
            key={order._id}
            position={[order.lat, order.lng]}
            icon={iconMenunggu}
          >
            <Popup>
              <div>
                <p className="font-semibold text-sm mb-1">📦 {order.address}</p>
                <p className="text-xs text-gray-600 mb-1">Status: Menunggu</p>
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

        {routeDiantar.length > 0 && (
          <Polyline positions={routeDiantar} color="#10B981" weight={4} />
        )}
        {routeMenunggu.length > 0 && (
          <Polyline positions={routeMenunggu} color="#3B82F6" weight={4} />
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
