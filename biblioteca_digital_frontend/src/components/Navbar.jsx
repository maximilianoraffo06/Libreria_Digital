import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [rol, setRol] = useState(null);

  // 🔹 Detecta si el usuario está logueado y su rol
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRol = localStorage.getItem("rol");
    setToken(savedToken);
    setRol(savedRol);

    // 🔁 Escucha cambios en localStorage (para actualizar el navbar al hacer login/logout)
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      setRol(localStorage.getItem("rol"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 🔹 Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    setToken(null);
    setRol(null);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm custom-navbar px-3">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          📚 Biblioteca Digital
        </Link>

        {/* Botón responsive */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/libros">
                Libros
              </Link>
            </li>

            {/* 🔹 Enlaces visibles solo para el administrador */}
            {rol === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">
                    Panel Admin
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/prestamos">
                    Préstamos
                  </Link>
                </li>
              </>
            )}

            {/* 🔹 Enlace visible solo para usuarios normales */}
            {rol === "usuario" && (
              <li className="nav-item">
                <Link className="nav-link" to="/mis-prestamos">
                  Mis Préstamos
                </Link>
              </li>
            )}
          </ul>

          {/* 🔹 Info de usuario y botones de sesión */}
          <div className="d-flex align-items-center">
            {token && (
              <span className="text-light me-3">
                Rol: <strong>{rol}</strong>
              </span>
            )}

            {!token ? (
              <>
                <Link className="btn btn-outline-light me-2" to="/login">
                  Iniciar sesión
                </Link>
                <Link className="btn btn-success" to="/register">
                  Registrarse
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="btn btn-danger">
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
