import connection from "../config/db.js";

// 🔹 Listar todos los préstamos (con nombres y títulos)
export const obtenerPrestamos = (callback) => {
  const query = `
    SELECT 
      p.id,
      u.nombre AS usuario_nombre,
      l.titulo AS libro_titulo,
      DATE_FORMAT(p.fecha_prestamo, '%d/%m/%Y %H:%i') AS fecha_prestamo,
      DATE_FORMAT(p.fecha_devolucion_prevista, '%d/%m/%Y %H:%i') AS fecha_devolucion_prevista,
      p.estado
    FROM prestamos p
    JOIN usuarios u ON p.usuario_id = u.id
    JOIN libros l ON p.libro_codigo = l.codigo
    ORDER BY p.id DESC
  `;
  connection.query(query, callback);
};

// 🔹 Agregar un préstamo
export const agregarPrestamo = (prestamo, callback) => {
  const { usuario_id, libro_codigo, fecha_prestamo, fecha_devolucion_prevista } = prestamo;
  const query = `
    INSERT INTO prestamos (usuario_id, libro_codigo, fecha_prestamo, fecha_devolucion_prevista)
    VALUES (?, ?, ?, ?)
  `;
  connection.query(query, [usuario_id, libro_codigo, fecha_prestamo, fecha_devolucion_prevista], callback);
};

// 🔹 Marcar préstamo como devuelto
export const devolverPrestamo = (id, callback) => {
  const query = `
    UPDATE prestamos SET estado = 'devuelto' WHERE id = ?
  `;
  connection.query(query, [id], callback);
};

// 🔹 Eliminar préstamo
export const eliminarPrestamo = (id, callback) => {
  const query = "DELETE FROM prestamos WHERE id = ?";
  connection.query(query, [id], callback);
};

// 🔹 Obtener préstamos de un usuario específico
export const obtenerPrestamosPorUsuario = (usuarioId, callback) => {
  const query = `
    SELECT 
      p.id,
      p.usuario_id,
      u.nombre AS usuario_nombre,
      p.libro_codigo,
      l.titulo AS titulo_libro,
      DATE_FORMAT(p.fecha_prestamo, '%d/%m/%Y %H:%i') AS fecha_prestamo,
      DATE_FORMAT(p.fecha_devolucion_prevista, '%d/%m/%Y') AS fecha_devolucion_prevista,
      p.estado
    FROM prestamos p
    JOIN usuarios u ON p.usuario_id = u.id
    JOIN libros l ON p.libro_codigo = l.codigo
    WHERE p.usuario_id = ?
    ORDER BY p.id DESC
  `;
  connection.query(query, [usuarioId], callback);
};


