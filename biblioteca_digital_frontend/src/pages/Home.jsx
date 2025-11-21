import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container d-flex flex-column align-items-center justify-content-center text-center">
      <h1 className="mb-3">📚 Bienvenido a la Biblioteca Digital</h1>
      <p className="lead mb-4">
        Explora, consulta y gestiona tus préstamos de libros desde un solo lugar.  
        Accede al catálogo, reserva tus lecturas favoritas y disfruta del conocimiento.
      </p>

      <div>
        <Link to="/libros" className="btn btn-primary btn-lg mx-2">
          Ver Catálogo
        </Link>
        <Link to="/login" className="btn btn-outline-dark btn-lg mx-2">
          Iniciar Sesión
        </Link>
      </div>
    </div>
  );
}

export default Home;
