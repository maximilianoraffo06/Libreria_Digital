import connection from "../config/db.js";

import {
  obtenerLibros,
  obtenerLibroPorCodigo,
  agregarLibro,
  actualizarLibro,
  eliminarLibro
} from "../models/librosModel.js";


// Listar todos
export const listarLibros = async (req, res) => {
  try {
    const libros = await obtenerLibros();
    res.json(libros);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los libros" });
  }
};

// Obtener uno
export const obtenerUnLibro = async (req, res) => {
  try {
    const { codigo } = req.params;
    const libro = await obtenerLibroPorCodigo(codigo);

    if (libro.length === 0)
      return res.status(404).json({ mensaje: "Libro no encontrado" });

    res.json(libro[0]);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el libro" });
  }
};

// Crear
export const crearLibro = async (req, res) => {
  try {
    const { titulo, autor, editorial, año, estado } = req.body;
    const imagen = req.file ? `/public/uploads/${req.file.filename}` : "";

    if (!titulo || !autor) {
      return res.status(400).json({ mensaje: "El título y el autor son obligatorios" });
    }

    await agregarLibro({ titulo, autor, editorial, año, estado, imagen });

    res.status(201).json({ mensaje: "Libro agregado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al agregar el libro" });
  }
};

// Modificar
export const modificarLibro = async (req, res) => {
  try {
    const { codigo } = req.params;
    const { titulo, autor, editorial, año, estado } = req.body;
    const imagen = req.file ? `/public/uploads/${req.file.filename}` : req.body.imagen || "";

    await actualizarLibro(codigo, { titulo, autor, editorial, año, estado, imagen });

    res.json({ mensaje: "Libro actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el libro" });
  }
};

// Borrar
export const borrarLibro = async (req, res) => {
  try {
    const { codigo } = req.params;
    await eliminarLibro(codigo);

    res.json({ mensaje: "Libro eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el libro" });
  }
};

// Buscar
export const listarLibrosPorBusqueda = async (req, res) => {
  try {
    const { termino } = req.params;

    const [rows] = await connection.query(
      `SELECT * FROM libros WHERE titulo LIKE ? OR autor LIKE ?`,
      [`%${termino}%`, `%${termino}%`]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ mensaje: "Error en la búsqueda" });
  }
};

// Disponibles
export const listarLibrosDisponibles = async (req, res) => {
  try {
    const [rows] = await connection.query(
      "SELECT * FROM libros WHERE estado = 'disponible'"
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los libros disponibles" });
  }
};
