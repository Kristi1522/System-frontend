import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "https://system-backend-0i7a.onrender.com";

export default function AdminDashboard() {
  const [summary, setSummary] = useState({ totalIncome: 0, totalOrders: 0, orders: [] });
  const [expandedUsers, setExpandedUsers] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data);
    } catch (err) {
      console.error("❌ Error fetching summary:", err.message);
    }
  };

  const toggleExpand = (email) => {
    setExpandedUsers((prev) => ({
      ...prev,
      [email]: !prev[email],
    }));
  };

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSummary((prev) => {
        const newOrders = prev.orders.filter((order) => order._id !== orderId);
        return {
          ...prev,
          orders: newOrders,
          totalOrders: newOrders.length,
        };
      });

      alert("✅ Order deleted successfully!");
    } catch (err) {
      console.error("❌ Error deleting the order:", err.message);
      alert("Error deleting the order.");
    }
  };

  const ordersByUser = summary.orders.reduce((acc, order) => {
    if (!acc[order.userEmail]) acc[order.userEmail] = [];
    acc[order.userEmail].push(order);
    return acc;
  }, {});

  return (
    <div className="min-h-screen p-6 bg-background text-textdark">
      <h2 className="text-4xl font-bold text-primary mb-6">📊 Admin Dashboard</h2>
      <div className="mb-8">
        <p className="text-lg mb-2">
          <strong>Total Income:</strong> {summary.totalIncome}€
        </p>
        <p className="text-lg">
          <strong>Number of Orders:</strong> {summary.totalOrders}
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-10">
        <h3 className="text-2xl font-semibold mb-4 text-secondary">🛠️ Menu Management</h3>
        <ul className="space-y-3">
          <li>
            <Link to="/add-dish" className="text-primary hover:text-highlight transition">
              ➕ Add Dish
            </Link>
          </li>
          <li>
            <Link to="/edit-menu" className="text-primary hover:text-highlight transition">
              ✏️ Edit Menu
            </Link>
          </li>
          <li>
            <Link to="/delete-dish" className="text-primary hover:text-highlight transition">
              ❌ Delete Dish
            </Link>
          </li>
          <li>
            <Link to="/register-user" className="text-primary hover:text-highlight transition">
              🧑‍💼 Register User
            </Link>
          </li>
          <li>
            <Link to="/daily-summary" className="text-primary hover:text-highlight transition">
              📅 Daily Summary
            </Link>
          </li>
        </ul>
      </div>

      <h3 className="text-2xl font-semibold mb-4 text-secondary">🧾 Orders by Waiters</h3>

      {Object.keys(ordersByUser).map((email) => (
        <div key={email} className="mb-8 bg-white rounded-lg shadow p-4">
          <h4 className="text-lg font-semibold flex justify-between items-center mb-2">
            👤 {email}
            <button
              onClick={() => toggleExpand(email)}
              className="bg-primary text-white px-3 py-1 rounded hover:bg-secondary transition"
            >
              {expandedUsers[email] ? "Hide" : "Show"}
            </button>
          </h4>

          {expandedUsers[email] && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Total</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ordersByUser[email].map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-100">
                    <td className="p-2">{order.total}€</td>
                    <td className="p-2">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="text-red-600 hover:text-red-800 font-semibold transition"
                      >
                        ❌ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}
