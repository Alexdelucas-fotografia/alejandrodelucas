// Mide la proporción de cada foto y la apunta sola en fotos-aleatorias.js (r: ancho / alto).
//
// Como usarlo: no hace falta hacer nada. Se ejecuta solo al final de actualizar-fotos.bat
// (o a mano: node detectar-formato.mjs).
//
// Formatos que admite la web (se respetan enteros, sin recortar):
//   3:2 -> r: 1.5      2:3 -> r: 0.6667      5:4 -> r: 1.25      4:5 -> r: 0.8      cuadrada -> r: 1
// Si una foto tiene otra proporción, se apunta la más cercana y se avisa.
//
// Mide los originales de fotos/web/Familia/ (teniendo en cuenta si la cámara los guardó girados).
// Pone r: en cada línea de la lista y quita el antiguo vertical: true (ahora se deduce de r).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));   // la carpeta scripts/
const RAIZ = path.resolve(AQUI, '..');                      // la raíz del proyecto
const LISTA = path.join(AQUI, 'fotos-aleatorias.js');
const FOTOS = path.join(RAIZ, 'fotos', 'web', 'Familia');

const FORMATOS = [1.5, 1.25, 1, 0.8, 0.6667];   // 3:2, 5:4, 1:1, 4:5, 2:3
const TOLERANCIA = 0.03;                        // diferencia máxima para considerar que una foto es de ese formato
const nombreFormato = { 1.5: '3:2', 1.25: '5:4', 1: '1:1', 0.8: '4:5', 0.6667: '2:3' };

// orientación EXIF de un JPG (1 = normal; 5 a 8 = la cámara lo guardó girado 90°), leída de su cabecera
function orientacion(b, ini, fin) {
  if (b.toString('latin1', ini + 4, ini + 8) !== 'Exif') return 1;
  const t = ini + 10;                                    // inicio de la cabecera TIFF
  const le = b.toString('latin1', t, t + 2) === 'II';
  const u16 = p => (le ? b.readUInt16LE(p) : b.readUInt16BE(p));
  const u32 = p => (le ? b.readUInt32LE(p) : b.readUInt32BE(p));
  const ifd = t + u32(t + 4);
  for (let k = 0, n = u16(ifd); k < n; k++) {
    const e = ifd + 2 + k * 12;
    if (e + 12 > fin) break;
    if (u16(e) === 0x0112) return u16(e + 8);
  }
  return 1;
}

// ancho y alto de un JPG leyendo su cabecera (marcador SOF), ya girado si la cámara lo guardó de lado
function medirJpg(archivo) {
  const b = fs.readFileSync(archivo);
  let i = 2, giro = 1;
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const marca = b[i + 1];
    if (marca === 0xe1 && giro === 1) giro = orientacion(b, i + 2, i + 2 + b.readUInt16BE(i + 2));
    if (marca >= 0xc0 && marca <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marca)) {
      const alto = b.readUInt16BE(i + 5), ancho = b.readUInt16BE(i + 7);
      return giro >= 5 && giro <= 8 ? { ancho: alto, alto: ancho } : { ancho, alto };
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
  const foto = path.join(FOTOS, ...m[2].split('/'));
  if (!fs.existsSync(foto)) { console.log(`AVISO: no encuentro la foto '${m[2]}' en fotos/web/Familia.`); continue; }
  const { ancho, alto } = medirJpg(foto);
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
