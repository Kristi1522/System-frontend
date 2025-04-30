import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList
} from "recharts";

const API_URL = "https://system-backend-0i7a.onrender.com"

export default function DailySummary() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/orders/daily-summary`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Error fetching daily summary:", err);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalRevenue = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="min-h-screen bg-background p-6 text-textdark">
      <h2 className="text-4xl font-bold text-primary mb-8">📅 Daily Revenue by Waiters</h2>

      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-primary text-white">
            <tr>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Revenue (€)</th>
              <th className="py-3 px-6 text-left">Order Count</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.email} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6">{d.email}</td>
                <td className="py-3 px-6">{d.total.toFixed(2)}€</td>
                <td className="py-3 px-6">{d.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-12">
        <table className="w-full max-w-md mx-auto bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-secondary text-white">
            <tr>
              <th className="py-3 px-6 text-center">Total Daily Revenue</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-4 px-6 text-center font-bold text-lg">
                {totalRevenue.toFixed(2)}€
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-3xl font-semibold text-secondary mb-6 text-center">📊 Revenue Chart</h3>

      <div className="w-full h-[300px] bg-white shadow rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="email" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#6366F1" name="Revenue (€)"> {/* Primary Color */}
              <LabelList dataKey="total" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
