import connection from "../config/db.js";


import {
  obtenerLibros,
  obtenerLibroPorCodigo,
  agregarLibro,
  actualizarLibro,
  eliminarLibro
} from "../models/librosModel.js";


export const listarLibros = (req, res) => {
  obtenerLibros((err, results) => {
    if (err) return res.status(500).json({ mensaje: "Error al obtener los libros" });
    res.json(results);
  });
};

export const obtenerUnLibro = (req, res) => {
  const { codigo } = req.params;
  obtenerLibroPorCodigo(codigo, (err, results) => {
    if (err) return res.status(500).json({ mensaje: "Error al obtener el libro" });
    if (results.length === 0) return res.status(404).json({ mensaje: "Libro no encontrado" });
    res.json(results[0]);
  });
};

export const crearLibro = (req, res) => {
  const { titulo, autor, editorial, año, estado } = req.body;
  const imagen = req.file ? `/public/uploads/${req.file.filename}` : "";

  if (!titulo || !autor) {
    return res.status(400).json({ mensaje: "El título y el autor son obligatorios" });
  }

  agregarLibro({ titulo, autor, editorial, año, estado, imagen }, (err) => {
    if (err) return res.status(500).json({ mensaje: "Error al agregar el libro" });
    res.status(201).json({ mensaje: "Libro agregado correctamente" });
  });
};

export const modificarLibro = (req, res) => {
  const { codigo } = req.params;
  const { titulo, autor, editorial, año, estado } = req.body;
  const imagen = req.file ? `/public/uploads/${req.file.filename}` : req.body.imagen || "";

  actualizarLibro(codigo, { titulo, autor, editorial, año, estado, imagen }, (err) => {
    if (err) return res.status(500).json({ mensaje: "Error al actualizar el libro" });
    res.json({ mensaje: "Libro actualizado correctamente" });
  });
};

export const borrarLibro = (req, res) => {
  const { codigo } = req.params;
  eliminarLibro(codigo, (err) => {
    if (err) return res.status(500).json({ mensaje: "Error al eliminar el libro" });
    res.json({ mensaje: "Libro eliminado correctamente" });
  });
};

export const listarLibrosPorBusqueda = (req, res) => {
  const { termino } = req.params;
  const query = `
    SELECT * FROM libros 
    WHERE titulo LIKE ? OR autor LIKE ?
  `;
  connection.query(query, [`%${termino}%`, `%${termino}%`], (err, results) => {
    if (err) return res.status(500).json({ mensaje: "Error en la búsqueda" });
    res.json(results);
  });
};

export const listarLibrosDisponibles = (req, res) => {
  connection.query("SELECT * FROM libros WHERE estado = 'disponible'", (err, results) => {
    if (err) return res.status(500).json({ mensaje: "Error al obtener los libros disponibles" });
    res.json(results);
  });
};


