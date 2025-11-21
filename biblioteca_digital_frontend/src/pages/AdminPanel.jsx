import { useEffect, useState } from "react";
import api from "../services/api";

function AdminPanel() {
  const [libros, setLibros] = useState([]);
  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    editorial: "",
    año: "",
    estado: "disponible",
    imagen: null,
  });
  const [editando, setEditando] = useState(null);
  const token = localStorage.getItem("token");

  // Obtener todos los libros
  const fetchLibros = async () => {
    try {
      const res = await api.get("/libros");
      setLibros(res.data);
    } catch (error) {
      console.error("Error al obtener libros:", error);
    }
  };

  useEffect(() => {
    fetchLibros();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // Crear o editar libro
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    try {
      if (editando) {
        await api.put(`/libros/${editando}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/libros", data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setFormData({
        titulo: "",
        autor: "",
        editorial: "",
        año: "",
        estado: "disponible",
        imagen: null,
      });
      setEditando(null);
      fetchLibros();
    } catch (error) {
      console.error("Error al guardar libro:", error);
    }
  };

  // Eliminar libro
  const handleDelete = async (codigo) => {
    if (!window.confirm("¿Seguro que deseas eliminar este libro?")) return;
    try {
      await api.delete(`/libros/${codigo}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLibros();
    } catch (error) {
      console.error("Error al eliminar libro:", error);
    }
  };

  // Editar libro
  const handleEdit = (libro) => {
    setEditando(libro.codigo);
    setFormData({
      titulo: libro.titulo,
      autor: libro.autor,
      editorial: libro.editorial,
      año: libro.año,
      estado: libro.estado,
      imagen: null,
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Panel de Administración</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="card p-4 mb-5 shadow-sm">
        <h5>{editando ? "Editar Libro" : "Agregar Libro"}</h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Título</label>
            <input
              type="text"
              className="form-control"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Autor</label>
            <input
              type="text"
              className="form-control"
              name="autor"
              value={formData.autor}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Editorial</label>
            <input
              type="text"
              className="form-control"
              name="editorial"
              value={formData.editorial}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Año</label>
            <input
              type="number"
              className="form-control"
              name="año"
              value={formData.año}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Estado</label>
            <select
              className="form-select"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
            >
              <option value="disponible">Disponible</option>
              <option value="prestado">Prestado</option>
            </select>
          </div>
          <div className="col-md-12 mb-3">
            <label className="form-label">Imagen</label>
            <input
              type="file"
              className="form-control"
              name="imagen"
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-success">
          {editando ? "Actualizar Libro" : "Agregar Libro"}
        </button>
        {editando && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setEditando(null);
              setFormData({
                titulo: "",
                autor: "",
                editorial: "",
                año: "",
                estado: "disponible",
                imagen: null,
              });
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      {/* Lista de libros */}
      <div className="row">
        {libros.map((libro) => (
          <div key={libro.codigo} className="col-md-4 mb-4">
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
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEdit(libro)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(libro.codigo)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;
