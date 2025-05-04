import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [date, setDate] = useState('');
  const [people, setPeople] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  // Merr rezervimet nga backend
  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/reservations/my', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Kontroll nëse është array
      if (Array.isArray(res.data)) {
        setReservations(res.data);
        setError('');
      } else {
        setReservations([]);
        setError('Të dhënat nuk janë në formatin e pritur.');
      }
    } catch (err) {
      console.error('Gabim gjatë marrjes së rezervimeve:', err);
      setError('Nuk u morën dot rezervimet.');
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Dërgon një rezervim të ri
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        '/api/reservations',
        { date, people, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDate('');
      setPeople('');
      setNote('');
      fetchReservations(); // rifresko listën pas shtimit
    } catch (err) {
      console.error('Gabim gjatë shtimit:', err);
      setError('Rezervimi nuk u shtua.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Rezervimet e mia</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="number"
          value={people}
          onChange={(e) => setPeople(e.target.value)}
          placeholder="Nr. personave"
          required
        />
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Shënim (opsional)"
        />
        <button type="submit">Shto Rezervim</button>
      </form>

      <ul>
        {reservations.length > 0 ? (
          reservations.map((r) => (
            <li key={r._id}>
              {new Date(r.date).toLocaleString()} – {r.people} persona – {r.note}
            </li>
          ))
        ) : (
          <li>S'ka rezervime.</li>
        )}
      </ul>
    </div>
  );
};

export default Reservations;
