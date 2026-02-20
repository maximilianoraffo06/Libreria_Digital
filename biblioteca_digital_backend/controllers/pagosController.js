import * as pagosModel from "../models/pagosModel.js";
import connection from "../config/db.js";



// Crear pago manual

export const crearPago = async (req, res) => {
  try {
    const { prestamo_id, monto, metodo_pago } = req.body;

    if (!prestamo_id || !monto) {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios"
      });
    }

    const result = await pagosModel.crearPago(
      prestamo_id,
      monto,
      metodo_pago
    );

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



// Obtener pagos

export const obtenerPagos = async (req, res) => {
  try {
    const pagos = await pagosModel.obtenerPagos();
    res.json(pagos);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



// Confirmar pago + actualizar préstamo

export const confirmarPago = async (req, res) => {
  try {

    const pagoId = req.params.id;

    // Confirmar pago en tabla pagos
    await pagosModel.confirmarPago(pagoId);

    // Buscar préstamo asociado al pago
    const [pago] = await connection.query(
      "SELECT prestamo_id FROM pagos WHERE id = ?",
      [pagoId]
    );

    if (pago.length === 0) {
      return res.status(404).json({
        mensaje: "Pago no encontrado"
      });
    }

    const prestamoId = pago[0].prestamo_id;

    // Actualizar estado_pago en prestamos
    await connection.query(
      "UPDATE prestamos SET estado_pago = 'pagado' WHERE id = ?",
      [prestamoId]
    );

    res.json({
      mensaje: "Pago confirmado correctamente"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
