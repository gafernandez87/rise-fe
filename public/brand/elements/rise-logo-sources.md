# Logos rojos de RISE

- `rise-logo-red-pt.svg`: mesa 1 de `RISE TRADUZIDO MODELO 1.ai`.
- `rise-logo-red-es.svg`: mesa 8 del mismo archivo.
- Original descargado: `recursos/logos/RISE TRADUZIDO MODELO 1.ai`, en la raíz del proyecto.
- Fuente: https://drive.google.com/file/d/1_YCtZ_ZE7Rp_Z50pVqxxmFYf2Wh429V6/view
- `rise-logo-red-en.svg`: logo principal horizontal del manual de marca existente, página 2 (`recursos/manual de marca.pdf`). El archivo de Drive contiene solamente español y portugués.

Los tres SVG conservan los trazados y colores de sus originales. El texto está convertido a curvas para preservar la tipografía sin depender de fuentes instaladas. Los márgenes vacíos se recortaron y los fondos son transparentes.

`components/brand/rise-logo.tsx` selecciona el SVG, sus proporciones y su texto alternativo según el idioma activo.
