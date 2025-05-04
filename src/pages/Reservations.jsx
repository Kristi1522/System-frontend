import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://system-backend-0i7a.onrender.com';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [date, setDate] = useState('');
  const [people, setPeople] = useState('');
  const [note, setNote] = useState('');

  const token = JSON.parse(localStorage.getItem('user'))?.token;

  // Merr rezervimet e mia
  const fetchReservations = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/reservations/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(res.data);
    } catch (err) {
      console.error('❌ Error fetching reservations:', err);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [token]);

  const submitReservation = async () => {
    try {
      await axios.post(
        `${API_URL}/api/reservations`,
        { date, people, note },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('✅ Rezervimi u shtua me sukses!');
      setDate('');
      setPeople('');
      setNote('');
      fetchReservations();
    } catch (err) {
      console.error('❌ Error submitting reservation:', err);
      alert('Gabim gjatë shtimit të rezervimit.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Rezervimet e mia</h2>

      <div className="grid gap-4 mb-6">
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2"
        />
        <input
          type="number"
          value={people}
          onChange={(e) => setPeople(e.target.value)}
          placeholder="Numri i personave"
          className="border p-2"
        />
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Shënim (opsional)"
          className="border p-2"
        />
        <button
          onClick={submitReservation}
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          Shto Rezervim
        </button>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Lista e rezervimeve</h3>
        {reservations.length === 0 ? (
          <p className="text-gray-500">Nuk ka asnjë rezervim.</p>
        ) : (
          <ul className="space-y-2">
            {reservations.map((r) => (
              <li key={r._id} className="border p-2 rounded">
                <strong>{new Date(r.date).toLocaleString()}</strong> — {r.people} persona
                {r.note && ` — "${r.note}"`}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
