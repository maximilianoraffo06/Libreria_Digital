function PageTitle({ icon, text }) {
  return (
    <h2 className="mb-4 text-center">
      {icon && <span className="me-2">{icon}</span>}
      {text}
    </h2>
  );
}

export default PageTitle;
