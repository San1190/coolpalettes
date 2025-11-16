# CoolPalettes

Generador de paletas armónicas ultra-rápido. Pulsa `Space` para crear combinaciones, haz clic para copiar, bloquea colores y comparte la paleta por URL.

- Live: https://TU_DOMINIO.vercel.app
- Repositorio: https://github.com/TU_USUARIO/coolpalettes

## Características
- Generación de 5 colores armónicos (análogo, monocromático, tríada, tétrada, complementaria dividida).
- Copia al portapapeles con un clic y toast “Copiado”.
- Bloqueo por columna para mantener colores al generar nuevas paletas.
- Cambio de formato mostrado: `HEX` → `RGB` → `HSL`.
- Compartir por URL (`/palette/<hex1-hex2-hex3-hex4-hex5>`).
- Favoritos en `localStorage` con previsualización en barra lateral.
- Nav superior con controles rápidos.

## Stack
- Framework: Next.js 16 (App Router)
- Estilos: Tailwind CSS
- Colores: `tinycolor2` (armonías) y `chroma-js` (opcional para variaciones)

## Estructura
```
app/
  page.tsx            # Pantalla principal (grid de 5 columnas)
  layout.tsx          # Layout global con nav y sidebar
  palette/[slug]/     # Ruta dinámica para paletas compartidas
components/
  Chrome.tsx          # Nav superior y sidebar de favoritos
lib/
  colors.ts           # Utilidades: generatePalette, formatos, contraste
```

## Instalación
```bash
npm install
npm run dev
# http://localhost:3000
```

## Uso
- `Space`: genera una nueva paleta respetando los colores bloqueados.
- Clic en el color: copia el código al portapapeles.
- Candado: bloquea/desbloquea el color de esa columna.
- Nav superior:
  - Campo color base: nombre/HEX/RGB/HSL.
  - Selector de armonía.
  - Botón Formato: rota entre `HEX`/`RGB`/`HSL`.
  - Botón Generar.
  - Botón Guardar: añade la paleta al sidebar.
  - Botón Compartir: abre la ruta `/palette/<slug>`.

## Deploy
### Vía GitHub + Vercel (recomendado)
1. Crea un repo en GitHub y empuja el código:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/coolpalettes.git
   git push -u origin main
   ```
2. Entra a `vercel.com` y conecta tu cuenta de GitHub.
3. Importa el repo `coolpalettes`.
4. Build: `npm run build` (detectado automáticamente). Output: `.next`.
5. Publica y obtén tu URL `https://<proyecto>.vercel.app`.
6. Actualiza el campo “Live” arriba con tu dominio.

### Vía Vercel CLI (alternativa)
```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

## SEO
- `app/layout.tsx` define `title` y `description` optimizados.
- Añade contenido guía visible: “Pulsa espacio… Haz clic para copiar…”.
- Las URLs compartidas (`/palette/...`) generan enlaces naturales.

## Scripts
```bash
npm run dev     # desarrollo
npm run build   # producción
npm run start   # servir build
npm run lint    # lint
```

## Licencia
MIT — Úsalo y mejora libremente.
