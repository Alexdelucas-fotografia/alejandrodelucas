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
    // avanza el ancho de las fotos que caben enteras
    const foto = pista.querySelector('.foto-enlace').offsetWidth;
    const caben = Math.max(1, Math.floor(pista.clientWidth / foto));
    pista.scrollBy({ left: sentido * caben * foto, behavior: sinMovimiento ? 'auto' : 'smooth' });
  }

  anterior.addEventListener('click', function () { mover(-1); });
  siguiente.addEventListener('click', function () { mover(1); });
  pista.addEventListener('scroll', actualizar, { passive: true });
  window.addEventListener('resize', actualizar);
  actualizar();
});
