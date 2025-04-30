import { useState } from "react";
import axios from "axios";

const API_URL = "https://system-backend-0i7a.onrender.com"

export default function RegisterUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/auth/register`,
        { email, password, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ User registered successfully!");
      setEmail("");
      setPassword("");
      setRole("employee");
    } catch (err) {
      console.error("❌ Error during registration:", err.response?.data || err.message);
      alert("Error during registration.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-primary mb-8 text-center">🧑‍💼 Register New User</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="bg-primary text-white font-semibold py-3 rounded-lg hover:bg-secondary transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
