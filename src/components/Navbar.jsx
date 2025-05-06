import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 w-full bg-primary text-white p-4 flex justify-center items-center gap-6 shadow-md z-50">
      {!user ? (
        <Link className="hover:text-highlight transition" to="/login">
          Login
        </Link>
      ) : (
        <>
          <Link className="hover:text-highlight transition" to="/profile">
            Profile
          </Link>

          {/* 🔒 ADMIN */}
          {user.role === "admin" && (
            <>
              <Link className="hover:text-highlight transition" to="/admin">
                Admin
              </Link>
              <Link className="hover:text-highlight transition" to="/daily-summary">
                Daily Summary
              </Link>
              <Link className="hover:text-highlight transition" to="/admin-create-reservation">
                ➕ Shto rezervim
              </Link>
              <Link className="hover:text-highlight transition" to="/admin-reservations">
                📋 Të gjitha rezervimet
              </Link>
            </>
          )}

          {/* 👷‍♀️ EMPLOYEE */}
          {user.role === "employee" && (
            <>
              <Link className="hover:text-highlight transition" to="/orders">
                Orders
              </Link>
              <Link className="hover:text-highlight transition" to="/my-orders">
                My Orders
              </Link>
              <Link className="hover:text-highlight transition" to="/my-reservations">
                Rezervimet e mia
              </Link>
            </>
          )}

          {/* 🔓 LOGOUT */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-semibold"
          >
            Dil
          </button>
        </>
      )}
    </nav>
  );
}
