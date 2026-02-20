import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavItem from "./NavItem";
import { navLinks } from "../config/navLinks";

function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const syncAuth = () => {
      setToken(localStorage.getItem("token"));
      setRol(localStorage.getItem("rol"));
    };

    syncAuth();
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setRol(null);
    navigate("/login");
  };

  const linksToShow = [
    ...navLinks.common,
    ...(rol === "usuario" ? navLinks.usuario : []),
    ...(rol === "admin" ? navLinks.admin : []),
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          📚 Biblioteca Digital
        </Link>

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
            {linksToShow.map((link) => (
              <NavItem key={link.to} {...link} />
            ))}
          </ul>

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
