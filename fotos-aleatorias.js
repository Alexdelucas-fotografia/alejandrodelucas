// =========================================================
// FOTOS ALEATORIAS: en cada recarga, las fotos de los bloques cambian de sitio.
// Para añadir una foto nueva, ponla en fotos/web/Familia/ y añade una línea a la lista de abajo.
//   f: el nombre del archivo, tal cual (con espacios y tildes si los tiene)
//   alt: lo que se ve en la foto
//   vertical: true si la foto es vertical 2:3 (solo se usa en huecos altos, para que no se recorte)
//   bn: true si la foto es en blanco y negro (las demás se consideran de color)
//   bebe: true si en la foto sale un bebé (solo esas fotos pueden ir en un apartado con data-tema="bebe")
// Tono: un apartado con data-tono="color" solo recibe fotos de color, y uno con data-tono="bn"
// solo fotos en blanco y negro (en analogicas.html: <section class="apartado" data-tono="bn">).
// Los huecos que no están dentro de un apartado con data-tono admiten cualquier foto.
// Tema: un apartado con data-tema="bebe" solo recibe fotos con bebe: true (en familia.html: "Recién nacido").
// Las fotos tienen que ser 3:2 (horizontales) o 2:3 (verticales) y pesar menos de 1 MB.
// El carrusel del pie de página lleva TODAS las fotos de esta lista (mezcladas en cada recarga) y las recorta a cuadrado.
// No sigue la regla de no repetir: es la galería completa, así que las fotos de los bloques también salen en él.
// Se sortean TODAS las fotos de la página, también la de presentación (la de al lado de tu texto).
// Regla: en una misma página no se repite ninguna foto. Solo se repetiría si la página tuviera
// más huecos que fotos disponibles, así que al añadir huecos conviene añadir también fotos.
// Si una foto debe quedarse siempre igual (por ejemplo, tu retrato), ponle data-fija al <img>:
//   <img src="fotos/web/mi-retrato.jpg" alt="..." data-fija>
// =========================================================
(function () {
  var carpeta = 'fotos/web/Familia/';

  var fotos = [
    { f: 'Sesión 1/Familia Sesión 1  (1).jpg', bebe: true, alt: 'Bebé dormido con un lazo blanco en un capazo' },
    { f: 'Sesión 1/Familia Sesión 1  (2).jpg', bebe: true, alt: 'Bebé gateando sobre una alfombra de pelo mientras recibe un beso' },
    { f: 'Sesión 1/Familia Sesión 1  (3).jpg', bebe: true, alt: 'Bebé tumbado sobre una manta granate mirando hacia arriba' },
    { f: 'Sesión 1/Familia Sesión 1  (4).jpg', bebe: true, alt: 'Bebé con camisa de cuadros tumbado sobre una alfombra de pelo' },
    { f: 'Sesión 1/Familia Sesión 1  (5).jpg', bebe: true, vertical: true, alt: 'Una madre con camisa de cuadros mira a su bebé dormido en brazos' },
    { f: 'Sesión 1/Familia Sesión 1  (6).JPG', alt: 'Dos niños con los brazos en alto juegan con hojas secas en un parque' },
    { f: 'Sesión 1/Familia Sesión 1  (7).JPG', bebe: true, alt: 'Una madre sonríe mientras mira a su bebé con un lazo blanco' },
    { f: 'Sesión 1/Familia Sesión 1  (8).jpg', vertical: true, alt: 'Una madre tumbada sonríe a su hija, que se inclina sobre ella a contraluz en un parque' },
    { f: 'Sesión 1/Familia Sesión 1  (9).jpg', bebe: true, vertical: true, alt: 'Un padre mira con ternura a su bebé, que sonríe en sus brazos con un lazo blanco' },
    { f: 'Sesión 1/Familia Sesión 1  (10).jpg', bebe: true, alt: 'Manos de los padres sujetando a un bebé vestido de rosa' },
    { f: 'Sesión 1/Familia Sesión 1  (11).jpg', bebe: true, alt: 'Bebé con una diadema blanca tumbado sobre una colcha de patchwork' },
    { f: 'Sesión 1/Familia Sesión 1  (12).jpg', bebe: true, alt: 'Bebé sonriendo sobre una colcha de patchwork, con la mano de su padre al lado' },
    { f: 'Sesión 1/Familia Sesión 1  (13).jpg', bebe: true, alt: 'Una madre mira a su bebé, que mira a cámara con un lazo blanco, mientras el padre le sujeta la mano' },
    { f: 'Sesión 1/Familia Sesión 1 (14).jpg', bebe: true, vertical: true, bn: true, alt: 'Retrato en blanco y negro de un bebé sonriente con un lazo blanco' },
    { f: 'Sesión 1/Familia Sesión 1 (15).jpg', bebe: true, alt: 'Piececito de un bebé con calcetín blanco de encaje, sujeto por las manos de sus padres' },
    { f: 'Sesión 1/Familia Sesión 1 (16).jpg', bebe: true, bn: true, alt: 'Bebé tumbado sobre una colcha de patchwork en blanco y negro, con los puños en alto' },
    { f: 'Sesión 1/Familia Sesión 1 (17).jpg', bebe: true, alt: 'Una madre besa en la frente a su bebé dormido, en brazos del padre' },
    { f: 'Sesión 1/Familia Sesión 1 (18).jpg', bebe: true, alt: 'Un abuelo mira con cariño a su nieta dormida en sus brazos' },
    { f: 'Sesión 1/Familia Sesión 1 (19).JPG', bebe: true, bn: true, alt: 'Bebé dormida con un lazo blanco, arropada en blanco y negro' },
    { f: 'Sesión 1/Familia Sesión 1 (20).JPG', vertical: true, alt: 'Una niña recoge manzanas de un cubo de madera sobre la hierba' },
    { f: 'Sesión 1/Familia Sesión 1 (21).JPG', bebe: true, bn: true, alt: 'Bebé gateando sobre una alfombra de pelo mientras recibe un beso, en blanco y negro' },
    { f: 'Sesión 1/Familia Sesión 1 (22).JPG', vertical: true, alt: 'Un niño sonriente con camisa de rayas corre con una manzana en la mano' },
    { f: 'Sesión 1/Familia Sesión 1 (23).JPG', vertical: true, bn: true, alt: 'Un niño sonriente con camisa de rayas sostiene una manzana, en blanco y negro' },
    { f: 'Sesión 1/Familia Sesión 1 (24).JPG', bebe: true, bn: true, alt: 'Bebé tumbado sobre una alfombra de pelo con camisa de cuadros, mirando hacia un lado, en blanco y negro' },
    { f: 'Martín/Martín (1).jpg', bebe: true, vertical: true, alt: 'Bebé apoyado sobre un coche de juguete granate con el número 01' },
    { f: 'Martín/Martín (2).jpg', bebe: true, alt: 'Mano de un bebé señalando el tapón de un coche de juguete granate' },
    { f: 'Martín/Martín (3).jpg', bebe: true, alt: 'Mano de un bebé agarrada al asiento de un coche de juguete granate' },
    { f: 'Martín/Martín (4).jpg', bebe: true, alt: 'Mano de un niño acercando un mordedor a la cara de una oveja de peluche' },
    { f: 'Martín/Martín.JPG', vertical: true, alt: 'Niño visto de espaldas, con camisa de cuadros azul, tocando hojas secas en el suelo' }
  ];

  // carrusel del pie: una foto cuadrada por cada foto de la lista, en orden aleatorio
  var ordenCarrusel = fotos.slice().sort(function () { return Math.random() - 0.5; });
  Array.prototype.forEach.call(document.querySelectorAll('.carrusel-pista'), function (pista) {
    pista.innerHTML = '';
    ordenCarrusel.forEach(function (f) {
      var enlace = document.createElement('a');
      enlace.className = 'foto-enlace';
      enlace.href = 'https://www.instagram.com/alexlucascaldera';
      enlace.target = '_blank';
      enlace.rel = 'noopener noreferrer';
      enlace.setAttribute('aria-label', f.alt + '. Abrir el Instagram de Alejandro de Lucas');
      var foto = document.createElement('img');
      foto.src = encodeURI(carpeta + f.f);
      foto.alt = f.alt;
      foto.loading = 'lazy';
      enlace.appendChild(foto);
      pista.appendChild(enlace);
    });
  });

  // los huecos de fotos: bloques, foto sola y foto de presentación (menos las marcadas con data-fija)
  var huecos = Array.prototype.filter.call(
    document.querySelectorAll('.pantalla img, .foto-sola img, .sobre-foto img'),
    function (img) { return !img.hasAttribute('data-fija'); }
  );
  if (!huecos.length) return;

  // las fotos verticales solo van en huecos altos (donde la foto no queda como una tira estrecha)
  function esHuecoAlto(img) {
    return !img.closest('.pantalla-ancha') && !img.closest('.pantalla-cuatro') && !img.closest('.pantalla-cinco');
  }

  // el tono que pide el apartado donde está el hueco: 'color', 'bn' o null (cualquiera)
  function tonoDe(img) {
    var apartado = img.closest('[data-tono]');
    return apartado ? apartado.getAttribute('data-tono') : null;
  }

  // el tema que pide el apartado donde está el hueco: 'bebe' o null (cualquiera)
  function temaDe(img) {
    var apartado = img.closest('[data-tema]');
    return apartado ? apartado.getAttribute('data-tema') : null;
  }

  // ¿puede ir esta foto en este hueco?
  function admite(img, f) {
    if (f.vertical && !esHuecoAlto(img)) return false;   // la vertical, solo en huecos altos
    if (temaDe(img) === 'bebe' && !f.bebe) return false;   // "Recién nacido": solo fotos de bebés
    var tono = tonoDe(img);
    if (tono === 'bn') return !!f.bn;                    // blanco y negro: solo fotos en blanco y negro
    if (tono === 'color') return !f.bn;                  // color: solo fotos de color
    return true;
  }

  var usadas = [];   // fotos ya colocadas en esta página

  function elegir(img) {
    var validas = fotos.filter(function (f) { return admite(img, f); });
    var libres = validas.filter(function (f) { return usadas.indexOf(f) < 0; });
    // solo se repite una foto si ya se han usado todas las válidas para este hueco
    var lista = libres.length ? libres : validas;
    var f = lista[Math.floor(Math.random() * lista.length)];
    usadas.push(f);
    return f;
  }

  // primero los huecos con menos fotos posibles (los de blanco y negro, los horizontales...),
  // para que no se queden sin foto cuando ya se han repartido las demás
  var orden = huecos.map(function (img) {
    return {
      img: img,
      posibles: fotos.filter(function (f) { return admite(img, f); }).length,
      azar: Math.random()
    };
  }).sort(function (a, b) {
    return a.posibles - b.posibles || a.azar - b.azar;
  }).map(function (h) { return h.img; });

  orden.forEach(function (img) {
    var f = elegir(img);
    img.src = encodeURI(carpeta + f.f);   // encodeURI: los espacios y las tildes del nombre no dan problemas
    img.alt = f.alt;
    var enlace = img.closest('a');
    if (enlace) {
      enlace.setAttribute('aria-label', f.alt + '. Abrir el Instagram de Alejandro de Lucas');
      // proporción de la foto: 3:2 si es horizontal y 2:3 si es vertical; el CSS la usa para no recortar
      enlace.style.setProperty('--r', f.vertical ? '0.6667' : '1.5');
    }
  });
})();
