// hooks/useNodes.js
import { useState, useEffect } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useNodes = () => {
  const [nodes, setNodes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/orders`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (res.ok && Array.isArray(data.data)) {
          const alphabet = "BCDEFGHIJKLMNOPQRSTUVWXYZ";
          const nodeMap = {};

          data.data.forEach((item, index) => {
            const name = alphabet[index];
            nodeMap[name] = {
              lat: item.lat,
              lng: item.lng,
              address: item.address,
              id: item._id,
            };
          });

          nodeMap["A"] = {
            lat: -7.7544068241818485,
            lng: 110.4092258951068,
            address: "Alamat Washprog",
            id: "hardcoded",
          };
          setNodes(nodeMap);
        } else {
          console.error("Format data /orders tidak sesuai:", data);
        }
      } catch (err) {
        console.error("Gagal fetch nodes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNodes();
  }, []);

  return { nodes, loading };
};

export default useNodes;
