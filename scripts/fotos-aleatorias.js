// =========================================================
// FOTOS ALEATORIAS: en cada recarga, las fotos de los bloques cambian de sitio.
// Para añadir una foto nueva, ponla en fotos/web/Familia/ y añade una línea a la lista de abajo.
//   f: el nombre del archivo, tal cual (con espacios y tildes si los tiene)
//   alt: lo que se ve en la foto
//   r: la proporción de la foto (ancho / alto). NO lo escribas a mano: lo pone solo detectar-formato.mjs (se ejecuta al final de crear-copias-ligeras.bat).
//     Formatos que admite la web, y que se ven enteros, sin recortar, en los bloques que no son cuadrados:
//     3:2 (r: 1.5), 2:3 (r: 0.6667), 5:4 (r: 1.25) y 4:5 (r: 0.8). Las fotos con r menor que 1 son verticales.
//   rn: true si la foto es de recién nacido: lleva " RN " en el nombre del archivo (solo esas fotos pueden ir en un apartado con data-tema="rn").
//     Se deduce solo del nombre del archivo, no hace falta escribirlo.
//   NORMA DE AUTOR: las fotos que llevan "autor" en el nombre del archivo (por ejemplo "Autor (1).jpg") van SOLO en la página Fotografía de autor,
//     que las muestra todas, en grande y una a una, numeradas 001, 002... según el orden de la lista (las nuevas, al final). No salen en ninguna otra página ni en el carrusel. Se deduce solo del nombre; basta con añadir su línea a esta lista.
//   tripa: true si en la foto se ve la tripa de la embarazada. NO lo escribas a mano: lo pone y lo quita solo detectar-tripa.mjs
//     (se ejecuta al final de crear-copias-ligeras.bat) mirando las fotos que llevan "embarazo" en el nombre del archivo.
//   NORMA DE LA TRIPA: las fotos con tripa: true solo pueden salir en el apartado Embarazo (data-tema="tripa")
//   y nunca en Reportajes familiares (data-excluye="tripa"). En el resto de la web (portada, analógicas, carrusel) pueden salir.
// Forma: un hueco con data-forma="vertical" (o "horizontal") en su <a class="foto-enlace"> solo recibe fotos verticales (u horizontales).
// Toda la web es en blanco y negro: no hay regla de tono, todas las fotos son en blanco y negro.
// Tema: un apartado con data-tema="rn" solo recibe fotos con rn: true, y uno con data-tema="tripa" solo fotos con tripa: true
// (en familia.html: "Recién nacido" y "Embarazo"). Las fotos con rn o tripa SÍ pueden salir en los apartados sin tema.
// Excluir: un apartado con data-excluye="tripa" nunca recibe fotos con tripa: true (en familia.html: "Reportajes familiares").
// Las fotos tienen que ser 3:2, 2:3, 5:4 o 4:5 y pesar menos de 1 MB. Se ven siempre enteras, sin recortar, con su formato.
// El carrusel del pie de página lleva TODAS las fotos de esta lista (mezcladas en cada recarga), todas con la misma altura y cada una con su formato.
// Usa las copias ligeras de fotos/carrusel/ (mismo nombre que el original). Al añadir una foto nueva a la lista, pon también su copia ligera ahí.
// No sigue la regla de no repetir: es la galería completa, así que las fotos de los bloques también salen en él.
// Se sortean TODAS las fotos de la página, también la de presentación (la de al lado de tu texto).
// Regla: en una misma página no se repite ninguna foto. Solo se repetiría si la página tuviera
// más huecos que fotos disponibles, así que al añadir huecos conviene añadir también fotos.
// Si una foto debe quedarse siempre igual (por ejemplo, tu retrato), ponle data-fija al <img>:
//   <img src="fotos/web/mi-retrato.jpg" alt="..." data-fija>
// =========================================================
(function () {
  // la raíz de la web: la carpeta de arriba de scripts/. Así las fotos se encuentran igual desde index.html que desde páginas/
  var raiz = document.currentScript ? new URL('../', document.currentScript.src).href : '';
  var carpeta = 'fotos/web/Familia/';
  var carpetaCarrusel = 'fotos/carrusel/';   // copias ligeras (1200 px) de todas las fotos, solo para el carrusel

  var fotos = [
    { f: 'Sesión 1/Familia sesión 1 (1).JPG', r: 1.5, alt: 'Bebé gateando sobre una alfombra de pelo mientras recibe un beso, en blanco y negro' },
    { f: 'Sesión 1/Familia sesión 1 (2).JPG', r: 0.6667, alt: 'Un niño sonriente con camisa de rayas sostiene una manzana, en blanco y negro' },
    { f: 'Sesión 1/Familia sesión 1 (3).JPG', r: 1.5, alt: 'Bebé tumbado sobre una alfombra de pelo con camisa de cuadros, mirando hacia un lado, en blanco y negro' },
    { f: 'Sesión 1/Familia sesión 1 (4).JPG', r: 1.5, alt: 'Un niño sonriente con camisa de rayas tumbado sobre una manta, mirando hacia arriba, en blanco y negro' },
    { f: 'Sesión 2/Familia sesión 2 (1).JPG', r: 1.5, alt: 'Bebé dormida con un lazo blanco, arropada en blanco y negro' },
    { f: 'Sesión 2/Familia sesión 2 (2).jpg', r: 0.6667, alt: 'Retrato en blanco y negro de un bebé sonriente con un lazo blanco' },
    { f: 'Sesión 2/Familia sesión 2 (3).jpg', r: 1.5, alt: 'Bebé tumbado sobre una colcha de patchwork en blanco y negro, con los puños en alto' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (1).jpg', r: 1.5, rn: true, alt: 'Recién nacido dormido con jersey de punto, con la mano de su madre junto a su cara' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (2).jpg', r: 1.5, rn: true, alt: 'Recién nacido dormido, con la mano de su madre sobre su pecho' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (3).jpg', r: 1.5, rn: true, alt: 'Recién nacido dormido, con la manga de un jersey de punto junto a su cara' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (4).jpg', r: 1.25, rn: true, alt: 'Recién nacido con el ceño fruncido, apoyado sobre un brazo y mirando a cámara' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (5).jpg', r: 1.5, rn: true, alt: 'Manita de un recién nacido con jersey de punto, sobre un dedo' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (6).jpg', r: 1.25, rn: true, alt: 'Perfil de un recién nacido dormido con jersey de punto, con una mano a su lado' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (7).jpg', r: 1.25, rn: true, alt: 'Pies de un recién nacido sujetos por las manos de sus padres' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (8).jpg', r: 1.25, rn: true, alt: 'Recién nacido con el ceño fruncido, apoyado sobre un brazo, en un encuadre más cerrado' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (9).jpg', r: 1.25, rn: true, alt: 'Manos de una madre con anillo sobre la manita de un recién nacido' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (11).jpg', r: 0.8, rn: true, alt: 'Detalle de la oreja y el pelo de un recién nacido con jersey de punto' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (12).jpg', r: 0.8, rn: true, alt: 'Detalle de la oreja y el pelo de un recién nacido con jersey de punto, en otro encuadre' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (13).jpg', r: 0.8, rn: true, alt: 'Perfil de la nariz y la mejilla de un recién nacido' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (14).jpg', r: 1.5, rn: true, alt: 'Manita de un recién nacido con jersey de punto, sobre un dedo, en otro encuadre' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (15).jpg', r: 0.8, rn: true, alt: 'Manita de un recién nacido agarrada a un dedo, con su cara desenfocada al fondo' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (16).jpg', r: 1.25, rn: true, alt: 'Recién nacido tumbado mirando hacia arriba, con una mano levantada' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (17).jpg', r: 1.5, rn: true, alt: 'Recién nacido que mira hacia un lado mientras agarra el dedo de su madre' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (18).jpg', r: 0.8, rn: true, alt: 'Una madre besa a su recién nacido, con la manita del bebé en primer plano' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (19).jpg', r: 0.8, rn: true, alt: 'Pie de un recién nacido con calcetín blanco' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (20).jpg', r: 0.8, rn: true, alt: 'Una madre besa la mejilla de su recién nacido, que mira a cámara' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (21).jpg', r: 0.8, rn: true, alt: 'Mano de un adulto sobre la cabeza de un recién nacido con el pelo oscuro' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (23).jpg', r: 0.8, rn: true, alt: 'Pie de un recién nacido con los deditos, junto a un calcetín blanco' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (24).jpg', r: 0.8, rn: true, alt: 'Una madre con los ojos cerrados besa el pie de su recién nacido' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (25).jpg', r: 0.8, rn: true, alt: 'Manita de un recién nacido sobre la mano de un adulto' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (26).jpg', r: 0.8, rn: true, alt: 'Detalle de la manita de un recién nacido junto a su boca' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (27).jpg', r: 1.5, rn: true, alt: 'Recién nacido dormido junto a la mano de su madre, que lleva un anillo' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (1).jpg', r: 1.5, alt: 'Pareja a punto de besarse en el parque a contraluz, él con camisa vaquera' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (2).jpg', r: 1.5, alt: 'Pareja abrazada en el parque, ella apoyada en el pecho de él, que sonríe' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (3).jpg', r: 1.5, alt: 'Un hombre besa la frente de su pareja, que sonríe con los ojos cerrados' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (4).jpg', r: 1.25, alt: 'Un hombre sonríe con la mirada baja junto a su pareja, en el parque' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (5).jpg', r: 0.8, tripa: true, alt: 'Embarazada sentada en el regazo de su pareja, con la mano sobre la tripa' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (6).jpg', r: 1.25, alt: 'Pareja frente a frente en el parque, él sujetándole la nuca mientras ella sonríe' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (7).jpg', r: 1.25, alt: 'Pareja sonriéndose en el parque, ella mirando hacia arriba' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (8).jpg', r: 1.5, tripa: true, alt: 'Manos de una pareja sobre la tripa de una embarazada' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (9).jpg', r: 1.25, tripa: true, alt: 'Embarazada sentada en la hierba, con las manos sobre la tripa' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (10).jpg', r: 0.8, alt: 'Pareja frente a frente en el parque, él con camisa oscura y ella con chaqueta vaquera' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (11).jpg', r: 0.6667, alt: 'Pareja con las frentes juntas, ella sonriendo con unos pendientes grandes' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (12).jpg', r: 0.8, alt: 'Primer plano de una mujer riendo con la cara hacia arriba y las manos entrelazadas' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (13).jpg', r: 0.8, alt: 'Pareja con las frentes juntas y las manos entrelazadas, en primer plano' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (14).JPG', r: 0.8, tripa: true, alt: 'Embarazada mirándose la tripa mientras su pareja la abraza por detrás' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (15).jpg', r: 0.8, tripa: true, alt: 'Un hombre besa la tripa de una embarazada' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (16).jpg', r: 0.8, alt: 'Pareja con las palmas de las manos juntas en el parque' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (17).jpg', r: 1.25, tripa: true, alt: 'Manos de una pareja con un pequeño peluche sobre la tripa de una embarazada' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (18).jpg', r: 1.25, tripa: true, alt: 'Manos colocando unos calcetines de bebé con la frase I love mum sobre la tripa de una embarazada' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (19).jpg', r: 1.25, alt: 'Mujer con los brazos abiertos mirando hacia arriba en el parque' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (20).jpg', r: 1.25, tripa: true, alt: 'Embarazada sentada en la hierba con la mano sobre la tripa' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (22).jpg', r: 0.8, alt: 'Pareja abrazada con las frentes juntas, ella sonriendo con los ojos cerrados' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (23).jpg', r: 1.5, alt: 'Pareja bailando y girando en el parque, con el pelo de ella al vuelo' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (24).jpg', r: 0.8, alt: 'Un hombre besa la mejilla de su pareja, que mira hacia un lado' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (25).jpg', r: 1.25, tripa: true, alt: 'Manos de una pareja con anillos sobre la tripa de una embarazada' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (26).jpg', r: 0.8, alt: 'Pareja frente a frente en el parque, a punto de besarse, en un plano cercano' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (27).jpg', r: 0.8, alt: 'Pareja abrazada en el parque, ella riendo con los ojos cerrados' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (28).jpg', r: 0.8, alt: 'Pareja con las frentes juntas, ella sonriendo y mirándole' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (29).jpg', r: 0.8, alt: 'Manos de una pareja entrelazadas a contraluz' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (30).jpg', r: 1.25, alt: 'Manos de una pareja con anillos sobre la camisa de él' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (31).jpg', r: 1.25, alt: 'Manos de una pareja entrelazadas junto al cuello de ella' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (32).jpg', r: 1.25, alt: 'Manos de una pareja en el parque, desenfocadas' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (33).jpg', r: 1.25, alt: 'Silueta de una pareja bailando abrazada a contraluz' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (34).jpg', r: 0.8, alt: 'Mujer embarazada sonriendo a cámara mientras su pareja la lleva de la mano en el parque' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (35).jpg', r: 1.25, alt: 'Pareja riendo y bailando en el parque, ella con la cara hacia arriba y él con el brazo en alto' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (36).jpg', r: 0.8, tripa: true, alt: 'Embarazada con las manos sobre la tripa, con la sombra de una flor' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (37).jpg', r: 1.25, tripa: true, alt: 'Manos de una pareja sobre la tripa de una embarazada, en un plano cercano' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (38).jpg', r: 0.8, alt: 'Pareja cogida de la mano caminando por el parque' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (39).jpg', r: 1.25, tripa: true, alt: 'Mano con anillo sobre la tripa de una embarazada, con pantalón vaquero' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (40).jpg', r: 1.25, tripa: true, alt: 'Un hombre besa la tripa de una embarazada, vista de lado' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (41).jpg', r: 1.25, alt: 'Manos de una pareja con anillos entrelazadas, con la sonrisa de él al fondo' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (43).jpg', r: 0.6667, alt: 'Pareja sonriéndose en el parque' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (44).jpg', r: 1.5, alt: 'Manos de una pareja con anillos entrelazadas' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo (45).jpg', r: 0.8, tripa: true, alt: 'Manos sobre la tripa de una embarazada, con un anillo' },
    { f: 'Sesión 3/Sesión 3 Familia y RN (10).jpg', r: 0.8, alt: 'Manos de una madre con anillo sobre los deditos de un recién nacido' },
    { f: 'Sesión 3/Sesión 3 Familia y RN autor (22).jpg', r: 0.8, alt: 'Detalle del ojo de un recién nacido' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo autor(21).JPG', r: 0.8, alt: 'Detalle de las manos de una pareja entrelazadas' },
    { f: 'Sesión 4/Sesión 4 familia y embarazo autor(42).jpg', r: 0.8, alt: 'Mano con anillo de una mujer apoyada sobre su pierna' }
  ];

  // una foto es vertical si es más alta que ancha (r < 1); si falta r, se supone 3:2
  fotos.forEach(function (f) {
    if (!f.r) f.r = 1.5;
    f.vertical = f.r < 1;
    var nombre = f.f.split('/').pop();
    if (/ RN /.test(nombre)) f.rn = true;                                                    // recién nacido: se deduce del nombre
    if (/autor/i.test(nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) f.autor = true;   // fotografía de autor: se deduce del nombre
  });

  // las fotos de autor solo van en su página; el resto de la web (bloques y carrusel) usa las demás
  var fotosAutor = fotos.filter(function (f) { return f.autor; });
  fotos = fotos.filter(function (f) { return !f.autor; });

  // página Fotografía de autor: todas las fotos de autor, en grande y una a una, cada una con su formato
  // y su número debajo (001, 002, 003...). El número sigue el orden de la lista: la foto que se añade al final de la lista es la siguiente.
  Array.prototype.forEach.call(document.querySelectorAll('[data-galeria="autor"]'), function (galeria) {
    if (!fotosAutor.length) return;   // sin fotos se queda el aviso "Próximamente"
    galeria.innerHTML = '';
    fotosAutor.forEach(function (f, i) {
      var figura = document.createElement('figure');
      figura.className = 'foto-autor';
      figura.style.setProperty('--r', String(f.r));
      var enlace = document.createElement('a');
      enlace.className = 'foto-enlace';
      enlace.href = 'https://www.instagram.com/alexlucascaldera';
      enlace.target = '_blank';
      enlace.rel = 'noopener noreferrer';
      enlace.setAttribute('aria-label', f.alt + '. Abrir el Instagram de Alejandro de Lucas');
      var foto = document.createElement('img');
      foto.src = raiz + encodeURI(carpeta + f.f);
      foto.alt = f.alt;
      if (i > 0) foto.loading = 'lazy';   // la primera se carga ya; las demás, al irse acercando
      enlace.appendChild(foto);
      var numero = document.createElement('figcaption');
      numero.textContent = String(i + 1).padStart(3, '0');
      figura.appendChild(enlace);
      figura.appendChild(numero);
      galeria.appendChild(figura);
    });
  });

  // carrusel del pie: una foto por cada foto de la lista, en orden aleatorio
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
      enlace.style.setProperty('--r', String(f.r));   // el carrusel también respeta el formato de cada foto
      var foto = document.createElement('img');
      foto.src = raiz + encodeURI(carpetaCarrusel + f.f.split('/').pop());   // copia ligera, mismo nombre de archivo
      foto.alt = f.alt;
      foto.loading = 'lazy';
      enlace.appendChild(foto);
      pista.appendChild(enlace);
    });
  });

  // los huecos de fotos: bloques, foto sola y foto de presentación (menos las marcadas con data-fija)
  var huecos = Array.prototype.filter.call(
    document.querySelectorAll('.pantalla img, .foto-sola img, .sobre-foto img, .cuadricula img'),
    function (img) { return !img.hasAttribute('data-fija') && !img.closest('[data-galeria]'); }
  );
  if (!huecos.length) return;

  // las fotos verticales solo van en huecos altos (donde la foto no queda como una tira estrecha)
  function esHuecoAlto(img) {
    return !img.closest('.pantalla-ancha');
  }

  // el tema que pide el apartado donde está el hueco: 'rn', 'tripa' o null (cualquiera)
  function temaDe(img) {
    var apartado = img.closest('[data-tema]');
    return apartado ? apartado.getAttribute('data-tema') : null;
  }

  // lo que el apartado donde está el hueco NO admite: 'tripa' o null (nada)
  function excluyeDe(img) {
    var apartado = img.closest('[data-excluye]');
    return apartado ? apartado.getAttribute('data-excluye') : null;
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
    var tema = temaDe(img);
    if (tema === 'rn' && !f.rn) return false;                 // "Recién nacido": solo fotos con RN en el nombre
    if (tema === 'tripa' && !f.tripa) return false;           // "Embarazo": solo fotos donde se ve la tripa
    if (excluyeDe(img) === 'tripa' && f.tripa) return false;  // "Reportajes familiares": nunca fotos con la tripa
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
    img.src = raiz + encodeURI(carpeta + f.f);   // encodeURI: los espacios y las tildes del nombre no dan problemas
    img.alt = f.alt;
    var enlace = img.closest('a');
    if (enlace) {
      enlace.setAttribute('aria-label', f.alt + '. Abrir el Instagram de Alejandro de Lucas');
      // proporción de la foto (3:2, 2:3, 5:4 o 4:5); el CSS la usa para mostrarla entera, sin recortar
      enlace.style.setProperty('--r', String(f.r));
    }
  });
})();
