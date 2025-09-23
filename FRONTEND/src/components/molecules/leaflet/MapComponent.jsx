import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";

const markerIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const redMarkerIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
//untuk props
MapClickHandler.propTypes = {
  onMapClick: PropTypes.func.isRequired,
};
RecenterMap.propTypes = {
  position: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
};

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      console.log("Koordinat yang diklik:", lat, lng);

      if (onMapClick) {
        onMapClick({ lat, lng });
      } else {
        console.error("onMapClick handler tidak tersedia");
      }
    },
  });
  return null;
}

function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], map.getZoom());
    }
  }, [position, map]);
  return null;
}

const SearchControl = () => {
  const map = useMap();

  useEffect(() => {
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: true,
    }).addTo(map);

    return () => {
      map.removeControl(geocoder);
    };
  }, [map]);

  return null;
};

const MapComponent = ({ onLocationSelect }) => {
  const fixedPosition = {
    lat: -7.7544068241818485,
    lng: 110.4092258951068,
  };

  const [userPosition, setUserPosition] = useState(null);
  const fixedAddress = useState("Mendeteksi alamat...");
  const [userAddress, setUserAddress] = useState("Mendeteksi lokasi Anda...");
  const ZOOM_LEVEL = 12;

  const getAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || "Lokasi tidak ditemukan";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Gagal mendapatkan alamat";
    }
  };

  const handleMapClick = async (position) => {
    setUserPosition(position);
    const address = await getAddressFromCoords(position.lat, position.lng);
    setUserAddress(address);
    if (onLocationSelect) {
      onLocationSelect(position);
    }
  };

  // Mendapatkan alamat untuk lokasi fixed dan lokasi pengguna saat komponen pertama kali dimuat
  // useEffect(() => {
  //   // Ambil alamat lokasi fixed
  //   const fetchFixedAddress = async () => {
  //     const address = await getAddressFromCoords(
  //       fixedPosition.lat,
  //       fixedPosition.lng
  //     );
  //     setFixedAddress(address);
  //   };
  //   fetchFixedAddress();

  //   // Ambil lokasi pengguna jika browser mendukung geolokasi
  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition(
  //       async (pos) => {
  //         const { latitude, longitude } = pos.coords;
  //         const userPos = { lat: latitude, lng: longitude };
  //         setUserPosition(userPos);
  //         const address = await getAddressFromCoords(latitude, longitude);
  //         setUserAddress(address);
  //         console.log("Lokasi pengguna:", latitude, longitude);
  //         if (onLocationSelect) {
  //           onLocationSelect(userPos);
  //         }
  //       },
  //       (error) => {
  //         console.error("Geolocation error:", error.code, error.message);
  //         if (error.code === 1) alert("Izin lokasi ditolak");
  //         if (error.code === 2)
  //           alert("Lokasi tidak tersedia, coba aktifkan GPS/Wi-Fi");
  //         if (error.code === 3) alert("Timeout, coba lagi");
  //         setUserAddress("Gagal mendapatkan lokasi Anda");
  //       }
  //     );
  //   } else {
  //     setUserAddress("Browser tidak mendukung geolokasi");
  //   }
  // }, [onLocationSelect]);

  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden border border-gray-300">
      <MapContainer
        center={userPosition || fixedPosition}
        zoom={ZOOM_LEVEL}
        minZoom={11}
        maxZoom={18}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
        className="rounded-lg"
        maxBounds={[
          [-7.85, 110.25],
          [-7.65, 110.55],
        ]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler onMapClick={handleMapClick} />
        <RecenterMap position={userPosition} />

        <Marker position={fixedPosition} icon={redMarkerIcon}>
          <Popup>
            📌 WashProg: <br />
            {fixedAddress}
          </Popup>
        </Marker>

        {userPosition && (
          <Marker position={userPosition} icon={markerIcon}>
            <Popup>
              📍 Lokasi Anda: <br />
              {userAddress}
            </Popup>
          </Marker>
        )}
        <SearchControl />
      </MapContainer>

      <p className="text-sm text-gray-600 mt-2">
        💡 Klik pada peta untuk memilih lokasi pengantaran
      </p>
    </div>
  );
};

// ✅ PropTypes untuk MapComponent setelah deklarasi
MapComponent.propTypes = {
  onLocationSelect: PropTypes.func,
};

export default MapComponent;
