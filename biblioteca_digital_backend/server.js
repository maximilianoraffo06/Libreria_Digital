import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import "./config/db.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import librosRoutes from "./routes/librosRoutes.js";
import prestamosRoutes from "./routes/prestamosRoutes.js";

const app = express();
app.use("/public", express.static("public"));
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/libros", librosRoutes);
app.use("/api/prestamos", prestamosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
