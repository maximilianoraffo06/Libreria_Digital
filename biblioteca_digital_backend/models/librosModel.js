import connection from "../config/db.js";

export const obtenerLibros = (callback) => {
  connection.query("SELECT * FROM libros", callback);
};

export const obtenerLibroPorCodigo = (codigo, callback) => {
  connection.query("SELECT * FROM libros WHERE codigo = ?", [codigo], callback);
};

export const agregarLibro = (libro, callback) => {
  const { titulo, autor, editorial, año, estado, imagen } = libro;
  connection.query(
    "INSERT INTO libros (titulo, autor, editorial, año, estado, imagen) VALUES (?, ?, ?, ?, ?, ?)",
    [titulo, autor, editorial, año, estado, imagen],
    callback
  );
};

export const actualizarLibro = (codigo, libro, callback) => {
  const { titulo, autor, editorial, año, estado, imagen } = libro;
  connection.query(
    "UPDATE libros SET titulo = ?, autor = ?, editorial = ?, año = ?, estado = ?, imagen = ? WHERE codigo = ?",
    [titulo, autor, editorial, año, estado, imagen, codigo],
    callback
  );
};

export const eliminarLibro = (codigo, callback) => {
  connection.query("DELETE FROM libros WHERE codigo = ?", [codigo], callback);
};
