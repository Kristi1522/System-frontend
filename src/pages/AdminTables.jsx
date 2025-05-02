// src/pages/AdminTables.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://system-backend-0i7a.onrender.com";

export default function AdminTables() {
  const [tables, setTables] = useState([]);
  const [number, setNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await axios.get(`${API_URL}/tables`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTables(res.data);
    } catch (err) {
      console.error("Error fetching tables:", err.message);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post(
        `${API_URL}/tables`,
        { number, capacity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNumber("");
      setCapacity("");
      fetchTables();
    } catch (err) {
      console.error("Error creating table:", err.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Menaxhimi i Tavolinave</h2>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-xl font-semibold mb-2">➕ Shto Tavolinë</h3>
        <div className="flex gap-4">
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Numri i tavolinës"
            className="border p-2 rounded"
          />
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="Kapaciteti"
            className="border p-2 rounded"
          />
          <button
            onClick={handleCreate}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Shto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {tables.map((t) => (
          <div key={t._id} className="p-4 bg-white rounded shadow">
            <p><strong>Tavolina:</strong> {t.number}</p>
            <p><strong>Kapaciteti:</strong> {t.capacity}</p>
            <p><strong>Statusi:</strong> {t.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
