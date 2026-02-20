import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//Verificar si el token JWT es válido
export const verificarToken = (req, res, next) => {
  console.log("HEADERS RECIBIDOS:", req.headers);

  const authHeader = req.headers.authorization || req.headers.Authorization;


  if (!authHeader) {
    return res.status(401).json({ mensaje: "Acceso denegado. Token no proporcionado." });
  }


  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; //Guarda los datos del usuario en la request
    next();
  } catch (error) {
    res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
};

//Verificar si el usuario tiene rol admin
export const verificarAdmin = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ mensaje: "No se pudo verificar el usuario" });
  }

  if (req.usuario.rol !== "admin") {
    return res.status(403).json({ mensaje: "Acceso restringido: solo administradores" });
  }

  next();
};
