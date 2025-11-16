import { searchCity } from '/src/api/geocode.js';
import { getCurrentWeather } from '/src/api/weather.js';

// Este script ahora reutiliza las funciones del módulo `src/api` para evitar duplicar lógica.
const form = document.getElementById('search-form');
const input = document.getElementById('city-input');
const message = document.getElementById('message');
const result = document.getElementById('result');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  result.textContent = '';
  message.textContent = '';
  const city = input.value.trim();
  if (!city) {
    message.textContent = 'Ingresa una ciudad';
    return;
  }

  message.textContent = 'Buscando ciudad...';
  try {
    // Reutiliza searchCity desde src/api/geocode.js
    const place = await searchCity(city);
    if (!place) {
      message.textContent = 'No se encontró la ciudad';
      return;
    }

    message.textContent = `Obteniendo temperatura para ${place.name}, ${place.country}...`;
    // Reutiliza getCurrentWeather desde src/api/weather.js
    const weather = await getCurrentWeather(place.latitude, place.longitude);
    const temp = weather ? weather.temperature : null;

    if (temp === null) {
      message.textContent = 'No hay datos de temperatura disponibles';
      return;
    }

    message.textContent = '';
    result.innerHTML = `<strong>${place.name}, ${place.country}</strong>: ${Math.round(temp)} °C`;
  } catch (err) {
    console.error(err);
    message.textContent = 'Error al obtener datos. Revisa la consola.';
  }
});
