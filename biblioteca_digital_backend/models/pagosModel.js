import db from "../config/db.js";


// Crear pago
export const crearPago = async (prestamo_id, monto, metodo_pago) => {

  const [result] = await db.query(
    `INSERT INTO pagos (prestamo_id, monto, metodo_pago, estado)
     VALUES (?, ?, ?, 'pendiente')`,
    [prestamo_id, monto, metodo_pago]
  );

  return {
    mensaje: "Pago creado correctamente",
    pago_id: result.insertId
  };
};


// Obtener pagos
export const obtenerPagos = async () => {

  const [rows] = await db.query(`
    SELECT p.*, pr.usuario_id, pr.libro_codigo
    FROM pagos p
    JOIN prestamos pr ON p.prestamo_id = pr.id
    ORDER BY p.id DESC
  `);

  return rows;
};


// Confirmar pago
export const confirmarPago = async (pagoId) => {

  await db.query(
    "UPDATE pagos SET estado = 'pagado', fecha_pago = NOW() WHERE id = ?",
    [pagoId]
  );
};
