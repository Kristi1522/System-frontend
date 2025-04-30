/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://system-backend-0i7a.onrender.com"

export default function Profile() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      if (!token) {
        setData({ message: "Missing token" });
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(res.data);
      } catch (err) {
        setData({ message: "Invalid or expired token" });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-background p-6 text-textdark flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-primary mb-6">Profile</h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <>
            {data.message && (
              <p className="text-red-500 font-semibold">{data.message}</p>
            )}
            {data.email && (
              <p className="text-lg text-gray-700">
                <strong>Email:</strong> {data.email}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
