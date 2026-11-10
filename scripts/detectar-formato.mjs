// Mide la proporción de cada foto y la apunta sola en fotos-aleatorias.js (r: ancho / alto).
//
// Como usarlo: no hace falta hacer nada. Se ejecuta solo al final de crear-copias-ligeras.bat
// (o a mano: node detectar-formato.mjs).
//
// Formatos que admite la web (se respetan enteros, sin recortar):
//   3:2 -> r: 1.5      2:3 -> r: 0.6667      5:4 -> r: 1.25      4:5 -> r: 0.8      cuadrada -> r: 1
// Si una foto tiene otra proporción, se apunta la más cercana y se avisa.
//
// Mide la copia ligera de fotos/carrusel/ (misma proporción que el original y ya girada).
// Pone r: en cada línea de la lista y quita el antiguo vertical: true (ahora se deduce de r).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));   // la carpeta scripts/
const RAIZ = path.resolve(AQUI, '..');                      // la raíz del proyecto
const LISTA = path.join(AQUI, 'fotos-aleatorias.js');
const CARRUSEL = path.join(RAIZ, 'fotos', 'carrusel');

const FORMATOS = [1.5, 1.25, 1, 0.8, 0.6667];   // 3:2, 5:4, 1:1, 4:5, 2:3
const TOLERANCIA = 0.03;                        // diferencia máxima para considerar que una foto es de ese formato
const nombreFormato = { 1.5: '3:2', 1.25: '5:4', 1: '1:1', 0.8: '4:5', 0.6667: '2:3' };

// ancho y alto de un JPG leyendo su cabecera (marcador SOF)
function medirJpg(archivo) {
  const b = fs.readFileSync(archivo);
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const marca = b[i + 1];
    if (marca >= 0xc0 && marca <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marca)) {
      return { alto: b.readUInt16BE(i + 5), ancho: b.readUInt16BE(i + 7) };
    }
    i += 2 + b.readUInt16BE(i + 2);
  }
  throw new Error('no se pudo medir ' + archivo);
}

let texto = fs.readFileSync(LISTA, 'utf8');
const crlf = texto.includes('\r\n');
texto = texto.replace(/\r\n/g, '\n');
const lineas = texto.split('\n');

let cambios = 0;
const cuenta = {};
for (let i = 0; i < lineas.length; i++) {
  const m = lineas[i].match(/^(\s*\{ f: ')([^']+)(', )(.*)$/);
  if (!m) continue;
  const nombre = m[2].split('/').pop();
  const copia = path.join(CARRUSEL, nombre);
  if (!fs.existsSync(copia)) { console.log(`AVISO: '${nombre}' no tiene copia ligera en fotos/carrusel: ejecuta crear-copias-ligeras.bat.`); continue; }
  const { ancho, alto } = medirJpg(copia);
  const real = ancho / alto;
  const cercano = FORMATOS.reduce((a, b) => (Math.abs(b - real) < Math.abs(a - real) ? b : a));
  if (Math.abs(cercano - real) > TOLERANCIA) {
    console.log(`AVISO: '${nombre}' mide ${ancho}x${alto} (${real.toFixed(3)}): no es 3:2, 2:3, 5:4 ni 4:5. Se usa ${nombreFormato[cercano]}, así que se recortará un poco.`);
  }
  cuenta[nombreFormato[cercano]] = (cuenta[nombreFormato[cercano]] || 0) + 1;
  // el resto de la línea sin r: ni vertical:, y con r: nuevo justo después de f
  const resto = m[4].replace(/\br: [0-9.]+, /, '').replace(/vertical: true, /, '');
  const nueva = `${m[1]}${m[2]}${m[3]}r: ${cercano}, ${resto}`;
  if (nueva !== lineas[i]) { lineas[i] = nueva; cambios++; }
}

if (cambios) {
  const salida = lineas.join('\n');
  fs.writeFileSync(LISTA, crlf ? salida.replace(/\n/g, '\r\n') : salida);
}
console.log('Formatos:', Object.entries(cuenta).map(([k, v]) => `${k}: ${v}`).join(' | '), `(${cambios} línea(s) actualizada(s))`);
