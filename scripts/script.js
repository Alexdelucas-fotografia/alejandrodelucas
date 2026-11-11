// =========================================================
// INTRO DE LA PORTADA
// La primera vez que se abre la portada: foto entera y la firma negra fuera de la foto, en la esquina inferior
// derecha (colocada con CSS, igual que la de la portada); luego se va el fondo y la firma se queda ahí, en blanco, sobre la portada. Pulsar o tocar cualquier tecla la salta.
// El <head> de index.html decide si toca (clase con-intro) y los estilos están en estilos.css.
// =========================================================
(function () {
  var intro = document.getElementById('intro');
  if (!intro) return;
  var html = document.documentElement;
  if (!html.classList.contains('con-intro') || !window.introFoto) { intro.parentNode.removeChild(intro); return; }

  var foto = intro.querySelector('.intro-foto');
  var firma = intro.querySelector('.intro-firma');
  var terminada = false;
  var tiempos = [];
  function despues(fn, ms) { tiempos.push(setTimeout(fn, ms)); }

  function terminar() {
    if (terminada) return;
    terminada = true;
    tiempos.forEach(clearTimeout);
    html.classList.remove('con-intro');
    try { sessionStorage.setItem('intro-vista', '1'); } catch (e) {}
    if (intro.parentNode) intro.parentNode.removeChild(intro);
    window.scrollTo(0, 0);
  }

  // se va el fondo y la firma pasa de negra a blanca. Primero se desbloquea la página (aparece la barra de scroll y la firma
  // de la portada ocupa su sitio definitivo, tapada aún por el fondo) y la firma de la intro se coloca justo encima.
  function salir() {
    intro.classList.add('saliendo');
    html.classList.remove('con-intro');
    var destino = document.querySelector('.firma-grande img');
    if (!destino) { terminar(); return; }
    var a = firma.getBoundingClientRect();
    var b = destino.getBoundingClientRect();
    firma.style.transform = 'translate(' + (b.left - a.left) + 'px, ' + (b.top - a.top) + 'px) scale(' + (b.width / a.width) + ')';
    despues(terminar, 1500);
  }

  var plazoCarga = setTimeout(terminar, 7000);   // si la foto no llega, no se deja al visitante esperando
  tiempos.push(plazoCarga);
  foto.addEventListener('error', terminar);
  foto.addEventListener('load', function () {
    clearTimeout(plazoCarga);
    intro.classList.add('foto-lista');            // 1. aparece la foto
    despues(function () { intro.classList.add('firma-lista'); }, 900);   // 2. aparece la firma
    despues(salir, 4200);                         // 3. se va el fondo, la firma pasa de negra a blanca y se descubre la portada
  });
  intro.addEventListener('click', terminar);
  document.addEventListener('keydown', terminar);

  foto.src = encodeURI(window.introFoto);
})();

// =========================================================
// 0. TÍTULOS QUE APARECEN AL BAJAR
// Cada título entra con un fundido suave cuando llega a la pantalla.
// Para que otro título haga lo mismo, añade su selector a esta lista.
// =========================================================
const titulosRevelar = document.querySelectorAll('.apartado-titulo, .sobre-texto h2');
const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && titulosRevelar.length && !sinMovimiento) {
  titulosRevelar.forEach(function (titulo) {
    titulo.classList.add('revelar'); // empieza oculto...
  });

  const vigilante = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible'); // ...y aparece al llegar a la pantalla
        vigilante.unobserve(entrada.target);
      }
    });
  }, { rootMargin: '0px 0px -12% 0px' });

  titulosRevelar.forEach(function (titulo) {
    vigilante.observe(titulo);
  });
}

// =========================================================
// 1. CARRUSEL DE FOTOS
// Las flechas desplazan la fila de fotos; al llegar al principio o al final se ocultan.
// =========================================================
document.querySelectorAll('.carrusel').forEach(function (carrusel) {
  const pista = carrusel.querySelector('.carrusel-pista');
  const anterior = carrusel.querySelector('.carrusel-anterior');
  const siguiente = carrusel.querySelector('.carrusel-siguiente');

  function actualizar() {
    anterior.disabled = pista.scrollLeft < 4;
    siguiente.disabled = pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 4;
  }

  function mover(sentido) {
    // las fotos tienen distinto ancho: avanza casi lo que se ve en pantalla
    pista.scrollBy({ left: sentido * pista.clientWidth * 0.85, behavior: sinMovimiento ? 'auto' : 'smooth' });
  }

  anterior.addEventListener('click', function () { mover(-1); });
  siguiente.addEventListener('click', function () { mover(1); });
  pista.addEventListener('scroll', actualizar, { passive: true });
  window.addEventListener('resize', actualizar);
  actualizar();
});

// =========================================================
// CUADRÍCULAS: FOTOS DE DOS EN DOS EN EL MÓVIL
// En el ordenador cada fila lleva 3 fotos; en el móvil (pantalla estrecha) las páginas de dentro las agrupan de dos en dos,
// cada foto con su formato. Si queda una sola foto suelta, ocupa toda la fila. La portada no entra: allí van de una en una (CSS).
// =========================================================
(function () {
  var cuadriculas = Array.prototype.filter.call(document.querySelectorAll('.cuadricula'), function (c) { return !c.closest('.zara'); });
  if (!cuadriculas.length) return;
  var movil = window.matchMedia('(max-width: 45rem)');
  var porFila = 3;

  function agrupar(n) {
    cuadriculas.forEach(function (cuadricula) {
      var enlaces = Array.prototype.slice.call(cuadricula.querySelectorAll('.foto-enlace'));
      Array.prototype.forEach.call(cuadricula.querySelectorAll('.fila'), function (fila) { cuadricula.removeChild(fila); });
      for (var i = 0; i < enlaces.length; i += n) {
        var fila = document.createElement('div');
        fila.className = 'fila';
        enlaces.slice(i, i + n).forEach(function (e) { fila.appendChild(e); });
        cuadricula.appendChild(fila);
      }
    });
    porFila = n;
  }

  function actualizar() {
    var n = movil.matches ? 2 : 3;
    if (n !== porFila) agrupar(n);
  }

  actualizar();
  if (movil.addEventListener) movil.addEventListener('change', actualizar); else movil.addListener(actualizar);
})();

// =========================================================
// FLECHA PARA VOLVER AL PRINCIPIO
// Sube suavemente hasta arriba (sin movimiento si el visitante tiene esa opción activada).
// =========================================================
document.querySelectorAll('.subir').forEach(function (flecha) {
  flecha.addEventListener('click', function (evento) {
    evento.preventDefault();
    window.scrollTo({ top: 0, behavior: sinMovimiento ? 'auto' : 'smooth' });
  });
});

// =========================================================
// FOTOS PROTEGIDAS
// Con el botón derecho (o pulsación larga en el móvil) sobre una foto no sale el menú de "Abrir imagen en una pestaña nueva",
// "Guardar imagen como..." ni "Copiar imagen", y tampoco se pueden arrastrar fuera de la página.
// Ojo: esto solo frena el uso normal. Quien sepa abrir las herramientas del navegador sigue pudiendo sacar la foto.
// =========================================================
document.addEventListener('contextmenu', function (evento) {
  if (evento.target.closest && evento.target.closest('img, picture, .foto-enlace, .foto-autor, #intro')) evento.preventDefault();
});
document.addEventListener('dragstart', function (evento) {
  if (evento.target.tagName === 'IMG') evento.preventDefault();
});
