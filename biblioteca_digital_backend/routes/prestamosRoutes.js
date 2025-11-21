import express from "express";
import {
  listarPrestamos,
  registrarPrestamo,
  devolverLibro,
  borrarPrestamo,
  listarPrestamosDeUsuario
} from "../controllers/prestamosController.js";
import { verificarToken, verificarAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔹 Listar todos los préstamos (solo admin)
router.get("/", verificarToken, verificarAdmin, listarPrestamos);

// 🔹 Registrar nuevo préstamo (usuario autenticado)
router.post("/", verificarToken, registrarPrestamo);

// 🔹 Marcar devolución (puede hacerlo usuario o admin)
router.put("/devolver/:id", verificarToken, devolverLibro);

// 🔹 Eliminar préstamo (solo admin)
router.delete("/:id", verificarToken, verificarAdmin, borrarPrestamo);

// 🔹 Listar préstamos del usuario autenticado
router.get("/usuario/mis-prestamos", verificarToken, listarPrestamosDeUsuario);

export default router;
