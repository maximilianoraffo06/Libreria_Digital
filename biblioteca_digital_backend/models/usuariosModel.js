import db from "../config/db.js";

// Obtener todos los usuarios
export const getAllUsuarios = (callback) => {
  const sql = "SELECT id, nombre, email, rol, fecha_registro FROM usuarios";
  db.query(sql, callback);
};

// Buscar usuario por email
export const getUsuarioByEmail = (email, callback) => {
  const sql = "SELECT * FROM usuarios WHERE email = ?";
  db.query(sql, [email], callback);
};

// Crear nuevo usuario
export const createUsuario = (nombre, email, contraseña, rol, callback) => {
  const sql = "INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES (?, ?, ?, ?)";
  db.query(sql, [nombre, email, contraseña, rol], callback);
};

// Actualizar usuario
export const updateUsuario = (id, nombre, email, rol, callback) => {
  const sql = "UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?";
  db.query(sql, [nombre, email, rol, id], callback);
};

// Eliminar usuario
export const deleteUsuario = (id, callback) => {
  const sql = "DELETE FROM usuarios WHERE id = ?";
  db.query(sql, [id], callback);
};
