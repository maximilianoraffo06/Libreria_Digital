import {
  obtenerPrestamos,
  agregarPrestamo,
  devolverPrestamo,
  eliminarPrestamo,
  obtenerPrestamosPorUsuario
} from "../models/prestamosModel.js";
import connection from "../config/db.js";

//Listar préstamos
export const listarPrestamos = (req, res) => {
  obtenerPrestamos((err, results) => {
    if (err) return res.status(500).json({ mensaje: "Error al obtener los préstamos" });
    res.json(results);
  });
};

//Listar préstamos del usuario autenticado
export const listarPrestamosDeUsuario = (req, res) => {
  const usuarioId = req.usuario.id;
  obtenerPrestamosPorUsuario(usuarioId, (err, results) => {
    if (err) return res.status(500).json({ mensaje: "Error al obtener préstamos del usuario" });
    res.json(results);
  });
};


// Registrar préstamo
export const registrarPrestamo = (req, res) => {
  const { usuario_id, libro_codigo, fecha_prestamo, fecha_devolucion_prevista } = req.body;

  if (!usuario_id || !libro_codigo || !fecha_prestamo) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
  }

  //Verificar si el libro está disponible
  connection.query(
    "SELECT estado FROM libros WHERE codigo = ?",
    [libro_codigo],
    (err, results) => {
      if (err) return res.status(500).json({ mensaje: "Error al verificar el estado del libro" });

      if (results.length === 0) {
        return res.status(404).json({ mensaje: "El libro no existe" });
      }

      const { estado } = results[0];

      //Si el libro ya está prestado, no permitir nuevo préstamo
      if (estado === "prestado") {
        return res.status(400).json({ mensaje: "El libro ya está prestado" });
      }

      //Si el libro está disponible, registrar el préstamo
      agregarPrestamo({ usuario_id, libro_codigo, fecha_prestamo, fecha_devolucion_prevista }, (err) => {
        if (err) return res.status(500).json({ mensaje: "Error al registrar el préstamo" });

        //Actualizar el estado del libro a "prestado"
        connection.query(
          "UPDATE libros SET estado = 'prestado' WHERE codigo = ?",
          [libro_codigo],
          (error) => {
            if (error) return res.status(500).json({ mensaje: "Error al actualizar el estado del libro" });
            res.status(201).json({ mensaje: "Préstamo registrado correctamente" });
          }
        );
      });
    }
  );
};

// Marcar devolución
export const devolverLibro = (req, res) => {
  const { id } = req.params;

  devolverPrestamo(id, (err) => {
    if (err) return res.status(500).json({ mensaje: "Error al registrar la devolución" });

    // Actualizar el estado del libro a "disponible"
    connection.query(
      "UPDATE libros SET estado = 'disponible' WHERE codigo = (SELECT libro_codigo FROM prestamos WHERE id = ?)",
      [id],
      (error) => {
        if (error) return res.status(500).json({ mensaje: "Error al actualizar el estado del libro" });
        res.json({ mensaje: "Libro devuelto correctamente" });
      }
    );
  });
};

// Eliminar préstamo
export const borrarPrestamo = (req, res) => {
  const { id } = req.params;
  eliminarPrestamo(id, (err) => {
    if (err) return res.status(500).json({ mensaje: "Error al eliminar el préstamo" });
    res.json({ mensaje: "Préstamo eliminado correctamente" });
  });
};
