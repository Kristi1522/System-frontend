import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminMeetings from './pages/AdminMeetings';
import MyMeetings from './pages/MyMeetings';

import DailySummary from './pages/DailySummary';
import Login from './pages/login';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Orders from './pages/Orders';
import MyOrders from './pages/MyOrders';
import AddDish from './pages/AddDish';
import EditMenu from './pages/EditMenu';
import DeleteDish from './pages/DeleteDish';
import RegisterUser from './pages/RegisterUser';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import AdminCreateReservation from './pages/AdminCreateReservation';
import AdminReservations from './pages/AdminReservations';
import MyReservations from './pages/MyReservations';
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // PWA install prompt
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
        setShowInstallButton(false);
      });
    }
  };

  if (loading) return null;

  return (
    <>
      <Navbar user={user} />
      <Routes>
        {/* Route for login */}
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* Root route "/" opens AdminDashboard */}
        <Route
          path="/"
          element={
            <PrivateRoute user={user}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Routes for all users */}
        <Route
          path="/profile"
          element={
            <PrivateRoute user={user}>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
  path="/admin-meetings"
  element={
    <PrivateRoute user={user} allowedRoles={['admin']}>
      <AdminMeetings />
    </PrivateRoute>
  }
/>

<Route
  path="/my-meetings"
  element={
    <PrivateRoute user={user} allowedRoles={['employee', 'admin']}>
      <MyMeetings />
    </PrivateRoute>
  }
/>

        <Route
          path="/orders"
          element={
            <PrivateRoute user={user} allowedRoles={['admin', 'employee']}>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <PrivateRoute user={user}>
              <MyOrders />
            </PrivateRoute>
          }
        />
        <Route
  path="/admin-reservations"
  element={
    <PrivateRoute user={user} allowedRoles={['admin']}>
      <AdminReservations />
    </PrivateRoute>
  }
/>

<Route
  path="/my-reservations"
  element={
    <PrivateRoute user={user} allowedRoles={['employee', 'admin']}>
      <MyReservations />
    </PrivateRoute>
  }
/>
        {/* Routes for admin only */}
        <Route
  path="/admin-create-reservation"
  element={
    <PrivateRoute user={user} allowedRoles={['admin']}>
      <AdminCreateReservation />
    </PrivateRoute>
  }
/>
        <Route
          path="/admin"
          element={
            <PrivateRoute user={user} allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-dish"
          element={
            <PrivateRoute user={user} allowedRoles={['admin']}>
              <AddDish />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-menu"
          element={
            <PrivateRoute user={user} allowedRoles={['admin']}>
              <EditMenu />
            </PrivateRoute>
          }
        />
        <Route
          path="/register-user"
          element={
            <PrivateRoute user={user} allowedRoles={['admin']}>
              <RegisterUser />
            </PrivateRoute>
          }
        />
        <Route
          path="/daily-summary"
          element={
            <PrivateRoute user={user} allowedRoles={['admin']}>
              <DailySummary />
            </PrivateRoute>
          }
        />
        <Route
          path="/delete-dish"
          element={
            <PrivateRoute user={user} allowedRoles={['admin']}>
              <DeleteDish />
            </PrivateRoute>
          }
        />
      </Routes>

      {/* Install App button (visible only if available) */}
      {showInstallButton && (
        <button
          onClick={handleInstallClick}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px 16px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            zIndex: 1000
          }}
        >
          Install App
        </button>
      )}
    </>
  );
}
