import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Libros from "./pages/Libros";
import AdminPanel from "./pages/AdminPanel";
import PrestamosAdmin from "./pages/PrestamosAdmin";
import Prestamos from "./pages/Prestamos";


function App() {
  return (
    <Router>
      {/* Navbar global */}
      <Navbar />

      {/* Contenedor principal */}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/libros" element={<Libros />} />
          <Route path="/admin/prestamos" element={<PrestamosAdmin />} />
          <Route path="/mis-prestamos" element={<Prestamos />} />


          {/* Ruta protegida */}
          <Route
            path="/admin"
            element={
              localStorage.getItem("rol") === "admin" ? (
                <AdminPanel />
              ) : (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
                  <div className="text-center">
                    <h2 className="text-danger">🚫 Acceso denegado</h2>
                    <p>Esta sección es solo para administradores.</p>
                  </div>
                </div>
              )
            }
          />

          {/* Ruta por defecto */}
          <Route path="/" element={<Libros />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
