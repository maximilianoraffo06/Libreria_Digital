import { useEffect, useState } from "react";
import api from "../services/api";
import PageTitle from "../components/ui/PageTitle";

function DashboardAdmin() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerStats();
  }, []);

  const obtenerStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/prestamos/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border"></div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <PageTitle icon="📊" text="Dashboard Administrativo" />

      <div className="row mt-4">

        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5>📚 Libros</h5>
              <h2>{stats.totalLibros}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5>👤 Usuarios</h5>
              <h2>{stats.totalUsuarios}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5>📘 Préstamos Activos</h5>
              <h2>{stats.prestamosActivos}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center shadow-sm border-danger">
            <div className="card-body">
              <h5>🔴 Vencidos</h5>
              <h2 className="text-danger">{stats.prestamosVencidos}</h2>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DashboardAdmin;
