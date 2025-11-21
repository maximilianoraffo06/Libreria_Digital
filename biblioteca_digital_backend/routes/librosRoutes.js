import express from "express";
import {
  listarLibros,
  obtenerUnLibro,
  crearLibro,
  modificarLibro,
  borrarLibro,
  listarLibrosPorBusqueda,
  listarLibrosDisponibles
} from "../controllers/librosController.js";

import { verificarToken, verificarAdmin } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();


//Rutas públicas
router.get("/", listarLibros);
router.get("/buscar/:termino", listarLibrosPorBusqueda);
router.get("/disponibles", listarLibrosDisponibles);
router.get("/:codigo", obtenerUnLibro);



//Solo admin puede agregar, modificar o eliminar libros
router.post("/", verificarToken, verificarAdmin, upload.single("imagen"), crearLibro);
router.put("/:codigo", verificarToken, verificarAdmin, upload.single("imagen"), modificarLibro);
router.delete("/:codigo", verificarToken, verificarAdmin, borrarLibro);

export default router;
