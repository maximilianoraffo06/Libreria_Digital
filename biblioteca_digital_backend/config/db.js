import mysql from "mysql2";
import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Asegura que dotenv cargue correctamente el archivo .env desde la raíz
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: __dirname + "/../.env" });

console.log("🔍 Variables de conexión:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

connection.connect((error) => {
  if (error) {
    console.error("❌ Error al conectar con la base de datos:", error.message);
  } else {
    console.log("✅ Conexión exitosa a la base de datos MySQL");
  }
});

export default connection;
