import { useEffect, useState } from "react";
import axios from "axios";
import BarChartComponent from "../components/BarChartComponent";
import DailyRevenueChart from "../components/DailyRevenueChart";

const API_URL = "https://system-backend-0i7a.onrender.com";

export default function DailySummary() {
  const [data, setData] = useState([]);
  const [revenueByDate, setRevenueByDate] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/orders/daily-summary`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { date: selectedDate },
        });
        setData(res.data);
      } catch (err) {
        console.error("Error fetching daily summary:", err);
      }
    };

    const fetchRevenueByDate = async () => {
      try {
        const res = await axios.get(`${API_URL}/orders/revenue-by-date`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRevenueByDate(res.data);
      } catch (err) {
        console.error("Error fetching revenue by date:", err);
      }
    };

    fetchData();
    fetchRevenueByDate();
  }, [selectedDate]);

  const totalRevenue = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="min-h-screen bg-background p-6 text-textdark">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-primary">📅 Daily Revenue by Waiters</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="date" className="text-sm font-medium">Select date:</label>
          <input
            type="date"
            id="date"
            className="border px-3 py-1 rounded shadow-sm"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela për kamarierët */}
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

      {/* Totali i përditshëm */}
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

      {/* Grafik me kolonë sipas kamarierëve */}
      <h3 className="text-3xl font-semibold text-secondary mb-6 text-center">📊 Revenue by Waiter</h3>
      <BarChartComponent data={data} />

      {/* Grafik me linjë sipas datës */}
      <h3 className="text-3xl font-semibold text-secondary mt-12 mb-6 text-center">📈 Revenue by Date</h3>
      <DailyRevenueChart data={revenueByDate} />
    </div>
  );
}
