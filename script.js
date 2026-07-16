// Catálogo de maquillaje en tonos tierra
const productos = [
  {
    id: 1,
    nombre: "Paleta de Sombras Andrea Earth", // <-- Cambiado de Sienna a Andrea
    descripcion: "9 tonos ultra-pigmentados cafés cálidos y terracotas",
    precio: 85000,
    categoria: "Paletas",
    img: "assets/images/paleta-sienna.jpg"
  },
  {
    id: 2,
    nombre: "Labial Líquido Mate Desert Nude",
    descripcion: "Tono marrón suave, hidratante de larga duración",
    precio: 45000,
    categoria: "Labiales",
    img: "assets/images/labial-nude.jpg"
  },
  {
    id: 3,
    nombre: "Iluminador Compacto Golden Sand",
    descripcion: "Textura satinada con reflejos dorados cálidos",
    precio: 65000,
    categoria: "Rostro",
    img: "assets/images/iluminador-gold.jpg"
  },
  {
    id: 4,
    nombre: "Rubor Mineral Clay Terracotta",
    descripcion: "Aporta un acabado bronceado natural y saludable",
    precio: 52000,
    categoria: "Rostro",
    img: "assets/images/rubor-terracota.jpg"
  },
  {
    id: 5,
    nombre: "Labial Velvet Cocoa",
    descripcion: "Acabado aterciopelado tono café chocolate profundo",
    precio: 45000,
    categoria: "Labiales",
    img: "assets/images/labial-cocoa.jpg"
  },
  {
    id: 6,
    nombre: "Paleta de Rostro Clay & Contour",
    descripcion: "Trío de contorno, iluminador y rubor en tonos arcilla",
    precio: 95000,
    categoria: "Rostro",
    img: "assets/images/paleta-rostro.jpg"
  }
];

const telefono = "573186848158";

let carrito = new Map();
let ratings = {};

// Inicializar el sistema de votación (ELO)
productos.forEach(producto => {
  ratings[producto.id] = 1000;
});

function formatear(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(valor);
}

function obtenerProductosFiltradosYOrdenados() {
  const categoria = document.getElementById("categoria").value;
  const orden = document.getElementById("ordenar").value;

  let lista = [...productos];

  if (categoria !== "todos") {
    lista = lista.filter(producto => producto.categoria === categoria);
  }

  if (orden === "menor-precio") {
    lista.sort((a, b) => a.precio - b.precio);
  } else if (orden === "mayor-precio") {
    lista.sort((a, b) => b.precio - a.precio);
  } else if (orden === "nombre") {
    lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  return lista;
}

function plantillaProducto(producto) {
  return `
    <article class="producto">
      <div class="producto-img-wrap">
        <img src="${producto.img}" alt="${producto.nombre}">
        <span class="producto-tag">${producto.categoria}</span>
      </div>

      <div class="producto-info">
        <h3>${producto.nombre}</h3>
        <p class="producto-desc">${producto.descripcion}</p>

        <div class="producto-footer">
          <p class="producto-precio">${formatear(producto.precio)}</p>
          <button class="btn btn-primary" onclick="add(${producto.id})">Agregar</button>
        </div>
      </div>
    </article>
  `;
}

function renderProductos() {
  const contenedor = document.getElementById("productos");
  const lista = obtenerProductosFiltradosYOrdenados();
  contenedor.innerHTML = lista.map(plantillaProducto).join("");
}

function add(id) {
  const producto = productos.find(item => item.id === id);

  if (carrito.has(id)) {
    carrito.get(id).cantidad++;
  } else {
    carrito.set(id, { ...producto, cantidad: 1 });
  }

  renderCarrito();
}

function cambiarCantidad(id, cambio) {
  if (!carrito.has(id)) return;

  const producto = carrito.get(id);
  producto.cantidad += cambio;

  if (producto.cantidad <= 0) {
    carrito.delete(id);
  }

  renderCarrito();
}

function renderCarrito() {
  const lista = document.getElementById("lista-carrito");
  let total = 0;
  let cantidad = 0;

  if (carrito.size === 0) {
    lista.innerHTML = `<li class="carrito-vacio">Tu carrito está vacío por ahora.</li>`;
  } else {
    lista.innerHTML = "";

    carrito.forEach(producto => {
      total += producto.precio * producto.cantidad;
      cantidad += producto.cantidad;

      lista.innerHTML += `
        <li class="item-carrito">
          <div class="item-carrito-info">
            <strong>${producto.nombre}</strong>
            <span>${formatear(producto.precio)} c/u</span>
          </div>

          <div class="item-carrito-actions">
            <button onclick="cambiarCantidad(${producto.id}, -1)">−</button>
            <span>${producto.cantidad}</span>
            <button onclick="cambiarCantidad(${producto.id}, 1)">+</button>
          </div>
        </li>
      `;
    });
  }

  document.getElementById("total").innerText = formatear(total);
  document.getElementById("cantidad-carrito").innerText = cantidad;
}

function vaciarCarrito() {
  carrito.clear();
  renderCarrito();
}

function finalizarCompra() {
  if (carrito.size === 0) {
    alert("Agrega al menos un producto al carrito.");
    return;
  }

  // Modificado con el nombre comercial del cliente:
  let mensaje = "Hola Andrea Makeup, quiero hacer este pedido:\n\n";
  let total = 0;

  carrito.forEach(producto => {
    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;
    mensaje += `- ${producto.nombre} x${producto.cantidad} = ${formatear(subtotal)}\n`;
  });

  mensaje += `\nTotal: ${formatear(total)}\n`;
  mensaje += "Entrega: domicilio en Zipaquirá o envío nacional\n";
  mensaje += "Método de pago: por confirmar";

  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

function renderRecomendados() {
  const contenedor = document.getElementById("recomendados");

  const top = [...productos]
    .sort((a, b) => ratings[b.id] - ratings[a.id])
    .slice(0, 4);

  contenedor.innerHTML = top.map(plantillaProducto).join("");
}

function renderTop() {
  const contenedor = document.getElementById("top-elo");

  const ranking = [...productos].sort((a, b) => ratings[b.id] - ratings[a.id]);

  contenedor.innerHTML = ranking.map((producto, index) => `
    <article class="ranking-card">
      <img src="${producto.img}" alt="${producto.nombre}">
      <div class="ranking-info">
        <span class="ranking-position">#${index + 1}</span>
        <h3>${producto.nombre}</h3>
        <p>${formatear(producto.precio)}</p>
        <div class="ranking-puntos">${ratings[producto.id]} puntos</div>
      </div>
    </article>
  `).join("");
}

function duelo() {
  const contenedor = document.getElementById("duelo-container");

  let a;
  let b;

  do {
    a = productos[Math.floor(Math.random() * productos.length)];
    b = productos[Math.floor(Math.random() * productos.length)];
  } while (a.id === b.id);

  contenedor.innerHTML = `
    <article class="duelo-card">
      <img src="${a.img}" alt="${a.nombre}">
      <div class="duelo-card-content">
        <h3>${a.nombre}</h3>
        <p>${a.descripcion}</p>
        <button class="btn btn-primary" onclick="votar(${a.id}, ${b.id})">Elegir esta</button>
      </div>
    </article>

    <article class="duelo-card">
      <img src="${b.img}" alt="${b.nombre}">
      <div class="duelo-card-content">
        <h3>${b.nombre}</h3>
        <p>${b.descripcion}</p>
        <button class="btn btn-primary" onclick="votar(${b.id}, ${a.id})">Elegir esta</button>
      </div>
    </article>
  `;
}

function votar(ganadora, perdedora) {
  ratings[ganadora] += 10;
  ratings[perdedora] -= 10;

  renderTop();
  renderRecomendados();
  duelo();
}

document.getElementById("categoria").addEventListener("change", renderProductos);
document.getElementById("ordenar").addEventListener("change", renderProductos);

// Inicializar la tienda
renderProductos();
renderCarrito();
renderRecomendados();
renderTop();
duelo();
