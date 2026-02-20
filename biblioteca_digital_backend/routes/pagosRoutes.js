import express from "express";
import {
  crearPago,
  obtenerPagos,
  confirmarPago
} from "../controllers/pagosController.js";

const router = express.Router();

router.post("/", crearPago);
router.get("/", obtenerPagos);
router.put("/:id/confirmar", confirmarPago);

export default router;
