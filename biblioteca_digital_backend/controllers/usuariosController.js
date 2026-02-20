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

// Listar usuarios
export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await getAllUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Registrar usuario
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, contraseña } = req.body;

    if (!nombre || !email || !contraseña) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    const usuarioExistente = await getUsuarioByEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);
    await createUsuario(nombre, email, hashedPassword, "usuario");

    res.json({ mensaje: "Usuario registrado exitosamente" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
export const loginUsuario = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    const usuario = await getUsuarioByEmail(email);

    if (!usuario) {
      return res.status(401).json({ mensaje: "Usuario no encontrado" });
    }

    const passwordValido = await bcrypt.compare(
      contraseña,
      usuario.contraseña
    );

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

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar usuario
export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, rol } = req.body;

    await updateUsuario(id, nombre, email, rol);

    res.json({ mensaje: "Usuario actualizado correctamente" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar usuario
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteUsuario(id);

    res.json({ mensaje: "Usuario eliminado correctamente" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
