import { useEffect, useState } from "react";
import api from "../services/api";
import PageTitle from "../components/ui/PageTitle";
import Table from "../components/ui/Table";
import Button from "../components/ui/Button";
import { formatDate } from "../utils/formatDate";

function PrestamosAdmin() {
  const [prestamos, setPrestamos] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    obtenerPrestamos();
  }, []);

  const obtenerPrestamos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/prestamos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPrestamos(Array.isArray(res.data) ? res.data : []);

    } catch (error) {
      setMensaje("❌ Error al obtener los préstamos");
    }
  };

  const devolverLibro = async (id) => {
    if (!confirm("¿Deseás devolver este libro?")) return;

    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/prestamos/devolver/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensaje("📗 Libro devuelto correctamente");
      obtenerPrestamos();
    } catch (error) {
      setMensaje("❌ Error al devolver el libro");
    }
  };

  const eliminarPrestamo = async (id) => {
    if (!confirm("¿Eliminar préstamo?")) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/prestamos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMensaje("🗑️ Préstamo eliminado");
      obtenerPrestamos();
    } catch (error) {
      setMensaje("❌ Error al eliminar préstamo");
    }
  };

  // Columnas SOLO datos
  const columns = [
    { key: "id", label: "ID" },
    { key: "usuario_nombre", label: "Usuario" },
    { key: "libro_titulo", label: "Libro" },

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
      render: (value) => (
        <span
          className={`badge ${
            value === "prestado" ? "bg-warning" : "bg-success"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  //  Acciones
  const actions = (row) => (
    <>
      {row.estado === "prestado" && (
        <Button
          variant="success"
          className="btn-sm me-2"
          onClick={() => devolverLibro(row.id)}
        >
          Devolver
        </Button>
      )}

      <Button
        variant="danger"
        className="btn-sm"
        onClick={() => eliminarPrestamo(row.id)}
      >
        Eliminar
      </Button>
    </>
  );

  return (
    <div className="container mt-4">
      <PageTitle icon="📘" text="Gestión de Préstamos" />

      {mensaje && (
        <div className="alert alert-info text-center">
          {mensaje}
        </div>
      )}

      <Table
        columns={columns}
        data={prestamos}
        actions={actions}
      />
    </div>
  );
}

export default PrestamosAdmin;
