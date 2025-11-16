# Weather App (sencilla)

Aplicación del clima simple en JavaScript que permite buscar por nombre de ciudad, obtener coordenadas con la API de geocoding de Open-Meteo y mostrar el clima actual usando Open-Meteo.

Estructura creada:

- public/
  - index.html
- src/
  - index.js
  - styles.css
  - api/geocode.js
  - api/weather.js
  - ui/elements.js
  - ui/render.js
  - utils/format.js
- package.json

Cómo probar (PowerShell):

```powershell
# desde la carpeta creada
cd c:/Users/melis/Documents/weather-app
# instalar Vite (si aún no lo tienes en el proyecto)
npm install
# iniciar servidor dev (si usas vite)
npm run dev
# o abre `public/index.html` con Live Server en VS Code
```

Notas:
- Open-Meteo no requiere API key para estas llamadas básicas.
- Si prefieres no usar Vite, puedes usar la extensión Live Server y abrir `public/index.html`.
