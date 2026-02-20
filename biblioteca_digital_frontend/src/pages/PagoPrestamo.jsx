import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function PagoPrestamo() {

  const { codigoLibro } = useParams();
  const navigate = useNavigate();

  const usuarioId = localStorage.getItem("usuarioId");

  const [libro, setLibro] = useState(null);
  const [metodoPago, setMetodoPago] = useState("tarjeta");
  const [loading, setLoading] = useState(false);

  // Datos tarjeta
  const [tarjeta, setTarjeta] = useState({
    numero: "",
    titular: "",
    vencimiento: "",
    cvv: ""
  });

  const precio = 1500; //  Precio fijo alquiler

  
  // Obtener info del libro
  
  useEffect(() => {
    const fetchLibro = async () => {
      try {
        const res = await api.get(`/libros/${codigoLibro}`);
        setLibro(res.data);
      } catch (error) {
        alert("Error al obtener libro");
      }
    };

    fetchLibro();
  }, [codigoLibro]);

 
  // Validar tarjeta
  
  const validarTarjeta = () => {

    if (tarjeta.numero.length < 16)
      return "Número de tarjeta inválido";

    if (!tarjeta.titular)
      return "Ingrese titular";

    if (!tarjeta.vencimiento)
      return "Ingrese vencimiento";

    if (tarjeta.cvv.length < 3)
      return "CVV inválido";

    return null;
  };


  // Confirmar pago

  const confirmarPago = async () => {

    if (metodoPago === "tarjeta") {
      const error = validarTarjeta();
      if (error) return alert(error);
    }

    try {
      setLoading(true);

      if (!usuarioId) {
        alert("Usuario no autenticado");
        return;
      }

      //  Generar fecha devolución (+7 días)
      const fecha = new Date();
      fecha.setDate(fecha.getDate() + 7);
      const fechaDevolucion = fecha.toISOString().split("T")[0];

      //  Crear préstamo
      const prestamoRes = await api.post("/prestamos", {
        usuario_id: usuarioId,
        libro_codigo: Number(codigoLibro),
        fecha_devolucion_prevista: fechaDevolucion,
        monto: precio
      });

      const prestamoId = prestamoRes.data.prestamo_id;

      //  Crear pago asociado
      const pagoRes = await api.post("/pagos", {
        prestamo_id: prestamoId,
        monto: precio,
        metodo_pago: metodoPago
      });

      const pagoId = pagoRes.data.pago_id;

      //  Confirmar pago
      await api.put(`/pagos/${pagoId}/confirmar`);

      alert("✅ Pago realizado y préstamo registrado");

      navigate("/mis-prestamos");

    } catch (error) {
      console.error(error.response?.data || error);
      alert(error.response?.data?.mensaje || "Error al procesar pago");
    } finally {
      setLoading(false);
    }
  };

  if (!libro) return <p className="text-center mt-5">Cargando...</p>;

  return (
    <div className="container mt-5">

      <div className="card shadow p-4">

        <h3 className="mb-4 text-center">💳 Pago de Préstamo</h3>

        {/* ===== Datos del libro ===== */}
        <div className="mb-4">
          <h5>📘 {libro.titulo}</h5>
          <p>Autor: {libro.autor}</p>
          <p className="fw-bold text-success">
            Precio alquiler: ${precio}
          </p>
        </div>

        {/* ===== Método de pago ===== */}
        <div className="mb-3">
          <label className="form-label">Método de pago</label>

          <select
            className="form-select"
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
          >
            <option value="tarjeta">Tarjeta</option>
          </select>
        </div>

        {/* ===== Tarjeta ===== */}
        {metodoPago === "tarjeta" && (

          <div className="border p-3 rounded mb-3">

            <input
              className="form-control mb-2"
              placeholder="Número tarjeta"
              value={tarjeta.numero}
              onChange={(e) =>
                setTarjeta({ ...tarjeta, numero: e.target.value })
              }
            />

            <input
              className="form-control mb-2"
              placeholder="Titular"
              value={tarjeta.titular}
              onChange={(e) =>
                setTarjeta({ ...tarjeta, titular: e.target.value })
              }
            />

            <div className="d-flex gap-2">
              <input
                className="form-control"
                placeholder="MM/AA"
                value={tarjeta.vencimiento}
                onChange={(e) =>
                  setTarjeta({ ...tarjeta, vencimiento: e.target.value })
                }
              />

              <input
                className="form-control"
                placeholder="CVV"
                value={tarjeta.cvv}
                onChange={(e) =>
                  setTarjeta({ ...tarjeta, cvv: e.target.value })
                }
              />
            </div>

          </div>
        )}


        {/* ===== Botón ===== */}
        <button
          className="btn btn-success w-100"
          onClick={confirmarPago}
          disabled={loading}
        >
          {loading ? "Procesando..." : "Confirmar Pago"}
        </button>

      </div>
    </div>
  );
}

export default PagoPrestamo;
