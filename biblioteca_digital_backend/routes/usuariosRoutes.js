import express from "express";
import {
  listarUsuarios,
  registrarUsuario,
  loginUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from "../controllers/usuariosController.js";
import { verificarToken, verificarAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rutas públicas
router.post("/register", registrarUsuario);
router.post("/login", loginUsuario);

// Rutas protegidas (requieren token)
router.get("/", verificarToken, listarUsuarios);

// Solo admin puede editar o eliminar usuarios
router.put("/:id", verificarToken, verificarAdmin, actualizarUsuario);
router.delete("/:id", verificarToken, verificarAdmin, eliminarUsuario);

export default router;
