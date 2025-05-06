import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BarChart2,
  LogOut,
  Pencil,
  Trash2,
  UserPlus,
  PlusSquare,
  CalendarDays,
  CalendarPlus,
} from "lucide-react";
import axios from "axios";

const API_URL = "https://system-backend-0i7a.onrender.com";

const menu = [
  { name: "Dashboard", icon: <LayoutDashboard />, path: "/" },
  { name: "Orders", icon: <FileText />, path: "/orders" },
  { name: "Reports", icon: <BarChart2 />, path: "/reports" },
];

const actions = [
  { name: "Add Dish", icon: <PlusSquare />, path: "/add-dish" },
  { name: "Edit Menu", icon: <Pencil />, path: "/edit-menu" },
  { name: "Delete Dish", icon: <Trash2 />, path: "/delete-dish" },
  { name: "Register User", icon: <UserPlus />, path: "/register-user" },
  { name: "Daily Summary", icon: <CalendarDays />, path: "/daily-summary" },
  { name: "Create Reservation", icon: <CalendarPlus />, path: "/admin-create-reservation" },
];

export default function AdminDashboard() {
  const [selected, setSelected] = useState("Dashboard");
  const [summary, setSummary] = useState({ totalIncome: 0, totalOrders: 0, orders: [] });
  const [expandedUsers, setExpandedUsers] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // për navigim real

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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm p-4">
        <h1 className="text-xl font-bold mb-6">Restorant Admin</h1>
        <nav className="space-y-2">
          {menu.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setSelected(item.name);
                navigate(item.path);
              }}
              className={`flex items-center w-full text-left gap-3 p-2 rounded-lg hover:bg-gray-100 transition ${
                selected === item.name ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {item.icon} {item.name}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button className="w-full flex items-center gap-2 justify-start text-sm text-gray-700 hover:text-red-600">
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-4">{selected}</h2>

        {selected === "Dashboard" && (
          <>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-700">Total Income</h3>
                  <p className="text-2xl font-bold mt-2">{summary.totalIncome}€</p>
                </div>
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-700">Total Orders</h3>
                  <p className="text-2xl font-bold mt-2">{summary.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mt-10">
              <h3 className="text-xl font-semibold mb-4 text-secondary">🛠️ Menu Management</h3>
              <ul className="space-y-3">
                {actions.map((action) => (
                  <li key={action.name}>
                    <Link
                      to={action.path}
                      className="flex items-center gap-2 text-primary hover:text-highlight transition"
                    >
                      {action.icon} {action.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {selected === "Orders" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Orders by Waiters</h3>
            {Object.keys(ordersByUser).map((email) => (
              <div key={email} className="mb-6 bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-semibold">👤 {email}</h4>
                  <button
                    onClick={() => toggleExpand(email)}
                    className="bg-primary text-white px-3 py-1 rounded hover:bg-secondary transition"
                  >
                    {expandedUsers[email] ? "Hide" : "Show"}
                  </button>
                </div>
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
        )}
      </main>
    </div>
  );
}
