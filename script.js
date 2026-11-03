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
