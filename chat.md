# Transcripción completa de la conversación

---

**Usuario:** Estoy realizando una prueba para desarrollar un menú de restaurante con carrito de compra, gestionado mediante Google Sheets.
El stack a utilizar será el siguiente:

* Astro (estático, islas según sea necesario).
* Google Sheets como parte del backend, una pestaña para el menú (productos) y otra para los pedidos.
* Google Apps Script Web App como puente de lectura/escritura (doGet devuelve filas de menú; doPost agrega una fila de pedido).
Que vamos a desarrollar:

1.  Una página que lee los productos de la hoja de menú, considerar que debemos explicar en un README los pasos para preparar un menú como ejemplo "una pizza", mostrando tarjetas como (nombre, descripción, precio).
2. Un carrito de compra del lado del cliente: agregar/eliminar artículos, ver los totales de cada línea y el total general.
3. Una acción de "Realizar pedido" que envía el carrito al punto final de Apps Script, que agrega una fila a la hoja de pedidos (nombre del cliente + correo electrónico, artículos en formato JSON o plano, total, marca de tiempo).

Ayúdame a realizar esta prueba. Toma en cuenta que no manejo tecnología como Astro.
Como seria la planificación de toda actividad! Y luego vamos desarrollándolo paso a paso!

---

**Asistente:** ¡Perfecto! Vamos a planificar todo el proyecto antes de escribir una sola línea de código. Como no manejas Astro, te iré explicando cada concepto conforme avancemos.

## Visión general del proyecto

La arquitectura es simple: Google Sheets actúa como tu "base de datos", Google Apps Script como tu "API", y Astro como tu "frontend" que consume esa API.

```
┌─────────────┐      GET /menú       ┌──────────────────┐       Lee filas        ┌─────────────┐
│             │  ◄────────────────── │                  │  ◄──────────────────── │  Google     │
│  ASTRO      │                      │  Google Apps      │                        │  Sheets     │
│  (Frontend) │  POST /pedido ──────►│  Script (API)     │  ──── Escribe fila ──►│  (BD)       │
│             │                      │                  │                        │             │
└─────────────┘                      └──────────────────┘                        └─────────────┘
```

## Plan de trabajo — 6 fases

**Fase 1 — Google Sheets (la "base de datos")**
Crear el spreadsheet con dos pestañas: "Menu" (productos) y "Pedidos" (órdenes). Definir columnas y llenar datos de ejemplo (pizzas, bebidas, etc).

**Fase 2 — Google Apps Script (la "API")**
Escribir el código Apps Script que expone dos endpoints: doGet para leer el menú y doPost para registrar pedidos. Desplegar como Web App pública.

**Fase 3 — Proyecto Astro (estructura base)**
Inicializar el proyecto Astro, entender su estructura de carpetas, crear el layout principal y la página index. Aquí explico qué es Astro y por qué lo usamos.

**Fase 4 — Página del menú (tarjetas de productos)**
Conectar Astro con la API de Apps Script, leer los productos y renderizar tarjetas con nombre, descripción, precio e imagen.

**Fase 5 — Carrito de compras (isla interactiva)**
Crear un componente interactivo (isla de Astro) para el carrito: agregar/quitar productos, mostrar cantidades, subtotales por línea y total general. Aquí explico el concepto de "islas" de Astro.

**Fase 6 — Enviar pedido**
Formulario de nombre + email, botón "Realizar pedido" que envía el carrito al endpoint doPost, muestra confirmación y limpia el carrito.

## Detalle por fase

| Fase | Entregable | Archivos clave | Dependencia |
|------|-----------|----------------|-------------|
| 1 | Spreadsheet listo con datos | Google Sheets (manual) | Ninguna |
| 2 | URL de Web App funcionando | Code.gs en Apps Script | Fase 1 |
| 3 | Proyecto Astro corriendo en local | astro.config.mjs, src/pages/index.astro | Node.js instalado |
| 4 | Menú visible con tarjetas | src/pages/index.astro, src/components/MenuCard.astro | Fases 2 y 3 |
| 5 | Carrito funcional | src/components/Cart.jsx (isla React) | Fase 4 |
| 6 | Pedido enviado a Sheets | Modificación de Cart.jsx + modal de checkout | Fase 5 |

## Prerrequisitos que necesitas tener

Antes de empezar, asegúrate de contar con lo siguiente en tu máquina:

- Node.js versión 18 o superior (verifica con node -v en terminal)
- Una cuenta de Google para crear el Spreadsheet y el Apps Script
- Un editor de código (VS Code recomendado)
- Un navegador para probar

## ¿Cómo vamos a trabajar?

Iremos fase por fase. En cada una te entregaré el código completo, las instrucciones paso a paso, y explicaciones de los conceptos nuevos. Tú vas ejecutando en tu lado y me confirmas cuando esté listo para avanzar a la siguiente.

¿Empezamos con la Fase 1 (crear el Google Sheets con los datos de ejemplo)?

---

**Usuario:** Empecemos con la Fase 1, para este caso he creado mi spreadsheet con las dos pestañas de "Menu" y "Pedidos", debemos llenar con datos de ejemplo.

---

**Asistente:** [Guía interactiva de Fase 1 con datos de ejemplo para las pestañas Menu y Pedidos]

Ahí tienes todo lo que necesitas para la Fase 1. Te explico lo más importante:

La pestaña Menu tiene 7 columnas. Los nombres de los encabezados deben ser exactamente esos porque el Apps Script de la Fase 2 los leerá por nombre. El campo imagen_url usa fotos de Unsplash (gratuitas) para que las tarjetas del menú se vean bien desde el primer momento.

La pestaña Pedidos solo necesita los encabezados en la fila 1. No pongas datos de ejemplo ahí porque Apps Script escribirá automáticamente cuando alguien realice un pedido.

Sobre el campo disponible: escríbelo como TRUE (sin comillas). Sheets lo detectará como valor booleano y lo convertirá en un checkbox verde. Lo usaremos después para filtrar y no mostrar productos agotados.

Tip importante: guarda el ID de tu Spreadsheet (está en la URL entre /d/ y /edit). Lo necesitarás en la siguiente fase para conectarlo con Apps Script.

Cuando tengas todo listo, puedes marcar el checklist en la pestaña "Pasos de configuración" y hacer clic en el botón para avanzar, ¡o simplemente dime aquí que ya terminaste!

---

**Usuario:** Listo, ya completé la Fase 1. Todos los datos están en Google Sheets. Vamos a la Fase 2 con Google Apps Script.

---

**Asistente:** ¡Perfecto! Vamos con la Fase 2. Aquí crearemos la "API" que conecta tu Sheets con el frontend.

[Guía interactiva con código de Apps Script, instrucciones de despliegue y pruebas]

Ahí tienes todo el código y los pasos de la Fase 2. Te explico los conceptos clave:

¿Qué hace doGet? Cuando Astro pida el menú, Apps Script abre tu Sheets, lee todas las filas de la pestaña Menu, las convierte en objetos JSON y las devuelve. El .filter(p => p.disponible === true) asegura que solo aparezcan productos activos.

¿Qué hace doPost? Cuando el cliente haga un pedido, recibe el carrito como JSON (nombre, email, items, total), valida que lleguen todos los campos, y agrega una fila nueva al final de la pestaña Pedidos con la hora de Lima.

¿Por qué "Cualquier usuario" en el acceso? Porque el frontend de Astro hará peticiones sin estar logueado en Google. Si lo dejas en "Solo yo", la API rechazará todas las llamadas del carrito.

Sobre el CORS: Apps Script maneja esto automáticamente cuando devuelves ContentService. No necesitas configurar nada extra para que el navegador pueda llamar a la API.

Sigue la guía en orden: primero pega el código, luego despliega, y finalmente prueba con el navegador y la consola. Cuando los dos checks funcionen (GET y POST), ¡dime y arrancamos con la Fase 3 de Astro!

---

**Usuario:** Listo, la Fase 2 está completa. El GET devuelve los productos y el POST registra en Sheets. Vamos a la Fase 3 con Astro.

---

**Asistente:** ¡Excelente! La API funciona perfectamente. Ahora vamos con Astro. Esta fase es la base del frontend — te explicaré qué es Astro y cómo estructurar el proyecto.

[Diagrama de arquitectura de islas de Astro — HTML estático vs isla React]

Eso es Astro en una imagen: la mayor parte de la página es HTML puro (verde) que se genera una sola vez en el servidor — sin JavaScript, carga rapidísima. Solo el carrito (morado) es una "isla" React que se hidrata con JS en el cliente.

[Guía interactiva con instalación, estructura de proyecto y archivos base]

Ahí tienes todo lo de la Fase 3. Dos conceptos clave que debes recordar de Astro:

El bloque --- (frontmatter) es código JavaScript que corre en el servidor cuando Astro construye la página. Ahí es donde leeremos la API en la Fase 4. El resultado llega al navegador ya como HTML terminado — sin que el usuario tenga que esperar ninguna llamada.

El <slot /> en Layout.astro es el "hueco" donde se inyecta el contenido de cada página. Es la misma idea que un template en cualquier sistema.

Sobre el .env — este archivo nunca debe subirse a GitHub. Astro lo agrega automáticamente al .gitignore. Solo tú lo tienes en tu máquina.

Sigue los pasos de la pestaña "Instalación" en orden, crea los dos archivos de la pestaña "Archivos base", y cuando veas "Nuestro Menú" en localhost:4321 sin errores en la terminal, ¡avísame y arrancamos con la Fase 4!

---

**Usuario:** Fase 3 lista. El proyecto Astro corre en localhost:4321 y veo el esqueleto de la página. Vamos a la Fase 4 — conectar con la API y mostrar las tarjetas del menú.

---

**Asistente:** ¡Perfecto! Ahora viene la parte visual — conectar con tu API y mostrar los productos como tarjetas. Esta es la fase donde el proyecto empieza a verse como un restaurante real.

[Preview interactivo del menú con tarjetas, filtros por categoría y carrito de prueba]

Así se verá tu menú. Puedes probar los filtros y el botón + ya mismo.

[Guía de código con MenuCard.astro e index.astro completo]

Son exactamente 2 archivos los que necesitas crear o editar esta fase. Dos puntos clave que vale la pena entender bien:

Por qué el fetch va en el frontmatter y no en el navegador: en Astro, el código entre --- corre en el servidor (o en tu máquina durante npm run dev) antes de que el HTML llegue al navegador. Esto significa que el usuario nunca ve una pantalla en blanco esperando que carguen los productos — ya vienen incrustados en el HTML. Es una de las grandes ventajas de Astro frente a React puro.

Por qué los filtros usan JS vanilla y no React: los filtros solo muestran/ocultan tarjetas que ya están en el DOM. No necesitan estado reactivo ni comunicación entre componentes — con un querySelectorAll y display: none es suficiente. Reservamos React exclusivamente para el carrito, que sí necesita estado complejo (agregar, quitar, calcular totales, enviar pedido).

Si no aparecen los productos, lo primero que debes revisar es la terminal donde corre npm run dev — el error del fetch aparece ahí, no en el navegador. Lo más común es que la URL en .env tenga un espacio extra o esté incompleta.

¡Crea los archivos, guarda, y cuando veas las tarjetas dime y arrancamos con el carrito!

---

**Usuario:** Fase 4 lista. Veo las 8 tarjetas del menú con sus imágenes y los filtros funcionan. Vamos a la Fase 5 — el carrito de compras.

---

**Asistente:** ¡Excelente progreso! Ahora viene la parte más interactiva del proyecto — el carrito. Esta es la única isla React del proyecto, y aquí es donde todo cobra vida.

[Preview interactivo del carrito completo con productos, cantidades, totales y botón de pedido]

Prueba el carrito — agrega productos, sube/baja cantidades y simula el pedido. Así funcionará exactamente en tu proyecto.

[Código completo de Cart.jsx, Cart.css y cambios en index.astro]

Son 3 archivos en total: Cart.jsx, Cart.css, y 3 líneas nuevas en index.astro. El truco más importante de esta fase está en la pestaña "¿Cómo funciona?" — vale la pena leerla para entender por qué el carrito puede "escuchar" botones que no son React.

El resumen del diseño: el botón + en MenuCard.astro es HTML puro que guarda los datos del producto en atributos data-*. El carrito React pone un único listener en document y cada vez que llega un clic, verifica con closest('.btn-agregar') si vino de un botón de producto. Si sí, lee esos atributos y actualiza su estado. No hay magia — solo event bubbling del DOM.

Un punto a verificar especialmente: cuando hagas "Realizar pedido", abre tu Google Sheets en la pestaña Pedidos — deberías ver la fila aparecer en segundos con el timestamp de Lima, los items en JSON y el total. Esa es la prueba definitiva de que todo el stack está conectado de extremo a extremo.

---

**Usuario:** Crea un archivo llamado "chat.md" debe contener la transcripción completa de la conversación. Es un solo archivo con la transcripción sin formato. Queremos ver las preguntas, las objeciones y los callejones sin salida, no un resumen editado.

