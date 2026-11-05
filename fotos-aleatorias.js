// =========================================================
// FOTOS ALEATORIAS: en cada recarga, las fotos de los bloques cambian de sitio.
// Para añadir una foto nueva, ponla en fotos/web/Familia/ y añade una línea a la lista de abajo.
//   f: el nombre del archivo, tal cual (con espacios y tildes si los tiene)
//   alt: lo que se ve en la foto
//   vertical: true si la foto es vertical 2:3 (solo se usa en huecos altos, para que no se recorte)
//   bn: true si la foto es en blanco y negro (las demás se consideran de color)
//   rn: true si la foto es de recién nacido: lleva " RN " en el nombre del archivo (solo esas fotos pueden ir en un apartado con data-tema="rn")
//   Las fotos con "embarazo" en el nombre no llevan marca: no pueden ir en "Recién nacido" y sí en el resto de apartados.
// Forma: un hueco con data-forma="vertical" (o "horizontal") en su <a class="foto-enlace"> solo recibe fotos verticales (u horizontales).
// Tono: un apartado con data-tono="color" solo recibe fotos de color, y uno con data-tono="bn"
// solo fotos en blanco y negro (en analogicas.html: <section class="apartado" data-tono="bn">).
// Los huecos que no están dentro de un apartado con data-tono admiten cualquier foto.
// Tema: un apartado con data-tema="rn" solo recibe fotos con rn: true (en familia.html: "Recién nacido").
// Las fotos tienen que ser 3:2 (horizontales) o 2:3 (verticales) y pesar menos de 1 MB.
// El carrusel del pie de página lleva TODAS las fotos de esta lista (mezcladas en cada recarga) y las recorta a cuadrado.
// Usa las copias ligeras de fotos/carrusel/ (mismo nombre que el original). Al añadir una foto nueva a la lista, pon también su copia ligera ahí.
// No sigue la regla de no repetir: es la galería completa, así que las fotos de los bloques también salen en él.
// Se sortean TODAS las fotos de la página, también la de presentación (la de al lado de tu texto).
// Regla: en una misma página no se repite ninguna foto. Solo se repetiría si la página tuviera
// más huecos que fotos disponibles, así que al añadir huecos conviene añadir también fotos.
// Si una foto debe quedarse siempre igual (por ejemplo, tu retrato), ponle data-fija al <img>:
//   <img src="fotos/web/mi-retrato.jpg" alt="..." data-fija>
// =========================================================
(function () {
  var carpeta = 'fotos/web/Familia/';
  var carpetaCarrusel = 'fotos/carrusel/';   // copias ligeras (1200 px) de todas las fotos, solo para el carrusel

  var fotos = [
    { f: 'Sesión 1/Familia sesion 1 (1).jpg', alt: 'Bebé gateando sobre una alfombra de pelo mientras recibe un beso' },
    { f: 'Sesión 1/Familia sesion 1 (2).jpg', alt: 'Bebé tumbado sobre una manta granate mirando hacia arriba' },
    { f: 'Sesión 1/Familia sesion 1 (3).jpg', alt: 'Bebé con camisa de cuadros tumbado sobre una alfombra de pelo' },
    { f: 'Sesión 1/Familia sesion 1 (4).JPG', alt: 'Dos niños con los brazos en alto juegan con hojas secas en un parque' },
    { f: 'Sesión 1/Familia sesion 1 (5).jpg', vertical: true, alt: 'Una madre tumbada sonríe a su hija, que se inclina sobre ella a contraluz en un parque' },
    { f: 'Sesión 1/Familia sesion 1 (6).JPG', vertical: true, alt: 'Una niña recoge manzanas de un cubo de madera sobre la hierba' },
    { f: 'Sesión 1/Familia sesion 1 (7).JPG', bn: true, alt: 'Bebé gateando sobre una alfombra de pelo mientras recibe un beso, en blanco y negro' },
    { f: 'Sesión 1/Familia sesion 1 (8).JPG', vertical: true, alt: 'Un niño sonriente con camisa de rayas corre con una manzana en la mano' },
    { f: 'Sesión 1/Familia sesion 1 (9).JPG', vertical: true, bn: true, alt: 'Un niño sonriente con camisa de rayas sostiene una manzana, en blanco y negro' },
    { f: 'Sesión 1/Familia sesion 1 (10).JPG', bn: true, alt: 'Bebé tumbado sobre una alfombra de pelo con camisa de cuadros, mirando hacia un lado, en blanco y negro' },
    { f: 'Sesión 1/Familia sesion 1 (11).JPG', bn: true, alt: 'Un niño sonriente con camisa de rayas tumbado sobre una manta, mirando hacia arriba, en blanco y negro' },
    { f: 'Sesión 1/Familia sesion 1 (12).JPG', vertical: true, alt: 'Los padres y dos hermanos besan a un bebé con peto de cuadros, rodeado de manzanas' },
    { f: 'Sesión 2/Familia sesión 2 (1).JPG', bn: true, alt: 'Bebé dormida con un lazo blanco, arropada en blanco y negro' },
    { f: 'Sesión 2/Familia sesión 2 (2).jpg', alt: 'Bebé dormido con un lazo blanco en un capazo' },
    { f: 'Sesión 2/Familia sesión 2 (3).jpg', vertical: true, alt: 'Una madre con camisa de cuadros mira a su bebé dormido en brazos' },
    { f: 'Sesión 2/Familia sesión 2 (4).JPG', alt: 'Una madre sonríe mientras mira a su bebé con un lazo blanco' },
    { f: 'Sesión 2/Familia sesión 2 (5).jpg', vertical: true, alt: 'Un padre mira con ternura a su bebé, que sonríe en sus brazos con un lazo blanco' },
    { f: 'Sesión 2/Familia sesión 2 (6).jpg', alt: 'Manos de los padres sujetando a un bebé vestido de rosa' },
    { f: 'Sesión 2/Familia sesión 2 (7).jpg', alt: 'Bebé con una diadema blanca tumbado sobre una colcha de patchwork' },
    { f: 'Sesión 2/Familia sesión 2 (8).jpg', alt: 'Bebé sonriendo sobre una colcha de patchwork, con la mano de su padre al lado' },
    { f: 'Sesión 2/Familia sesión 2 (9).jpg', alt: 'Una madre mira a su bebé, que mira a cámara con un lazo blanco, mientras el padre le sujeta la mano' },
    { f: 'Sesión 2/Familia sesión 2 (10).jpg', vertical: true, bn: true, alt: 'Retrato en blanco y negro de un bebé sonriente con un lazo blanco' },
    { f: 'Sesión 2/Familia sesión 2 (11).jpg', alt: 'Piececito de un bebé con calcetín blanco de encaje, sujeto por las manos de sus padres' },
    { f: 'Sesión 2/Familia sesión 2 (12).jpg', bn: true, alt: 'Bebé tumbado sobre una colcha de patchwork en blanco y negro, con los puños en alto' },
    { f: 'Sesión 2/Familia sesión 2 (13).jpg', alt: 'Una madre besa en la frente a su bebé dormido, en brazos del padre' },
    { f: 'Sesión 2/Familia sesión 2 (14).jpg', alt: 'Un abuelo mira con cariño a su nieta dormida en sus brazos' },
    { f: 'Sesión 3/Familia y RN sesión 3 (1).jpg', rn: true, alt: 'Manos de una madre sujetando la manita de un recién nacido con jersey de punto' },
    { f: 'Sesión 3/Familia y RN sesión 3 (2).jpg', rn: true, alt: 'Recién nacido dormido en brazos de su madre, con la mano de ella junto a su cara' },
    { f: 'Sesión 3/Familia y RN sesión 3 (3).jpg', rn: true, alt: 'Recién nacido dormido junto a una ventana, en brazos de su madre' },
    { f: 'Sesión 3/Familia y RN sesión 3 (4).jpg', rn: true, alt: 'Recién nacido dormido junto al pecho de su madre, que lo sujeta con la mano' },
    { f: 'Sesión 3/Familia y RN sesión 3 (5).jpg', rn: true, alt: 'Recién nacido dormido con un jersey de punto, mirando hacia un lado' },
    { f: 'Sesión 3/Familia y RN sesión 3 (6).jpg', rn: true, vertical: true, alt: 'Detalle de la oreja y el pelo de un recién nacido con jersey de punto' },
    { f: 'Sesión 3/Familia y RN sesión 3 (7).jpg', rn: true, alt: 'Recién nacido con el ceño fruncido, apoyado sobre un brazo' },
    { f: 'Sesión 3/Familia y RN sesión 3 (8).jpg', rn: true, bn: true, alt: 'Recién nacido dormido junto al pecho de su madre, que lo sujeta con la mano, en blanco y negro' },
    { f: 'Sesión 3/Familia y RN sesión 3 (9).jpg', rn: true, bn: true, alt: 'Recién nacido con el ceño fruncido, apoyado sobre un brazo, en blanco y negro' },
    { f: 'Sesión 3/Familia y RN sesión 3 (10).jpg', rn: true, bn: true, alt: 'Recién nacido dormido en brazos de su madre, con la mano de ella junto a su cara, en blanco y negro' },
    { f: 'Sesión 3/Familia y RN sesión 3 (11).jpg', rn: true, bn: true, alt: 'Recién nacido dormido junto a una ventana, en brazos de su madre, en blanco y negro' },
    { f: 'Sesión 3/Familia y RN sesión 3 (12).jpg', rn: true, bn: true, alt: 'Recién nacido dormido con un jersey de punto, mirando hacia un lado, en blanco y negro' },
    { f: 'Sesión 3/Familia y RN sesión 3 (13).jpg', rn: true, vertical: true, bn: true, alt: 'Detalle de la oreja y el pelo de un recién nacido con jersey de punto, en blanco y negro' },
    { f: 'Sesión 3/Familia y RN sesión 3 (14).jpg', rn: true, bn: true, alt: 'Manos de una madre sujetando la manita de un recién nacido con jersey de punto, en blanco y negro' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (1).JPG', alt: 'Manos de una pareja sobre la tripa de una embarazada sentada en la hierba' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (2).jpg', bn: true, alt: 'Manos de una pareja sobre la tripa de una embarazada sentada en la hierba, en blanco y negro' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (3).JPG', alt: 'Pareja abrazada en el parque al atardecer, con ella de ojos entrecerrados' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (4).jpg', bn: true, alt: 'Pareja abrazada en el parque, con ella de ojos entrecerrados, en blanco y negro' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (5).jpg', bn: true, alt: 'Pareja abrazada en el parque mientras él le besa la frente, en blanco y negro' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (6).JPG', alt: 'Embarazada con las manos sobre la tripa, con la sombra de una flor proyectada en ella' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (7).JPG', alt: 'Pareja en el parque: él le da un beso en la mejilla mientras ella mira a la cámara' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (8).JPG', alt: 'Pareja besándose a contraluz al atardecer en el parque' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (9).jpg', bn: true, alt: 'Pareja besándose a contraluz en el parque, en blanco y negro' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (10).JPG', alt: 'Pareja sonriéndose frente a frente en el parque, él con camisa vaquera' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (11).JPG', alt: 'Manos de una pareja sobre la tripa de una embarazada, con anillos' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (12).jpg', bn: true, alt: 'Manos de una pareja sobre la tripa de una embarazada, con anillos, en blanco y negro' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (13).JPG', alt: 'Embarazada sentada en la hierba al atardecer, con las manos sobre la tripa' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (14).jpg', bn: true, alt: 'Embarazada sentada en la hierba, con las manos sobre la tripa, en blanco y negro' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (15).jpg', bn: true, alt: 'Pareja abrazada en el parque, él sonriendo con la cabeza apoyada en la de ella, en blanco y negro' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (16).JPG', alt: 'Manos entrelazadas de la pareja a contraluz' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (17).jpg', bn: true, alt: 'Manos entrelazadas de la pareja a contraluz, en blanco y negro' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (18).JPG', alt: 'Pareja abrazada y sonriendo en el parque al atardecer, entre árboles de otoño' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (19).JPG', alt: 'Pareja bailando abrazada entre árboles de otoño, a contraluz' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (20).jpg', bn: true, alt: 'Pareja bailando abrazada entre árboles de otoño, en blanco y negro' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (21).JPG', alt: 'Pareja bailando y girando en el parque al atardecer, con el pelo de ella al vuelo' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (22).jpg', bn: true, alt: 'Pareja bailando y girando en el parque, con el pelo de ella al vuelo, en blanco y negro' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (23).jpg', bn: true, alt: 'Embarazada con las manos sobre la tripa, con la sombra de una flor, en blanco y negro' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (24).JPG', alt: 'Manos de la pareja formando un corazón sobre la tripa de la embarazada' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (25).jpg', bn: true, alt: 'Manos de la pareja formando un corazón sobre la tripa de la embarazada, en blanco y negro' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (26).JPG', vertical: true, alt: 'Pareja sonriendo con las manos juntas, ella riendo con la cara hacia arriba' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (27).jpg', vertical: true, bn: true, alt: 'Pareja sonriendo con las manos juntas, ella riendo con la cara hacia arriba, en blanco y negro' },
    { f: 'Sesión 4/Sesion familia y embarazo 4 (28).JPG', alt: 'Pareja abrazada en el parque al atardecer, él sonriendo con la cabeza junto a la de ella' },
    { f: 'Martín/Martín (1).jpg', vertical: true, alt: 'Bebé apoyado sobre un coche de juguete granate con el número 01' },
    { f: 'Martín/Martín (2).jpg', alt: 'Mano de un bebé señalando el tapón de un coche de juguete granate' },
    { f: 'Martín/Martín (3).jpg', alt: 'Mano de un bebé agarrada al asiento de un coche de juguete granate' }
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
      foto.src = encodeURI(carpetaCarrusel + f.f.split('/').pop());   // copia ligera, mismo nombre de archivo
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
    return !img.closest('.pantalla-ancha');
  }

  // el tono que pide el apartado donde está el hueco: 'color', 'bn' o null (cualquiera)
  function tonoDe(img) {
    var apartado = img.closest('[data-tono]');
    return apartado ? apartado.getAttribute('data-tono') : null;
  }

  // el tema que pide el apartado donde está el hueco: 'rn' o null (cualquiera)
  function temaDe(img) {
    var apartado = img.closest('[data-tema]');
    return apartado ? apartado.getAttribute('data-tema') : null;
  }

  // la forma que pide el hueco: 'vertical', 'horizontal' o null (cualquiera); se marca con data-forma en el <a> del hueco
  function formaDe(img) {
    var marca = img.closest('[data-forma]');
    return marca ? marca.getAttribute('data-forma') : null;
  }

  // ¿puede ir esta foto en este hueco?
  function admite(img, f) {
    var forma = formaDe(img);
    if (forma === 'vertical' && !f.vertical) return false;     // hueco vertical: solo fotos verticales
    if (forma === 'horizontal' && f.vertical) return false;    // hueco horizontal: solo fotos horizontales
    if (f.vertical && !esHuecoAlto(img)) return false;   // la vertical, solo en huecos altos
    if (temaDe(img) === 'rn' && !f.rn) return false;       // "Recién nacido": solo fotos con RN en el nombre
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
