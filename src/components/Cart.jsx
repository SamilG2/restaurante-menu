import './Cart.css';
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.PUBLIC_APPS_SCRIPT_URL;

const fmt = (n) => new Intl.NumberFormat('es-PE', {
  style: 'currency', currency: 'PEN'
}).format(n);

export default function Cart() {
  const [items,    setItems]    = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [exito,    setExito]    = useState(false);
  const [nombre,   setNombre]   = useState('');
  const [email,    setEmail]    = useState('');
  const [formError,setFormError]= useState('');

  // Escucha clicks en los botones "+" de las MenuCards
  useEffect(() => {
    const handleAdd = (e) => {
      const btn = e.target.closest('.btn-agregar');
      if (!btn) return;
      const { id, nombre, precio } = btn.dataset;
      setItems(prev => {
        const ex = prev.find(i => i.id === id);
        if (ex) return prev.map(i =>
          i.id === id ? { ...i, qty: i.qty + 1 } : i
        );
        return [...prev, { id, nombre, precio: parseFloat(precio), qty: 1 }];
      });
    };
    document.addEventListener('click', handleAdd);
    return () => document.removeEventListener('click', handleAdd);
  }, []);

  const changeQty = (id, delta) =>
    setItems(prev =>
      prev
        .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
    );

  const total = items.reduce((s, i) => s + i.precio * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  const handlePedir = async () => {
    if (!nombre.trim()) { setFormError('Ingresa tu nombre'); return; }
    if (!email.trim() || !email.includes('@')) { setFormError('Ingresa un email válido'); return; }
    setFormError('');
    setEnviando(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({
          nombre,
          email,
          items: items.map(({ id, nombre, precio, qty }) =>
            ({ id, nombre, precio, qty })
          ),
          total: parseFloat(total.toFixed(2)),
        }),
      });
      const json = await res.json();
      if (json.ok) {
        setExito(true);
        setItems([]);
        setNombre('');
        setEmail('');
      } else {
        setFormError(json.error || 'Error al enviar el pedido');
      }
    } catch {
      setFormError('Sin conexión. Intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  // ── Pantalla de éxito ──
  if (exito) return (
    <div className="cart-success">
      <div className="success-icon">✓</div>
      <h3>¡Pedido recibido!</h3>
      <p>Gracias {nombre}. Tu pedido está en camino.</p>
      <button className="btn-nuevo" onClick={() => setExito(false)}>
        Hacer otro pedido
      </button>
    </div>
  );

  // ── Carrito vacío ──
  if (items.length === 0) return (
    <div className="cart-empty">
      <span className="cart-icon">🛒</span>
      <p>Tu carrito está vacío</p>
      <small>Haz clic en + para agregar productos</small>
    </div>
  );

  // ── Carrito con items ──
  return (
    <div className="cart-box">
      <div className="cart-header">
        <h2>Tu pedido</h2>
        <span className="cart-count">{count}</span>
      </div>

      <ul className="cart-items">
        {items.map(item => (
          <li key={item.id} className="cart-item">
            <span className="item-nombre">{item.nombre}</span>
            <div className="qty-ctrl">
              <button onClick={() => changeQty(item.id, -1)} aria-label="Quitar uno">−</button>
              <span>{item.qty}</span>
              <button onClick={() => changeQty(item.id, +1)} aria-label="Agregar uno">+</button>
            </div>
            <span className="item-sub">{fmt(item.precio * item.qty)}</span>
          </li>
        ))}
      </ul>

      <div className="cart-total">
        <span>Total</span>
        <strong>{fmt(total)}</strong>
      </div>

      <div className="cart-form">
        <input
          type="text" placeholder="Tu nombre"
          value={nombre} onChange={e => setNombre(e.target.value)}
        />
        <input
          type="email" placeholder="Tu email"
          value={email} onChange={e => setEmail(e.target.value)}
        />
        {formError && <p className="form-error">{formError}</p>}
        <button
          className="btn-pedir"
          onClick={handlePedir}
          disabled={enviando}
        >
          {enviando ? 'Enviando...' : 'Realizar pedido'}
        </button>
      </div>
    </div>
  );
}