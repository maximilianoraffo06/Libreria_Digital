import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  getAllUsuarios,
  getUsuarioByEmail,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../models/usuariosModel.js";

dotenv.config();

//Listar todos los usuarios
export const listarUsuarios = (req, res) => {
  getAllUsuarios((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

//Registrar usuario
export const registrarUsuario = async (req, res) => {
  const { nombre, email, contraseña } = req.body;
  if (!nombre || !email || !contraseña) {
    return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
  }

  getUsuarioByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length > 0) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);
    createUsuario(nombre, email, hashedPassword, "usuario", (err2) => {
      if (err2) return res.status(500).json({ error: err2 });
      res.json({ mensaje: "Usuario registrado exitosamente" });
    });
  });
};

//Login
export const loginUsuario = (req, res) => {
  const { email, contraseña } = req.body;
  getUsuarioByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) {
      return res.status(401).json({ mensaje: "Usuario no encontrado" });
    }

    const usuario = results[0];
    const passwordValido = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!passwordValido) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
  mensaje: "Inicio de sesión exitoso",
  token,
  rol: usuario.rol,
  id: usuario.id,
  nombre: usuario.nombre,
});


  });
};

//Actualizar usuario
export const actualizarUsuario = (req, res) => {
  const { id } = req.params;
  const { nombre, email, rol } = req.body;
  updateUsuario(id, nombre, email, rol, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ mensaje: "Usuario actualizado correctamente" });
  });
};

//Eliminar usuario
export const eliminarUsuario = (req, res) => {
  const { id } = req.params;
  deleteUsuario(id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ mensaje: "Usuario eliminado correctamente" });
  });
};
