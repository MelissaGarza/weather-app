// src/index.js

// IMPORTACIONES
// Elementos UI
import { getElements } from './ui/elements.js'; 
// Funciones de renderizado (Asegúrate de que 'renderForecast' exista en render.js)
import { renderLoading, renderError, renderWeather, renderForecast } from './ui/render.js';
// Lógica de API
import { searchCity } from './api/geocode.js';
import { getCurrentWeather, getFiveDayForecast } from './api/weather.js'; // Incluye la nueva función

// VARIABLES GLOBALES
const els = getElements(); // Obtenemos las referencias a los elementos del DOM.

// FUNCIÓN AUXILIAR: Muestra el estado (cargando/error)
/**
 * Establece el texto y la clase de estado en la UI.
 * @param {string} text - El mensaje a mostrar.
 * @param {boolean} [isError=false] - Si es un mensaje de error.
 */
function setStatus(text, isError = false) {
    if (!text) {
        els.status.textContent = '';
        els.status.className = ''; // Limpiamos la clase cuando no hay texto
    } else {
        els.status.textContent = text;
        els.status.className = isError ? 'error' : 'loading';
    }
}

// LÓGICA PRINCIPAL: Manejo del Formulario
els.form.addEventListener('submit', async (ev) => {
    ev.preventDefault(); // Detenemos el envío tradicional del formulario.
    
    // Limpiamos la interfaz antes de empezar una nueva búsqueda
    const city = els.input.value.trim();
    els.results.innerHTML = '';
    
    if (!city) {
        setStatus('Ingresa una ciudad para empezar a buscar.', true);
        return; // Salimos si no hay ciudad
    }

    setStatus('Buscando ubicación...');
    
    try {
        // --- PASO 1: GEOCODIFICACIÓN (Encontrar las coordenadas) ---
        const place = await searchCity(city);
        
        if (!place) {
            setStatus(`No se encontró la ciudad: "${city}". ¿Seguro que existe?`, true);
            return;
        }

        // --- PASO 2: OBTENER CLIMA ACTUAL ---
        setStatus('Obteniendo el clima actual...');
        // Ojo: La función getCurrentWeather en tu weather.js espera (lat, lon)
        const weather = await getCurrentWeather(place.latitude, place.longitude);

        // --- PASO 3: OBTENER PRONÓSTICO DE 5 DÍAS ---
        setStatus('Obteniendo el pronóstico de 5 días...');
        const forecast = await getFiveDayForecast(place.latitude, place.longitude);
        
        // --- PASO 4: RENDERIZAR RESULTADOS Y LIMPIAR ESTADO ---
        setStatus(''); // Limpiamos el mensaje de estado

        if (weather) {
            renderWeather(els.results, place, weather);
        } else {
            console.warn('No se pudo obtener el clima actual.');
        }

        if (forecast && forecast.length > 0) {
            renderForecast(els.results, forecast);
        } else {
            console.warn('No se pudo obtener el pronóstico de 5 días.');
        }
        
    } catch (err) {
        // Manejo de errores generales (red, API, etc.)
        console.error('Ha ocurrido un error en el flujo de búsqueda:', err);
        setStatus('¡Oops! Error grave al obtener los datos. Revisa tu conexión.', true);
        renderError(els.results, 'Un error inesperado ha detenido la búsqueda de clima.');
    }
});