import { useEffect, useState } from "react";
import api from "../services/api";

function Libros() {
  const [libros, setLibros] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");
  const usuarioId = localStorage.getItem("usuarioId");

  // Obtener libros
  useEffect(() => {
    fetchLibros();
  }, []);

  const fetchLibros = async () => {
    try {
      const res = await api.get("/libros");
      setLibros(res.data);
    } catch (error) {
      console.error("Error al obtener los libros:", error);
    }
  };

  // Buscar libros
  const buscarLibros = async (e) => {
    e.preventDefault();
    if (!busqueda.trim()) return fetchLibros();

    try {
      const res = await api.get(`/libros/buscar/${busqueda}`);
      setLibros(res.data);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    }
  };

  // Pedir préstamo
  const pedirPrestamo = async (codigoLibro) => {
    if (!token) {
      alert("Debes iniciar sesión para pedir un préstamo.");
      return;
    }

    try {
      await api.post(
        "/prestamos",
        {
          usuario_id: usuarioId,
          libro_codigo: codigoLibro,
          fecha_prestamo: new Date().toISOString().split("T")[0],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("📘 Préstamo registrado correctamente");
      fetchLibros(); // actualizar estado de los libros
    } catch (error) {
      alert(
        error.response?.data?.mensaje ||
          "Error al registrar el préstamo. Puede que el libro ya esté prestado."
      );
    }
  };

  return (
    <div className="page-container">
      <div className="container">
        <h2 className="mb-4 text-center">Catálogo de Libros</h2>

        {/* Barra de búsqueda */}
        <form onSubmit={buscarLibros} className="d-flex mb-4">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Buscar por título o autor..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Buscar
          </button>
        </form>

        {/* Grilla de libros */}
        <div className="row">
          {libros.length > 0 ? (
            libros.map((libro) => (
              <div key={libro.codigo} className="col-md-4 col-sm-6 mb-4">
                <div className="card h-100 shadow-sm">
                  {libro.imagen ? (
                    <img
                      src={`http://localhost:3000${libro.imagen}`}
                      className="card-img-top"
                      alt={libro.titulo}
                      style={{ height: "250px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="bg-secondary text-white d-flex align-items-center justify-content-center"
                      style={{ height: "250px" }}
                    >
                      Sin imagen
                    </div>
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{libro.titulo}</h5>
                    <p className="card-text">
                      <strong>Autor:</strong> {libro.autor} <br />
                      <strong>Editorial:</strong> {libro.editorial || "N/A"} <br />
                      <strong>Año:</strong> {libro.año || "N/A"} <br />
                      <strong>Estado:</strong>{" "}
                      <span
                        className={
                          libro.estado === "disponible"
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        {libro.estado}
                      </span>
                    </p>

                    {/* 🔹 Botón de préstamo */}
                    {rol === "usuario" && (
                      <button
                        className="btn btn-sm btn-primary w-100"
                        onClick={() => pedirPrestamo(libro.codigo)}
                        disabled={libro.estado === "prestado"}
                      >
                        {libro.estado === "prestado"
                          ? "No disponible"
                          : "📘 Pedir préstamo"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center mt-4">No se encontraron libros</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Libros;
