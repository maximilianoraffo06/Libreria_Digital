import connection from "../config/db.js";

// Obtener todos los libros
export const obtenerLibros = async () => {
  const [rows] = await connection.query("SELECT * FROM libros");
  return rows;
};

// Obtener libro por código
export const obtenerLibroPorCodigo = async (codigo) => {
  const [rows] = await connection.query(
    "SELECT * FROM libros WHERE codigo = ?",
    [codigo]
  );
  return rows;
};

// Agregar libro
export const agregarLibro = async (libro) => {
  const { titulo, autor, editorial, año, estado, imagen } = libro;

  await connection.query(
    "INSERT INTO libros (titulo, autor, editorial, año, estado, imagen) VALUES (?, ?, ?, ?, ?, ?)",
    [titulo, autor, editorial, año, estado, imagen]
  );
};

// Actualizar libro
export const actualizarLibro = async (codigo, libro) => {
  const { titulo, autor, editorial, año, estado, imagen } = libro;

  await connection.query(
    "UPDATE libros SET titulo = ?, autor = ?, editorial = ?, año = ?, estado = ?, imagen = ? WHERE codigo = ?",
    [titulo, autor, editorial, año, estado, imagen, codigo]
  );
};

// Eliminar libro
export const eliminarLibro = async (codigo) => {
  await connection.query(
    "DELETE FROM libros WHERE codigo = ?",
    [codigo]
  );
};
