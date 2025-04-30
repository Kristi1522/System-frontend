import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://system-backend-0i7a.onrender.com"

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const filtered = res.data.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= today;
      });

      setOrders(filtered);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
    }
  };

  const totalRevenue = orders
    .filter(order => !order.shiftClosed)
    .reduce((sum, order) => sum + order.totalPrice, 0);

  const handleEndShiftAndPrint = async () => {
    if (orders.length === 0) return;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`  
      <h3>🧾 Shift Summary</h3>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
      <hr />
      ${orders.filter(o => !o.shiftClosed).map((order, index) => `
        <div>
          Invoice #${index + 1}: ${order.user?.email || "Unknown"} – 
          ${order.totalPrice.toFixed(2)}€ (${new Date(order.createdAt).toLocaleTimeString()})
        </div>
      `).join('')}
      <hr />
      <p><strong>Total Revenue:</strong> ${totalRevenue.toFixed(2)}€</p>
      <p><strong>Number of Orders:</strong> ${orders.filter(o => !o.shiftClosed).length}</p>
    `);
    printWindow.document.close();
    printWindow.print();

    try {
      await axios.put(`${API_URL}/orders/close-shift`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ Shift closed successfully!");
      fetchOrders();
    } catch (err) {
      console.error("❌ Error closing shift:", err);
      alert("Error closing the shift!");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 text-textdark">
      <h2 className="text-4xl font-bold text-primary mb-8">📄 Today's Orders</h2>

      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-primary text-white">
            <tr>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Total (€)</th>
              <th className="py-3 px-6 text-left">Date and Time</th>
              <th className="py-3 px-6 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6">{order.user?.email || "Unknown"}</td>
                <td className="py-3 px-6">{order.totalPrice.toFixed(2)}€</td>
                <td className="py-3 px-6">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="py-3 px-6">{order.shiftClosed ? "🔒 Closed" : "🟢 Active"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <table className="w-full max-w-md mx-auto bg-white shadow rounded-lg overflow-hidden">
          <tbody>
            <tr>
              <td className="py-4 px-6 font-semibold text-center">
                Total Revenue Today (Active Only)
              </td>
              <td className="py-4 px-6 text-center font-bold text-lg">
                {totalRevenue.toFixed(2)}€
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleEndShiftAndPrint}
          disabled={totalRevenue === 0}
          className={`py-3 px-6 rounded-lg font-semibold transition ${
            totalRevenue === 0
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-primary hover:bg-secondary text-white"
          }`}
        >
          🔒 End Shift and Print Summary
        </button>
      </div>
    </div>
  );
}
