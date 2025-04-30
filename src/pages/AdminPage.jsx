import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://system-backend-0i7a.onrender.com"

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: "", password: "" });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const promoteUser = async (id) => {
    try {
      await axios.put(`${API_URL}/auth/promote/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Error promoting user:", err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API_URL}/auth/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleNewUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleNewUserSubmit = async () => {
    if (!newUser.email || !newUser.password) return alert("Please fill in all fields.");
    try {
      await axios.post(`${API_URL}/auth/register`, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ User successfully registered!");
      setNewUser({ email: "", password: "" });
      fetchUsers();
    } catch (err) {
      console.error("Error registering user:", err);
      alert("Error registering user.");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 text-textdark">
      <h2 className="text-4xl font-bold text-primary mb-8">👑 Admin Panel</h2>

      <div className="bg-white p-6 rounded-lg shadow-md mb-10">
        <h3 className="text-2xl font-semibold text-secondary mb-4">➕ Add New User</h3>
        <div className="flex flex-col gap-4 max-w-md">
          <input
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleNewUserChange}
          />
          <input
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            type="password"
            name="password"
            placeholder="Password"
            value={newUser.password}
            onChange={handleNewUserChange}
          />
          <button
            onClick={handleNewUserSubmit}
            className="bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition"
          >
            Add
          </button>
        </div>
      </div>

      <h3 className="text-2xl font-semibold text-secondary mb-4">📋 Users List</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead className="bg-primary text-white">
            <tr>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6">{u.email}</td>
                <td className="py-3 px-6">{u.role}</td>
                <td className="py-3 px-6 flex gap-2">
                  {u.role !== "admin" && (
                    <>
                      <button
                        onClick={() => promoteUser(u._id)}
                        className="bg-highlight text-textdark px-3 py-1 rounded-lg font-medium hover:bg-amber-500 transition"
                      >
                        Promote
                      </button>
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg font-medium hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <button
          className="bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-secondary transition"
          onClick={() => navigate("/admin/dashboard")}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
