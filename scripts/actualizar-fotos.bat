@echo off
rem Mide el formato de cada foto y detecta las de tripa (ver detectar-formato.mjs y detectar-tripa.mjs)
cd /d "%~dp0"
node detectar-formato.mjs
node detectar-tripa.mjs
pause
