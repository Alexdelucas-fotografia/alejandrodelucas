@echo off
rem Crea las copias ligeras de las fotos para el carrusel (ver crear-copias-ligeras.ps1)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0crear-copias-ligeras.ps1" %*
echo.
pause
