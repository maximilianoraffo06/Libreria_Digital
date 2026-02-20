import { Link } from "react-router-dom";

function NavItem({ to, label }) {
  return (
    <li className="nav-item">
      <Link className="nav-link" to={to}>
        {label}
      </Link>
    </li>
  );
}

export default NavItem;
