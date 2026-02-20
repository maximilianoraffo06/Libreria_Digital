import db from "../config/db.js";

// Obtener todos
export const getAllUsuarios = async () => {
  const [rows] = await db.query(
    "SELECT id, nombre, email, rol, fecha_registro FROM usuarios"
  );
  return rows;
};

// Buscar por email
export const getUsuarioByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email]
  );
  return rows[0];
};

// Crear usuario
export const createUsuario = async (nombre, email, contraseña, rol) => {
  const [result] = await db.query(
    "INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES (?, ?, ?, ?)",
    [nombre, email, contraseña, rol]
  );
  return result.insertId;
};

// Actualizar
export const updateUsuario = async (id, nombre, email, rol) => {
  await db.query(
    "UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?",
    [nombre, email, rol, id]
  );
};

// Eliminar
export const deleteUsuario = async (id) => {
  await db.query("DELETE FROM usuarios WHERE id = ?", [id]);
};
