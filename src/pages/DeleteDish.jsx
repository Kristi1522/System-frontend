import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://system-backend-0i7a.onrender.com"

export default function DeleteDish() {
  const [dishes, setDishes] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await axios.get(`${API_URL}/dishes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDishes(res.data);
      } catch (err) {
        console.error("❌ Error fetching dishes:", err.message);
      }
    };

    fetchDishes();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dish?")) return;

    try {
      await axios.delete(`${API_URL}/dishes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDishes((prev) => prev.filter((dish) => dish._id !== id));
      alert("✅ Dish deleted successfully!");
    } catch (err) {
      console.error("❌ Error deleting dish:", err.message);
      alert("Error deleting the dish.");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 text-textdark">
      <h2 className="text-4xl font-bold text-red-600 mb-8">❌ Delete Dishes from Menu</h2>

      <ul className="space-y-4">
        {dishes.map((dish) => (
          <li key={dish._id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md hover:bg-gray-100 transition">
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-primary">{dish.name}</span>
              <span className="text-gray-600">{dish.price}€</span>
            </div>
            <button
              onClick={() => handleDelete(dish._id)}
              className="bg-red-500 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
