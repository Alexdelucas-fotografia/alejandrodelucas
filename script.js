// =========================================================
// INTRO DE LA PORTADA
// La primera vez que se abre la portada: foto entera y la firma negra fuera de la foto, en la esquina inferior
// derecha; luego se va el fondo y la firma se queda ahí, en blanco, sobre la portada. Pulsar o tocar cualquier tecla la salta.
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

  // la firma sale negra exactamente donde está la de la portada (esquina inferior derecha), fuera de la foto
  function colocarFirma() {
    var destino = document.querySelector('.firma-grande img');
    if (!destino) return;
    var d = destino.getBoundingClientRect();
    firma.style.width = d.width + 'px';
    firma.style.height = d.height + 'px';
    firma.style.left = d.left + 'px';
    firma.style.top = d.top + 'px';
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
    colocarFirma();
    intro.classList.add('foto-lista');            // 1. aparece la foto
    despues(function () { intro.classList.add('firma-lista'); }, 900);   // 2. aparece la firma
    despues(salir, 4200);                         // 3. se va el fondo, la firma pasa a blanca y se descubre la portada
  });
  window.addEventListener('resize', function () { if (!intro.classList.contains('saliendo')) colocarFirma(); });
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
