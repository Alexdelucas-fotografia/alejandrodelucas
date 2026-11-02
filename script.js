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
// 1. MENÚ A PANTALLA COMPLETA
// =========================================================
// Las tres líneas de arriba a la derecha abren el menú. La portada no tiene menú.
const menu = document.querySelector('.menu');

if (menu) {
  document.querySelector('.menu-boton, .boton-menu').addEventListener('click', function () {
    menu.showModal(); // abre el menú
  });

  document.querySelector('.cerrar-menu').addEventListener('click', function () {
    menu.close();
  });

  // Al pulsar cualquier enlace del menú, se cierra y la página baja a esa sección
  menu.querySelectorAll('a').forEach(function (enlace) {
    enlace.addEventListener('click', function () {
      menu.close();
    });
  });
}


// =========================================================
// 2. PALABRA QUE CAMBIA EN LA FRASE
// Las palabras se escriben en el HTML, en data-palabras.
// =========================================================
const palabra = document.querySelector('.palabra');
const menosAnimaciones = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (palabra && !menosAnimaciones) {
  const lista = palabra.dataset.palabras.split(',');
  let numero = 0;

  setInterval(function () {
    palabra.style.opacity = 0;              // la palabra se desvanece...
    setTimeout(function () {
      numero = (numero + 1) % lista.length; // ...pasamos a la siguiente...
      palabra.textContent = lista[numero].trim();
      palabra.style.opacity = 1;            // ...y aparece
    }, 400);
  }, 2600); // cada 2,6 segundos. Cambia este número para ir más rápido o más lento
}


// =========================================================
// 3. VISOR DE FOTOS
// Al hacer clic en una foto de la galería, se abre en grande.
// Se puede pasar de foto con las flechas y cerrar con Esc.
// =========================================================
const enlaces = document.querySelectorAll('.galeria a');
const visor = document.querySelector('.visor');
const fotoGrande = visor.querySelector('img');
const textoFoto = visor.querySelector('.visor-texto');
let actual = 0; // qué foto se está viendo (la primera es la 0)

function mostrar(numeroFoto) {
  // Si pasamos de la última volvemos a la primera, y al revés
  actual = (numeroFoto + enlaces.length) % enlaces.length;

  const miniatura = enlaces[actual].querySelector('img');
  fotoGrande.src = enlaces[actual].href;
  fotoGrande.alt = miniatura.alt;
  textoFoto.textContent = miniatura.alt;

  if (!visor.open) {
    visor.showModal();
  }
}

enlaces.forEach(function (enlace, numeroFoto) {
  enlace.addEventListener('click', function (evento) {
    evento.preventDefault(); // evita que el navegador abra la foto en otra página
    mostrar(numeroFoto);
  });
});

visor.querySelector('.visor-cerrar').addEventListener('click', function () {
  visor.close();
});
visor.querySelector('.visor-anterior').addEventListener('click', function () {
  mostrar(actual - 1);
});
visor.querySelector('.visor-siguiente').addEventListener('click', function () {
  mostrar(actual + 1);
});

// Clic fuera de la foto = cerrar
visor.addEventListener('click', function (evento) {
  if (evento.target === visor) {
    visor.close();
  }
});

// Flechas del teclado (la tecla Esc ya cierra el visor sola)
document.addEventListener('keydown', function (evento) {
  if (!visor.open) return;
  if (evento.key === 'ArrowLeft') mostrar(actual - 1);
  if (evento.key === 'ArrowRight') mostrar(actual + 1);
});
