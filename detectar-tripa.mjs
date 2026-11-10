// Detecta solas las fotos donde se ve la tripa de la embarazada y pone (o quita) tripa: true en fotos-aleatorias.js.
//
// Como usarlo: no hace falta hacer nada. Se ejecuta solo al final de crear-copias-ligeras.bat
// (o a mano: node detectar-tripa.mjs).
//
// Que hace:
//   1. Mira solo las fotos que llevan "embarazo" en el nombre del archivo (las de la sesion de embarazo).
//   2. De cada una, mira la imagen (copia ligera de fotos/carrusel/) con un modelo de reconocimiento de imagenes
//      (CLIP) que funciona EN TU ORDENADOR: las fotos no se envian a ningun sitio.
//   3. Si en la foto se ve la tripa, le pone tripa: true en la lista de fotos-aleatorias.js; si no, se lo quita.
//      Ya no hay que marcarlo a mano. La norma esta explicada en la cabecera de fotos-aleatorias.js.
//   4. Guarda lo que ha decidido en tripa-detectado.json, asi solo analiza las fotos nuevas (el resto no se repite).
//      Probado con 45 fotos de embarazo: las que enseñan la tripa puntuan 0.89 o mas, y las demas 0.27 como maximo.
//
// La primera vez descarga el modelo (unos 300 MB) y sus herramientas en %LOCALAPPDATA%\mi-web-tripa
// (fuera de la web y de OneDrive). Hace falta conexion a internet solo esa vez.
// Necesita Node.js instalado.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const LISTA = path.join(RAIZ, 'fotos-aleatorias.js');
const CARRUSEL = path.join(RAIZ, 'fotos', 'carrusel');
const CACHE = path.join(RAIZ, 'tripa-detectado.json');
const HERRAMIENTAS = path.join(process.env.LOCALAPPDATA || os.homedir(), 'mi-web-tripa');

const METODO = 'v2';    // si se cambian las etiquetas o el umbral, se cambia este nombre y se vuelven a analizar todas las fotos
const UMBRAL = 0.5;     // a partir de esta probabilidad se considera que se ve la tripa
const ETIQUETAS = [     // la primera es la que buscamos; las otras sirven para contrastar (retratos, abrazos, manos...)
  'a close-up photo of a pregnant belly',
  'a photo of a couple hugging or dancing',
  'a close-up of hands holding each other',
  'a portrait of a smiling woman',
  'a close-up of two faces close together',
  'a photo of a couple kissing',
  'a woman standing outdoors',
];

// "Sesion familia y embarazo 4 (3).JPG" -> sin tildes y en minusculas, para buscar la palabra embarazo
const plano = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// --- 1. leer la lista ---
let texto = fs.readFileSync(LISTA, 'utf8');
const crlf = texto.includes('\r\n');
texto = texto.replace(/\r\n/g, '\n');
const lineas = texto.split('\n');
const entradas = [];   // { i: numero de linea, nombre: archivo }
lineas.forEach((l, i) => {
  const m = l.match(/^\s*\{ f: '([^']+)'/);
  if (m) entradas.push({ i, nombre: m[1].split('/').pop() });
});
const candidatas = entradas.filter(e => plano(e.nombre).includes('embarazo'));

let cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
if (cache._metodo !== METODO) cache = { _metodo: METODO };   // otro método: se vuelven a analizar todas las fotos
const pendientes = candidatas.filter(e => !(e.nombre in cache) && fs.existsSync(path.join(CARRUSEL, e.nombre)));
for (const e of candidatas) {
  if (!(e.nombre in cache) && !fs.existsSync(path.join(CARRUSEL, e.nombre))) {
    console.log(`AVISO: '${e.nombre}' no tiene copia ligera en fotos/carrusel: ejecuta crear-copias-ligeras.bat.`);
  }
}

// --- 2. mirar las fotos nuevas (solo si las hay) ---
if (pendientes.length) {
  console.log(`Analizando ${pendientes.length} foto(s) de embarazo nueva(s)...`);
  const requerir = createRequire(path.join(HERRAMIENTAS, 'x.js'));
  let ruta;
  try { ruta = requerir.resolve('@huggingface/transformers'); }
  catch {
    console.log('Primera vez: instalando las herramientas de reconocimiento de imagen (puede tardar unos minutos)...');
    fs.mkdirSync(HERRAMIENTAS, { recursive: true });
    if (!fs.existsSync(path.join(HERRAMIENTAS, 'package.json'))) {
      fs.writeFileSync(path.join(HERRAMIENTAS, 'package.json'), '{ "name": "mi-web-tripa", "private": true }\n');
    }
    execSync('npm install @huggingface/transformers --no-audit --no-fund', { cwd: HERRAMIENTAS, stdio: 'inherit', shell: true });
    ruta = requerir.resolve('@huggingface/transformers');
  }
  const lib = await import(pathToFileURL(ruta).href);
  const { pipeline, env } = lib.pipeline ? lib : lib.default;
  env.cacheDir = path.join(HERRAMIENTAS, 'modelo');
  console.log('Cargando el modelo (la primera vez se descarga, unos 300 MB)...');
  const clasificar = await pipeline('zero-shot-image-classification', 'Xenova/clip-vit-base-patch32', { dtype: 'fp16' });
  for (const e of pendientes) {
    const r = await clasificar(path.join(CARRUSEL, e.nombre), ETIQUETAS);
    cache[e.nombre] = Math.round(r.find(x => x.label === ETIQUETAS[0]).score * 1000) / 1000;
    console.log(`  ${cache[e.nombre] >= UMBRAL ? 'SE VE LA TRIPA' : 'no se ve      '} (${cache[e.nombre]})  ${e.nombre}`);
  }
  fs.writeFileSync(CACHE, JSON.stringify(cache, null, 2) + '\n');
}

// las fotos que ya no están en la lista se quitan de la caché
for (const k of Object.keys(cache)) {
  if (k !== '_metodo' && !entradas.some(e => e.nombre === k)) delete cache[k];
}
fs.writeFileSync(CACHE, JSON.stringify(cache, null, 2) + '\n');

// --- 3. poner / quitar tripa: true en la lista ---
let puestas = 0, quitadas = 0;
for (const e of entradas) {
  const l = lineas[e.i];
  const tiene = l.includes('tripa: true, ');
  const debe = candidatas.includes(e) && (cache[e.nombre] ?? 0) >= UMBRAL;
  if (debe && !tiene) {
    lineas[e.i] = l.replace(/(\{ f: '[^']+', )/, '$1tripa: true, ');
    puestas++;
  } else if (!debe && tiene) {
    lineas[e.i] = l.replace('tripa: true, ', '');
    quitadas++;
  }
}
if (puestas || quitadas) {
  const salida = lineas.join('\n');
  fs.writeFileSync(LISTA, crlf ? salida.replace(/\n/g, '\r\n') : salida);
}
const total = entradas.filter(e => lineas[e.i].includes('tripa: true, ')).length;
console.log(`Tripa: ${total} foto(s) marcada(s) en la lista (puestas ${puestas}, quitadas ${quitadas}).`);
