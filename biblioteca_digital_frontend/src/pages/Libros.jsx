import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PageTitle from "../components/ui/PageTitle";
import BookCard from "../components/BookCard";

function Libros() {
  const [libros, setLibros] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const rol = localStorage.getItem("rol");

  const navigate = useNavigate();

  useEffect(() => {
    fetchLibros();
  }, []);

  const fetchLibros = async () => {
    try {
      const res = await api.get("/libros");
      setLibros(res.data);
    } catch (error) {
      console.error("Error al obtener libros");
    }
  };

  const buscarLibros = async (e) => {
    e.preventDefault();
    if (!busqueda.trim()) return fetchLibros();

    try {
      const res = await api.get(`/libros/buscar/${busqueda}`);
      setLibros(res.data);
    } catch (error) {
      console.error("Error en la búsqueda");
    }
  };

  
  const pedirPrestamo = (codigoLibro) => {

    // Redirige a la página de pago
    navigate(`/pago/${codigoLibro}`);

  };

  return (
    <div className="container mt-4">
      <PageTitle icon="📚" text="Catálogo de Libros" />

      <form onSubmit={buscarLibros} className="d-flex mb-4">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Buscar por título o autor"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button className="btn btn-primary">Buscar</button>
      </form>

      <div className="row">
        {libros.length > 0 ? (
          libros.map((libro) => (
            <BookCard
              key={libro.codigo}
              libro={libro}
              rol={rol}
              onPrestamo={pedirPrestamo}
            />
          ))
        ) : (
          <p className="text-center">No se encontraron libros</p>
        )}
      </div>
    </div>
  );
}

export default Libros;
