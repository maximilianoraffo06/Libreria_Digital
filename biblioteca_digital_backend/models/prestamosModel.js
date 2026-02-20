import connection from "../config/db.js";

// ⭐ Listar todos los préstamos
export const obtenerPrestamos = async () => {
  const [rows] = await connection.query(`
    SELECT 
      p.id,
      u.nombre AS usuario_nombre,
      l.titulo AS libro_titulo,
      DATE_FORMAT(p.fecha_prestamo, '%d/%m/%Y %H:%i') AS fecha_prestamo,
      DATE_FORMAT(p.fecha_devolucion_prevista, '%d/%m/%Y %H:%i') AS fecha_devolucion_prevista,
      p.estado,
      p.precio_alquiler,
      p.estado_pago
    FROM prestamos p
    JOIN usuarios u ON p.usuario_id = u.id
    JOIN libros l ON p.libro_codigo = l.codigo
    ORDER BY p.id DESC
  `);

  return rows;
};


// ⭐ Agregar préstamo
export const agregarPrestamo = async (prestamo) => {
  const {
    usuario_id,
    libro_codigo,
    fecha_prestamo,
    fecha_devolucion_prevista,
    precio_alquiler = 0,
    estado_pago = "pendiente"
  } = prestamo;

  const [result] = await connection.query(
    `INSERT INTO prestamos 
     (usuario_id, libro_codigo, fecha_prestamo, fecha_devolucion_prevista, precio_alquiler, estado_pago)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      usuario_id,
      libro_codigo,
      fecha_prestamo,
      fecha_devolucion_prevista,
      precio_alquiler,
      estado_pago
    ]
  );

  return result.insertId;
};


// ⭐ Devolver préstamo
export const devolverPrestamo = async (id) => {
  await connection.query(
    "UPDATE prestamos SET estado = 'devuelto' WHERE id = ?",
    [id]
  );
};


// ⭐ Eliminar préstamo
export const eliminarPrestamo = async (id) => {
  await connection.query(
    "DELETE FROM prestamos WHERE id = ?",
    [id]
  );
};


// ⭐ Obtener préstamos de un usuario
export const obtenerPrestamosPorUsuario = async (usuarioId) => {
  const [rows] = await connection.query(`
    SELECT 
      p.id,
      p.usuario_id,
      u.nombre AS usuario_nombre,
      p.libro_codigo,
      l.titulo AS titulo_libro,
      DATE_FORMAT(p.fecha_prestamo, '%d/%m/%Y %H:%i') AS fecha_prestamo,
      DATE_FORMAT(p.fecha_devolucion_prevista, '%d/%m/%Y') AS fecha_devolucion_prevista,
      p.estado,
      p.precio_alquiler,
      p.estado_pago
    FROM prestamos p
    JOIN usuarios u ON p.usuario_id = u.id
    JOIN libros l ON p.libro_codigo = l.codigo
    WHERE p.usuario_id = ?
    ORDER BY p.id DESC
  `, [usuarioId]);

  return rows;
};
