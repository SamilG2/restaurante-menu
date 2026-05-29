# Restaurante Menú

Menú digital para restaurante construido con Astro y React. Los productos se obtienen desde Google Sheets vía Apps Script y se renderizan en el cliente. El cliente puede filtrar por categoría y agregar productos a un carrito que envía el pedido por email.

---

## Stack

- [Astro](https://astro.build/) — framework principal
- React — isla interactiva para el carrito y el menú
- Google Apps Script — API que expone los datos de Google Sheets
- Vercel — Deploy

---

## Correr localmente

```bash
npm install
npm run dev
```

Requiere un archivo `.env` en la raíz:

```
PUBLIC_APPS_SCRIPT_URL=<tu_url_de_apps_script>
```

---

## Qué haría con una hora más

Guardaría el carrito en `localStorage` para que no se vacíe al recargar la página. También me hubiera gustado que el menú tuviera imágenes propias del restaurante en lugar de fotos de Unsplash. Y si el negocio crece, lo primero que cambiaría es la forma en que el carrito y el menú se comunican: ahora usan eventos del DOM, lo cual funciona pero es frágil.

---

## Supuestos que tomé

- El origen de los datos es Google Sheets, accesible mediante un Apps Script desplegado como Web App pública (sin autenticación).
- El formato de respuesta de la API es `{ ok: true, data: [...] }` con los campos `id`, `nombre`, `descripcion`, `precio`, `categoria`, `imagen_url` y `disponible`.
- No se requiere panel de administración; los productos se gestionan directamente en la hoja de cálculo.
- El carrito envía el pedido vía POST al mismo Apps Script, que registra el pedido en otra hoja y notifica por email.
- Se asume conexión a internet en el dispositivo del cliente, ya que el menú se carga en tiempo de ejecución desde la API.
