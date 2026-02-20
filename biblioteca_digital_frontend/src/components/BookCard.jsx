import Button from "./ui/Button";

function BookCard({ libro, rol, onPrestamo }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm">
        {libro.imagen ? (
          <img
            src={`http://localhost:3000${libro.imagen}`}
            className="card-img-top"
            alt={libro.titulo}
            style={{ height: "250px", objectFit: "cover" }}
          />
        ) : (
          <div
            className="bg-secondary text-white d-flex align-items-center justify-content-center"
            style={{ height: "250px" }}
          >
            Sin imagen
          </div>
        )}

        <div className="card-body">
          <h5 className="card-title">{libro.titulo}</h5>

          <p className="card-text">
            <strong>Autor:</strong> {libro.autor} <br />
            <strong>Editorial:</strong> {libro.editorial || "N/A"} <br />
            <strong>Año:</strong> {libro.año || "N/A"} <br />
            <strong>Estado:</strong>{" "}
            <span
              className={
                libro.estado === "disponible"
                  ? "text-success"
                  : "text-danger"
              }
            >
              {libro.estado}
            </span>
          </p>

          {rol === "usuario" && (
            <Button
              className="w-100"
              disabled={libro.estado === "prestado"}
              onClick={() => onPrestamo(libro.codigo)}
            >
              {libro.estado === "prestado"
                ? "No disponible"
                : "📘 Pedir préstamo"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookCard;
