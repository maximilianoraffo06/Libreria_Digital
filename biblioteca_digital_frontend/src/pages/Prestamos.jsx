import { useEffect, useState } from "react";
import api from "../services/api";

function Prestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // Cargar préstamos del usuario al iniciar
  useEffect(() => {
    obtenerMisPrestamos();
  }, []);

  const obtenerMisPrestamos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/prestamos/usuario/mis-prestamos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrestamos(res.data);
    } catch (error) {
      setMensaje("Error al obtener tus préstamos");
    }
  };

  const devolverLibro = async (id) => {
    if (!confirm("¿Querés devolver este libro?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.put(`/prestamos/devolver/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje("📗 Libro devuelto correctamente");
      obtenerMisPrestamos();
    } catch (error) {
      setMensaje("❌ Error al devolver el libro");
    }
  };

  return (
    <div className="page-container">
      <div className="container">
        <h2 className="mb-4 text-center">📚 Mis Préstamos</h2>

        {mensaje && <div className="alert alert-info text-center">{mensaje}</div>}

        <div className="table-responsive shadow-sm">
          <table className="table table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Libro</th>
                <th>Fecha préstamo</th>
                <th>Fecha devolución prevista</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {prestamos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No tenés préstamos registrados
                  </td>
                </tr>
              ) : (
                prestamos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.titulo_libro}</td>
                    <td>{p.fecha_prestamo}</td>
                    <td>{p.fecha_devolucion_prevista || "-"}</td>
                    <td>
                      <span
                        className={`badge ${
                          p.estado === "prestado" ? "bg-warning" : "bg-success"
                        }`}
                      >
                        {p.estado}
                      </span>
                    </td>
                    <td>
                      {p.estado === "prestado" && (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => devolverLibro(p.id)}
                        >
                          Devolver
                        </button>
                      )}
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

export default Prestamos;
