import './Menu.css';
import { useState, useEffect } from 'react';
import MenuCard from './MenuCard.jsx';

const API_URL = import.meta.env.PUBLIC_APPS_SCRIPT_URL;

export default function Menu() {
  const [productos,  setProductos]  = useState([]);
  const [error,      setError]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [categoria,  setCategoria]  = useState('Todos');

  useEffect(() => {
    fetch(API_URL, { redirect: 'follow' })
      .then(r => r.json())
      .then(json => {
        if (json.ok) setProductos(json.data);
        else setError(json.error);
      })
      .catch(() => setError('No se pudo cargar el menú. Intenta de nuevo más tarde.'))
      .finally(() => setLoading(false));
  }, []);

  const categorias = ['Todos', ...new Set(productos.map(p => p.categoria))];
  const filtrados  = categoria === 'Todos'
    ? productos
    : productos.filter(p => p.categoria === categoria);

  if (loading) return (
    <p style={{ textAlign: 'center', color: '#6b6b6b', padding: '2rem' }}>
      Cargando menú...
    </p>
  );

  if (error) return (
    <div className="error-box">
      <strong>Error al cargar el menú:</strong> {error}
    </div>
  );

  return (
    <>
      <div className="filtros">
        {categorias.map(cat => (
          <button
            key={cat}
            className={`filtro-btn ${cat === categoria ? 'active' : ''}`}
            onClick={() => setCategoria(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="menu-grid">
        {filtrados.map(p => (
          <MenuCard key={p.id} producto={p} />
        ))}
      </div>
    </>
  );
}
