/* eslint-disable no-unused-vars */
import { useState } from 'react';
import axios from 'axios';

const API_URL = "https://system-backend-0i7a.onrender.com"

export default function AddDish() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    try {
      await axios.post(`${API_URL}/dishes`, { name, price, description }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("✅ Dish added successfully!");
      setName('');
      setPrice('');
      setDescription('');
    } catch (err) {
      alert("❌ Error while adding the dish");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <h2 className="text-3xl font-bold text-primary mb-8">Add New Dish</h2>
      
      <input
        className="w-full max-w-md p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      
      <input
        className="w-full max-w-md p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      
      <input
        className="w-full max-w-md p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      
      <button
        onClick={handleAdd}
        className="w-full max-w-md bg-primary text-white font-semibold py-3 rounded-lg hover:bg-secondary transition transform hover:-translate-y-1"
      >
        Add
      </button>
    </div>
  );
}
