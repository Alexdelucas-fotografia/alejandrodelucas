// =========================================================
// FOTOS ALEATORIAS: en cada recarga, las fotos de los bloques cambian de sitio.
// Para añadir una foto nueva, ponla en fotos/web/ y añade una línea a la lista de abajo.
//   n: el número del archivo (img-0207.jpg -> '0207')
//   alt: lo que se ve en la foto
//   vertical: true si la foto es vertical (solo se usa en huecos altos, para que no se recorte)
// Se sortean TODAS las fotos de la página, también la de presentación (la de al lado de tu texto).
// Si una foto debe quedarse siempre igual (por ejemplo, tu retrato), ponle data-fija al <img>:
//   <img src="fotos/web/mi-retrato.jpg" alt="..." data-fija>
// =========================================================
(function () {
  var fotos = [
    { n: '0207', vertical: true, alt: 'Bebé apoyado sobre un coche de juguete granate con el número 01' },
    { n: '0214', alt: 'Mano de un bebé señalando el tapón de un coche de juguete granate' },
    { n: '0221', alt: 'Mano de un bebé agarrada al asiento de un coche de juguete granate' },
    { n: '3534', alt: 'Manos de los padres sujetando a un bebé vestido de rosa' },
    { n: '3551', alt: 'Bebé con una diadema blanca tumbado sobre una colcha de patchwork' },
    { n: '3594', alt: 'Bebé sonriendo sobre una colcha de patchwork, con la mano de su padre al lado' },
    { n: '3728', alt: 'Bebé dormido con un lazo blanco en un capazo' },
    { n: '4993', alt: 'Bebé gateando sobre una alfombra de pelo mientras recibe un beso' },
    { n: '4994', alt: 'Bebé tumbado sobre una manta granate mirando hacia arriba' },
    { n: '4998', alt: 'Bebé con camisa de cuadros tumbado sobre una alfombra de pelo' }
  ];

  // los huecos de fotos: bloques, foto sola y foto de presentación (menos las marcadas con data-fija)
  var huecos = Array.prototype.filter.call(
    document.querySelectorAll('.pantalla img, .foto-sola img, .sobre-foto img'),
    function (img) { return !img.hasAttribute('data-fija'); }
  );
  if (!huecos.length) return;

  function barajar(lista) {
    var a = lista.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // las fotos verticales solo van en huecos altos (donde la foto no queda como una tira estrecha)
  function esHuecoAlto(img) {
    return !img.closest('.pantalla-ancha') && !img.closest('.pantalla-cuatro');
  }

  var cola = [];
  var anterior = null;

  function siguiente(img) {
    for (var intento = 0; intento < 3; intento++) {
      if (!cola.length) cola = barajar(fotos);
      for (var i = 0; i < cola.length; i++) {
        var f = cola[i];
        if (f === anterior) continue;                          // no repetir la de al lado
        if (f.vertical && !esHuecoAlto(img)) continue;         // la vertical, solo en huecos altos
        cola.splice(i, 1);
        return f;
      }
      cola = barajar(fotos);                                    // si ninguna vale, se vuelve a sortear
    }
    return fotos[0];
  }

  huecos.forEach(function (img) {
    var f = siguiente(img);
    anterior = f;
    img.src = 'fotos/web/img-' + f.n + '.jpg';
    img.alt = f.alt;
    var enlace = img.closest('a');
    if (enlace) enlace.setAttribute('aria-label', f.alt + '. Abrir el Instagram de Alejandro de Lucas');
  });
})();
