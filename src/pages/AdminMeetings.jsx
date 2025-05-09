import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

export default function AdminMeetings() {
  const [meetings, setMeetings] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/meetings`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMeetings(res.data);
    } catch (err) {
      console.error("Gabim gjatë marrjes së takimeve:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Fshi takimin?")) return;
    try {
      await axios.delete(`${API_URL}/api/meetings/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMeetings((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Gabim gjatë fshirjes së takimit:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-primary">📋 Takimet</h2>
      {meetings.length === 0 ? (
        <p className="text-gray-500">Nuk ka takime.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Përdoruesi</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Data</th>
              <th className="border px-4 py-2">Ora</th>
              <th className="border px-4 py-2">Tema</th>
              <th className="border px-4 py-2">Statusi</th>
              <th className="border px-4 py-2">Veprim</th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((m) => (
              <tr key={m._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{m.user?.name || "Anonim"}</td>
                <td className="border px-4 py-2">{m.user?.email}</td>
                <td className="border px-4 py-2">{new Date(m.date).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{m.hour}</td>
                <td className="border px-4 py-2">{m.topic}</td>
                <td className="border px-4 py-2">{m.status}</td>
                <td className="border px-4 py-2">
                  <button onClick={() => handleDelete(m._id)} className="text-red-500 hover:underline">
                    🗑️ Fshi
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
