// Inicializar EmailJS
(function(){
  emailjs.init("kNnQqIhvRmz2kjVEP"); // tu llave pública
})();

const productos = [
  {
    id:1,
    nombre:"Maceta de cerámica",
    precio:250,
    desc:"Maceta decorativa de cerámica esmaltada en color blanco mate, tamaño mediano 15 cm de alto x 18 cm de diámetro. Diseño geométrico en relieve con acabado moderno y base incluida para mayor estabilidad. Ideal para suculentas o plantas pequeñas.",
    img:"img/producto1.jpg"
  },
  {
    id:2,
    nombre:"Lámpara minimalista",
    precio:1200,
    desc:"Lámpara colgante de estilo moderno con estructura metálica en color negro mate y detalles en dorado. Diseño ondulado contemporáneo, cable ajustable y base rectangular. Medida: 80 cm de largo. Ideal para sala o comedor.",
    img:"img/producto2.jpg"
  },
  {
    id:3,
    nombre:"Reloj de pared moderno",
    precio:800,
    desc:"Reloj de pared redondo de 40 cm de diámetro, fabricado en metal con acabado plateado brillante. Números grandes en relieve y diseño minimalista elegante. Funciona con batería AA (no incluida).",
    img:"img/producto3.jpg"
  },
  {
    id:4,
    nombre:"Set de velas aromáticas",
    precio:450,
    desc:"Set de tres velas aromáticas en envases de vidrio translúcido en tonos blanco y azul claro. Cada vela mide 8 cm de alto. Incluyen fragancias suaves relajantes y tapa protectora. Perfectas para decoración y ambientación.",
    img:"img/producto4.jpg"
  },
  {
    id:5,
    nombre:"Cuadro abstracto",
    precio:1500,
    desc:"Cuadro decorativo horizontal de arte abstracto en tonos negro, blanco, azul profundo y detalles dorados. Impresión en lienzo con marco delgado color dorado. Medidas: 90 cm x 50 cm. Ideal para salas modernas.",
    img:"img/producto5.jpg"
  },
  {
    id:6,
    nombre:"Alfombra decorativa",
    precio:2000,
    desc:"Alfombra rectangular de 160 cm x 230 cm, fabricada en fibras sintéticas suaves al tacto. Diseño con patrones circulares en tonos beige, crema y café claro. Antideslizante y fácil de limpiar.",
    img:"img/producto6.jpg"
  },
  {
    id:7,
    nombre:"Espejo circular",
    precio:950,
    desc:"Espejo redondo de 60 cm de diámetro con marco metálico delgado en color negro mate. Diseño elegante y minimalista, ideal para baños, recámaras o recibidores. Incluye soporte para instalación en pared.",
    img:"img/producto7.jpg"
  },
  {
    id:8,
    nombre:"Planta artificial",
    precio:300,
    desc:"Planta artificial decorativa de 1.20 m de altura, con hojas verdes realistas y tronco detallado. Incluye maceta negra básica. Ideal para interiores sin necesidad de mantenimiento.",
    img:"img/producto8.jpg"
  },
  {
    id:9,
    nombre:"Cojines decorativos",
    precio:600,
    desc:"Set de dos cojines cuadrados de 45 cm x 45 cm, en tela blanca con estampado de hojas en color dorado metálico. Relleno suave y fundas con cierre oculto. Perfectos para sala o recámara.",
    img:"img/producto9.jpg"
  },
  {
    id:10,
    nombre:"Figura de madera",
    precio:700,
    desc:"Figura decorativa artesanal en forma de pato, tallada en madera natural con acabado barnizado brillante en tonos café y dorado. Altura de 35 cm. Ideal como pieza central decorativa.",
    img:"img/producto10.jpg"
  }
];

// Renderizar productos
const contenedor = document.getElementById("productos");
productos.forEach(p => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${p.img}" alt="${p.nombre}">
    <h3>${p.nombre}</h3>
    <p>${p.desc}</p>
    <p><strong>$${p.precio}</strong></p>
    <button onclick="agregarAlCarrito(${p.id})">Agregar al carrito</button>
  `;
  contenedor.appendChild(card);
});

// Carrito
let carrito = [];
let codigoGenerado = null;

function agregarAlCarrito(id){
  const producto = productos.find(p => p.id === id);
  carrito.push(producto);
  renderCarrito();
}

function eliminarDelCarrito(index){
  carrito.splice(index, 1);
  renderCarrito();
}

function renderCarrito(){
  const lista = document.getElementById("lista-carrito");
  lista.innerHTML = "";
  let total = 0;
  carrito.forEach((p, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${p.nombre} - $${p.precio}
      <button class="eliminar" onclick="eliminarDelCarrito(${index})">X</button>
    `;
    lista.appendChild(li);
    total += p.precio;
  });
  document.getElementById("total").textContent = `Total: $${total}`;
}

function finalizarCompra(){
  if(carrito.length === 0){
    alert("Tu carrito está vacío.");
    return;
  }

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();

  if(!nombre || !correo){
    alert("Por favor ingresa tu nombre y correo.");
    return;
  }

  codigoGenerado = Math.floor(100000 + Math.random() * 900000);

  // Enviar email de autenticación
  emailjs.send("service_cs46nha","template_6vkzl1o",{
    codigo: codigoGenerado,
    user_name: nombre,
    user_email: correo
  }).then(() => {
    alert(`Se envió un código de verificación al correo ${correo}. Ingresa el código para confirmar tu compra.`);
  }).catch(err => console.error("Error código:", err));
}

function verificarCodigo(){
  const codigoIngresado = document.getElementById("codigoIngresado").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const fecha = new Date().toLocaleDateString();
  const total = carrito.reduce((acc,p) => acc + p.precio, 0);

  if(codigoIngresado == codigoGenerado){
    // Enviar email de pedido/factura
    emailjs.send("service_cs46nha","template_xen9ueg",{
      user_name: nombre,
      user_email: correo,
      amount: total,
      date: fecha
    }).then(() => {
      alert(`Compra confirmada.\nSe envió la factura al correo ${correo}.`);
      carrito = [];
      renderCarrito();
      codigoGenerado = null;
    }).catch(err => console.error("Error pedido:", err));
  } else {
    alert("El código ingresado no es correcto. Verifica tu correo e inténtalo de nuevo.");
  }
}
// Efecto de inclinación y zoom de imágenes según posición del mouse
document.querySelectorAll(".card img").forEach(img => {
  img.addEventListener("mousemove", e => {
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left; // posición X dentro de la imagen
    const mitad = rect.width / 2;

    if(x > mitad){
      img.style.transform = "rotateY(50deg) scale(1.1)"; // fuerte inclinación derecha + zoom
    } else {
      img.style.transform = "rotateY(-50deg) scale(1.1)"; // fuerte inclinación izquierda + zoom
    }
  });

  img.addEventListener("mouseleave", () => {
    img.style.transform = "rotateY(0deg) scale(1)"; // vuelve al centro
  });
});
