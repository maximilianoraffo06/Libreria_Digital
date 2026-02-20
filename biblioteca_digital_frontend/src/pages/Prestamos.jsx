import { useEffect, useState } from "react";
import api from "../services/api";
import PageTitle from "../components/ui/PageTitle";
import Table from "../components/ui/Table";
import Button from "../components/ui/Button";
import { formatDate } from "../utils/formatDate";

function Prestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [mensaje, setMensaje] = useState("");

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
    if (!window.confirm("¿Querés devolver este libro?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/prestamos/devolver/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensaje("📗 Libro devuelto correctamente");
      obtenerMisPrestamos();
    } catch (error) {
      setMensaje("❌ Error al devolver el libro");
    }
  };

  const columns = [
    { key: "id", label: "ID" },

    { key: "titulo", label: "Libro" },

    {
      key: "fecha_prestamo",
      label: "Fecha préstamo",
      render: (value) => formatDate(value),
    },

    {
      key: "fecha_devolucion_prevista",
      label: "Devolución",
      render: (value) => formatDate(value),
    },

    {
      key: "estado",
      label: "Estado",
      render: (estado) => (
        <span
          className={`badge ${
            estado === "prestado" ? "bg-warning" : "bg-success"
          }`}
        >
          {estado}
        </span>
      ),
    },

    {
      key: "acciones",
      label: "Acción",
      render: (_, row) =>
        row.estado === "prestado" && (
          <Button
            variant="success"
            className="btn-sm"
            onClick={() => devolverLibro(row.id)}
          >
            Devolver
          </Button>
        ),
    },
  ];

  return (
    <div className="container mt-4">
      <PageTitle icon="📚" text="Mis Préstamos" />

      {mensaje && (
        <div className="alert alert-info text-center">{mensaje}</div>
      )}

      <Table
        columns={columns}
        data={prestamos}
        emptyText="No tenés préstamos registrados"
      />
    </div>
  );
}

export default Prestamos;
