import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://system-backend-0i7a.onrender.com"; // zëvendëso nëse është lokal

export default function Tables() {
  const [tables, setTables] = useState([]);
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

  const reserveTable = async (id) => {
    try {
      await axios.post(`${API_URL}/tables/reserve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Tavolina u rezervua me sukses!");
      fetchTables();
    } catch (err) {
      alert("❌ Tavolina nuk mund të rezervohet!");
      console.error("Error reserving table:", err.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Tavolinat</h2>
      <div className="grid grid-cols-2 gap-4">
        {tables.map((table) => (
          <div key={table._id} className="bg-white shadow rounded p-4">
            <p><strong>Numri:</strong> {table.number}</p>
            <p><strong>Kapaciteti:</strong> {table.capacity} persona</p>
            <p>
              <strong>Statusi:</strong>{" "}
              <span className={table.isReserved ? "text-red-600" : "text-green-600"}>
                {table.isReserved ? "Rezervuar" : "E lirë"}
              </span>
            </p>
            {!table.isReserved && (
              <button
                onClick={() => reserveTable(table._id)}
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Rezervo
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
