import db from "../config/db.js";

/* =========================
   REGISTRAR PRÉSTAMO CON PAGO OBLIGATORIO
========================= */
export const registrarPrestamo = async (req, res) => {
  try {
    await db.beginTransaction();

    const { usuario_id, libro_codigo, fecha_devolucion_prevista, monto } =
      req.body;

    if (!usuario_id || !libro_codigo || !monto || !fecha_devolucion_prevista) {
      await db.rollback();
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios"
      });
    }

    const [libro] = await db.query(
      "SELECT estado FROM libros WHERE codigo = ?",
      [libro_codigo]
    );

    if (libro.length === 0) {
      await db.rollback();
      return res.status(404).json({ mensaje: "Libro no encontrado" });
    }

    if (libro[0].estado !== "disponible") {
      await db.rollback();
      return res.status(400).json({ mensaje: "El libro no está disponible" });
    }

    const [prestamoResult] = await db.query(
      `INSERT INTO prestamos
      (usuario_id, libro_codigo, fecha_prestamo, fecha_devolucion_prevista,
       estado, precio_alquiler, estado_pago, pago_confirmado)
      VALUES (?, ?, CURDATE(), ?, 'prestado', ?, 'pendiente', false)`,
      [usuario_id, libro_codigo, fecha_devolucion_prevista, monto]
    );

    const prestamo_id = prestamoResult.insertId;

    await db.query(
      `INSERT INTO pagos (prestamo_id, monto, estado)
       VALUES (?, ?, 'pendiente')`,
      [prestamo_id, monto]
    );

    await db.query(
      "UPDATE libros SET estado = 'prestado' WHERE codigo = ?",
      [libro_codigo]
    );

    await db.commit();

    res.json({
      mensaje: "Préstamo registrado. Pago pendiente.",
      prestamo_id
    });

  } catch (error) {
    await db.rollback();
    console.error(error);
    res.status(500).json({ mensaje: "Error al registrar préstamo" });
  }
};


/* =========================
   CONFIRMAR PAGO
========================= */
export const confirmarPago = async (req, res) => {
  try {
    await db.beginTransaction();

    const { pago_id } = req.params;

    const [pago] = await db.query(
      "SELECT prestamo_id FROM pagos WHERE id = ?",
      [pago_id]
    );

    if (pago.length === 0) {
      await db.rollback();
      return res.status(404).json({ mensaje: "Pago no encontrado" });
    }

    const prestamo_id = pago[0].prestamo_id;

    await db.query(
      `UPDATE pagos
       SET estado = 'pagado', fecha_pago = NOW()
       WHERE id = ?`,
      [pago_id]
    );

    await db.query(
      `UPDATE prestamos
       SET estado_pago = 'pagado',
           pago_confirmado = true
       WHERE id = ?`,
      [prestamo_id]
    );

    await db.commit();

    res.json({ mensaje: "Pago confirmado correctamente" });

  } catch (error) {
    await db.rollback();
    console.error(error);
    res.status(500).json({ mensaje: "Error al confirmar pago" });
  }
};


/* =========================
   LISTAR PRÉSTAMOS
========================= */
export const listarPrestamos = async (req, res) => {
  try {
    const [prestamos] = await db.query(`
      SELECT 
        p.id,
        u.nombre AS usuario_nombre,
        l.titulo AS libro_titulo,
        p.fecha_prestamo,
        p.fecha_devolucion_prevista,
        p.estado,
        p.precio_alquiler,
        p.estado_pago
      FROM prestamos p
      JOIN usuarios u ON p.usuario_id = u.id
      JOIN libros l ON p.libro_codigo = l.codigo
      ORDER BY p.id DESC
    `);

    res.json(prestamos);

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener préstamos" });
  }
};



/* =========================
   DEVOLVER LIBRO
========================= */
export const devolverLibro = async (req, res) => {
  try {
    const { id } = req.params;

    const [prestamo] = await db.query(
      "SELECT libro_codigo FROM prestamos WHERE id = ?",
      [id]
    );

    if (prestamo.length === 0) {
      return res.status(404).json({ mensaje: "Préstamo no encontrado" });
    }

    const libro_codigo = prestamo[0].libro_codigo;

    await db.query(
      "UPDATE prestamos SET estado = 'devuelto' WHERE id = ?",
      [id]
    );

    await db.query(
      "UPDATE libros SET estado = 'disponible' WHERE codigo = ?",
      [libro_codigo]
    );

    res.json({ mensaje: "Libro devuelto correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al devolver libro" });
  }
};


/* =========================
   BORRAR PRÉSTAMO
========================= */
export const borrarPrestamo = async (req, res) => {
  try {
    const { id } = req.params;

    await db.beginTransaction();

    const [prestamo] = await db.query(
      "SELECT libro_codigo FROM prestamos WHERE id = ?",
      [id]
    );

    if (prestamo.length === 0) {
      await db.rollback();
      return res.status(404).json({ mensaje: "Préstamo no encontrado" });
    }

    const libro_codigo = prestamo[0].libro_codigo;

    // 🔥 1. Borrar pagos asociados primero
    await db.query(
      "DELETE FROM pagos WHERE prestamo_id = ?",
      [id]
    );

    // 🔥 2. Borrar préstamo
    await db.query(
      "DELETE FROM prestamos WHERE id = ?",
      [id]
    );

    // 🔥 3. Liberar libro
    await db.query(
      "UPDATE libros SET estado = 'disponible' WHERE codigo = ?",
      [libro_codigo]
    );

    await db.commit();

    res.json({ mensaje: "Préstamo eliminado correctamente" });

  } catch (error) {
    await db.rollback();
    console.error(error);
    res.status(500).json({ mensaje: "Error al borrar préstamo" });
  }
};



/* =========================
   LISTAR PRÉSTAMOS DEL USUARIO
========================= */
export const listarPrestamosDeUsuario = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;

    const [prestamos] = await db.query(`
      SELECT p.*, l.titulo
      FROM prestamos p
      JOIN libros l ON p.libro_codigo = l.codigo
      WHERE p.usuario_id = ?
      ORDER BY p.id DESC
    `, [usuario_id]);

    res.json(prestamos);

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener préstamos del usuario" });
  }
};


//Estadisticas

export const obtenerEstadisticas = async (req, res) => {
  try {
    const [totalLibros] = await db.query(
      "SELECT COUNT(*) AS total FROM libros"
    );

    const [totalUsuarios] = await db.query(
      "SELECT COUNT(*) AS total FROM usuarios"
    );

    const [prestamosActivos] = await db.query(
      "SELECT COUNT(*) AS total FROM prestamos WHERE estado = 'prestado'"
    );

    const [prestamosVencidos] = await db.query(`
      SELECT COUNT(*) AS total 
      FROM prestamos 
      WHERE estado = 'prestado' 
      AND fecha_devolucion_prevista < CURDATE()
    `);

    res.json({
      totalLibros: totalLibros[0].total,
      totalUsuarios: totalUsuarios[0].total,
      prestamosActivos: prestamosActivos[0].total,
      prestamosVencidos: prestamosVencidos[0].total,
    });

  } catch (error) {
    console.error("Error en estadísticas:", error);
    res.status(500).json({ message: "Error al obtener estadísticas" });
  }
};
