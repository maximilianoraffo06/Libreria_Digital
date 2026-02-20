function Table({ columns = [], data = [], actions, emptyText = "Sin datos" }) {

  if (!Array.isArray(data)) {
    return (
      <div className="text-center p-3">
        Cargando datos...
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {actions && <th>Acciones</th>}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="text-center"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={row?.id || index}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render
                      ? col.render(row[col.key], row)
                      : typeof row[col.key] === "object"
                      ? JSON.stringify(row[col.key])
                      : row[col.key] ?? "-"}
                  </td>
                ))}

                {actions && <td>{actions(row)}</td>}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
