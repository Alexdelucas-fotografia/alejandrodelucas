# Crea las copias ligeras de las fotos para el carrusel de la web.
#
# Como usarlo: doble clic en crear-copias-ligeras.bat
#   (o desde PowerShell: .\crear-copias-ligeras.ps1   y con -Todo para rehacer TODAS las copias)
#
# Que hace:
#   1. Recorre fotos\web\Familia (incluidas las subcarpetas) y, por cada foto que no tenga copia,
#      crea en fotos\carrusel una copia de 1200 px por el lado largo, JPG de calidad 82 y sin datos EXIF.
#      La copia tiene EXACTAMENTE el mismo nombre que la foto original.
#   2. Avisa de las fotos que todavia no estan en la lista de fotos-aleatorias.js (hay que anadirlas).
#   3. Avisa de las copias que ya no tienen foto original. No borra nada.
#   4. Al final ejecuta detectar-formato.mjs, que mide cada foto (3:2, 2:3, 5:4 o 4:5) y lo apunta en la lista (r:),
#      y detectar-tripa.mjs, que mira las fotos con "embarazo" en el nombre y marca solo
#      las de la lista donde se ve la tripa (tripa: true). La primera vez descarga el modelo (unos 300 MB).
# Tus fotos originales no se tocan nunca.

param([switch]$Todo)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$raiz    = $PSScriptRoot
$origen  = Join-Path $raiz 'fotos\web\Familia'
$destino = Join-Path $raiz 'fotos\carrusel'
$lista   = Join-Path $raiz 'fotos-aleatorias.js'
$largo   = 1200
$calidad = 82

if (-not (Test-Path -LiteralPath $origen)) { throw "No encuentro la carpeta de fotos: $origen" }
if (-not (Test-Path -LiteralPath $destino)) { New-Item -ItemType Directory -Path $destino | Out-Null }

$jpg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep  = New-Object System.Drawing.Imaging.EncoderParameters 1
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), ([long]$calidad)

$fotos = Get-ChildItem -LiteralPath $origen -Recurse -File | Where-Object { $_.Extension -match '^\.(jpe?g)$' } | Sort-Object FullName

# dos fotos con el mismo nombre en carpetas distintas se pisarian en fotos\carrusel
$repetidas = $fotos | Group-Object Name | Where-Object { $_.Count -gt 1 }
if ($repetidas) {
  foreach ($r in $repetidas) { Write-Host "ERROR: hay varias fotos llamadas '$($r.Name)'. Cambia el nombre de una." -ForegroundColor Red }
  exit 1
}

$creadas = 0; $saltadas = 0
foreach ($f in $fotos) {
  $salida = Join-Path $destino $f.Name
  if ((Test-Path -LiteralPath $salida) -and -not $Todo) { $saltadas++; continue }

  $img = [System.Drawing.Image]::FromFile($f.FullName)
  try {
    # aplica la rotacion que guarda la camara (EXIF) para que la copia salga derecha
    if ($img.PropertyIdList -contains 0x0112) {
      switch ([int]$img.GetPropertyItem(0x0112).Value[0]) {
        6 { $img.RotateFlip('Rotate90FlipNone') }
        8 { $img.RotateFlip('Rotate270FlipNone') }
        3 { $img.RotateFlip('Rotate180FlipNone') }
      }
    }
    $esc = [Math]::Min(1.0, $largo / [Math]::Max($img.Width, $img.Height))
    $w = [int][Math]::Round($img.Width * $esc)
    $h = [int][Math]::Round($img.Height * $esc)
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    try {
      $g = [System.Drawing.Graphics]::FromImage($bmp)
      $g.InterpolationMode = 'HighQualityBicubic'; $g.SmoothingMode = 'HighQuality'; $g.PixelOffsetMode = 'HighQuality'
      $g.DrawImage($img, 0, 0, $w, $h)
      $g.Dispose()
      $bmp.Save($salida, $jpg, $ep)
    } finally { $bmp.Dispose() }
  } finally { $img.Dispose() }

  $kb = [Math]::Round((Get-Item -LiteralPath $salida).Length / 1KB)
  Write-Host "  copia creada: $($f.Name)  ($kb KB)"
  $creadas++
}

Write-Host ''
Write-Host "Copias creadas: $creadas | ya existian: $saltadas" -ForegroundColor Green

# --- comprobaciones con la lista de fotos-aleatorias.js ---
$avisos = 0
if (Test-Path -LiteralPath $lista) {
  $js = Get-Content -LiteralPath $lista -Raw -Encoding UTF8
  $enLista = @([regex]::Matches($js, "f:\s*'([^']+)'") | ForEach-Object { $_.Groups[1].Value })

  foreach ($f in $fotos) {
    $rel = $f.FullName.Substring($origen.Length + 1).Replace('\', '/')
    if ($enLista -cnotcontains $rel) {
      Write-Host "AVISO: la foto '$rel' no esta en la lista de fotos-aleatorias.js: no saldra en la web hasta que se anada." -ForegroundColor Yellow
      $avisos++
    }
  }
  foreach ($rel in $enLista) {
    if (-not (Test-Path -LiteralPath (Join-Path $origen ($rel -replace '/', '\')))) {
      Write-Host "AVISO: la lista de fotos-aleatorias.js incluye '$rel', pero esa foto no existe." -ForegroundColor Yellow
      $avisos++
    }
  }
}

$nombres = $fotos | ForEach-Object { $_.Name }
Get-ChildItem -LiteralPath $destino -File | Where-Object { $nombres -cnotcontains $_.Name } | ForEach-Object {
  Write-Host "AVISO: la copia '$($_.Name)' ya no tiene foto original (no se ha borrado)." -ForegroundColor Yellow
  $avisos++
}

if ($avisos -eq 0) { Write-Host 'Todo en orden: cada foto tiene su copia y esta en la lista.' -ForegroundColor Green }

# --- deteccion automatica del formato de cada foto (ver detectar-formato.mjs) y de las fotos donde se ve la tripa (ver detectar-tripa.mjs) ---
Write-Host ''
if (Get-Command node -ErrorAction SilentlyContinue) {
  & node (Join-Path $raiz 'detectar-formato.mjs')
  & node (Join-Path $raiz 'detectar-tripa.mjs')
  if ($LASTEXITCODE -ne 0) { Write-Host 'AVISO: no se ha podido detectar la tripa (mira el mensaje de arriba). Las marcas de la lista no se han cambiado.' -ForegroundColor Yellow }
} else {
  Write-Host 'AVISO: no encuentro Node.js, asi que no se detectan las fotos con tripa. Instalalo desde nodejs.org.' -ForegroundColor Yellow
}
