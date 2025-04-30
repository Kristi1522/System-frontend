import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://system-backend-0i7a.onrender.com"

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });

      if (res.status === 200) {
        localStorage.setItem('user', JSON.stringify(res.data));
        localStorage.setItem('token', res.data.token);
        setUser(res.data);

        if (res.data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/orders");
        }
      } else {
        alert('Incorrect login!');
      }
    } catch (err) {
      console.error('❌ Error during login:', err.response?.data || err.message);
      alert('Incorrect email or password!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col gap-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold text-center text-primary">Login</h2>

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

        <button
          type="submit"
          className="bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
