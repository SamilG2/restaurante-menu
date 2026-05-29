const fmt = (n) => new Intl.NumberFormat('es-PE', {
  style: 'currency', currency: 'PEN', minimumFractionDigits: 2,
}).format(n);

export default function MenuCard({ producto }) {
  const { id, nombre, descripcion, precio, categoria, imagen_url } = producto;
  return (
    <article className="card" data-categoria={categoria}>
      <div className="card-img-wrap">
        <img
          src={imagen_url}
          alt={nombre}
          loading="lazy"
          onError={e => { e.target.style.display = 'none'; }}
        />
      </div>
      <div className="card-body">
        <span className="categoria">{categoria}</span>
        <h2 className="nombre">{nombre}</h2>
        <p className="descripcion">{descripcion}</p>
        <div className="card-footer">
          <span className="precio">{fmt(precio)}</span>
          <button
            className="btn-agregar"
            data-id={id}
            data-nombre={nombre}
            data-precio={precio}
            aria-label={`Agregar ${nombre} al carrito`}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}
