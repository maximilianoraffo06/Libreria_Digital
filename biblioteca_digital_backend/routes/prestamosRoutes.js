import express from "express";
import {
  listarPrestamos,
  registrarPrestamo,
  devolverLibro,
  borrarPrestamo,
  listarPrestamosDeUsuario,
  confirmarPago,
  obtenerEstadisticas 
} from "../controllers/prestamosController.js";

import { verificarToken, verificarAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();



//   ESTADÍSTICAS DASHBOARD (ADMIN)

router.get(
  "/stats",
  verificarToken,
  verificarAdmin,
  obtenerEstadisticas
);



//   CONFIRMAR PAGO

router.put("/confirmar-pago/:pago_id", verificarToken, confirmarPago);



//   REGISTRAR PRÉSTAMO

router.post("/", verificarToken, registrarPrestamo);



//   LISTAR TODOS (ADMIN)

router.get("/", verificarToken, verificarAdmin, listarPrestamos);



//   DEVOLVER LIBRO

router.put("/devolver/:id", verificarToken, devolverLibro);



//   ELIMINAR PRÉSTAMO (ADMIN)

router.delete("/:id", verificarToken, verificarAdmin, borrarPrestamo);



//   PRÉSTAMOS DEL USUARIO LOGUEADO

router.get(
  "/usuario/mis-prestamos",
  verificarToken,
  listarPrestamosDeUsuario
);

export default router;
