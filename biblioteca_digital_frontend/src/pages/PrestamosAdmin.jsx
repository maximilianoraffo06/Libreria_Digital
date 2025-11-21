import { useEffect, useState } from "react";
import api from "../services/api";

function PrestamosAdmin() {
  const [prestamos, setPrestamos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [libros, setLibros] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [nuevoPrestamo, setNuevoPrestamo] = useState({
    usuario_id: "",
    libro_codigo: "",
    fecha_prestamo: "",
    fecha_devolucion_prevista: "",
  });

  // 🔹 Cargar datos al iniciar
  useEffect(() => {
    obtenerPrestamos();
    obtenerUsuarios();
    obtenerLibrosDisponibles();
  }, []);

  const obtenerPrestamos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/prestamos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrestamos(res.data);
    } catch (error) {
      setMensaje("Error al obtener los préstamos");
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerLibrosDisponibles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/libros", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLibros(res.data.filter((libro) => libro.estado === "disponible"));
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setNuevoPrestamo({
      ...nuevoPrestamo,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Registrar préstamo nuevo
  const registrarPrestamo = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.post("/prestamos", nuevoPrestamo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje("✅ Préstamo registrado correctamente");
      obtenerPrestamos();
      obtenerLibrosDisponibles();
      setNuevoPrestamo({
        usuario_id: "",
        libro_codigo: "",
        fecha_prestamo: "",
        fecha_devolucion_prevista: "",
      });
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || "Error al registrar préstamo");
    }
  };

  // 🔹 Marcar devolución
  const devolverLibro = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(`/prestamos/devolver/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje("📘 Libro devuelto correctamente");
      obtenerPrestamos();
      obtenerLibrosDisponibles();
    } catch (error) {
      setMensaje("Error al devolver el libro");
    }
  };

  // 🔹 Eliminar préstamo
  const eliminarPrestamo = async (id) => {
    if (!confirm("¿Seguro que querés eliminar este préstamo?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/prestamos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje("🗑️ Préstamo eliminado correctamente");
      obtenerPrestamos();
    } catch (error) {
      setMensaje("Error al eliminar préstamo");
    }
  };

  return (
    <div className="page-container">
      <div className="container">
        <h2 className="mb-4 text-center">📘 Gestión de Préstamos</h2>

        {mensaje && <div className="alert alert-info text-center">{mensaje}</div>}

        {/* 🔹 Formulario para registrar nuevo préstamo */}
        <form onSubmit={registrarPrestamo} className="mb-4 p-3 border rounded shadow-sm bg-light">
          <div className="row">
            <div className="col-md-3 mb-2">
              <label>Usuario</label>
              <select
                className="form-select"
                name="usuario_id"
                value={nuevoPrestamo.usuario_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione usuario</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>{u.nombre}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3 mb-2">
              <label>Libro</label>
              <select
                className="form-select"
                name="libro_codigo"
                value={nuevoPrestamo.libro_codigo}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione libro</option>
                {libros.map((l) => (
                  <option key={l.codigo} value={l.codigo}>{l.titulo}</option>
                ))}
              </select>
            </div>

            <div className="col-md-2 mb-2">
              <label>Fecha préstamo</label>
              <input
                type="date"
                name="fecha_prestamo"
                className="form-control"
                value={nuevoPrestamo.fecha_prestamo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-2 mb-2">
              <label>Devolución prevista</label>
              <input
                type="date"
                name="fecha_devolucion_prevista"
                className="form-control"
                value={nuevoPrestamo.fecha_devolucion_prevista}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button className="btn btn-success w-100">Registrar</button>
            </div>
          </div>
        </form>

        {/* 🔹 Tabla de préstamos */}
        <div className="table-responsive shadow-sm">
          <table className="table table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Libro</th>
                <th>Fecha préstamo</th>
                <th>Fecha devolución prevista</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {prestamos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">No hay préstamos registrados</td>
                </tr>
              ) : (
                prestamos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.usuario_nombre || p.usuario_id}</td>
                    <td>{p.libro_titulo || p.libro_codigo}</td>
                    <td>{p.fecha_prestamo}</td>
                    <td>{p.fecha_devolucion_prevista || "-"}</td>
                    <td>
                      <span className={`badge ${p.estado === "prestado" ? "bg-warning" : "bg-success"}`}>
                        {p.estado}
                      </span>
                    </td>
                    <td>
                      {p.estado === "prestado" && (
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => devolverLibro(p.id)}
                        >
                          Devolver
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => eliminarPrestamo(p.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PrestamosAdmin;
