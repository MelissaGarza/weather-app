// src/ui/render.js

// 🖼️ FUNCIONES DE RENDERIZADO BÁSICAS

/**
 * Renderiza el estado de "cargando" (aunque esto también se maneja en index.js/setStatus).
 * Se mantiene por si se necesitara una visualización más compleja.
 * @param {HTMLElement} container - El elemento donde se renderizará el mensaje.
 */
export function renderLoading(container) {
    container.innerHTML = '<h2>Cargando...</h2>';
}

/**
 * Muestra un mensaje de error en la interfaz.
 * @param {HTMLElement} container - El elemento donde se renderizará el error.
 * @param {string} message - El mensaje de error específico.
 */
export function renderError(container, message) {
    container.innerHTML = `<h2 class="error-message">❌ Error: ${message}</h2>`;
}

// ☀️ FUNCIÓN PARA EL CLIMA ACTUAL

/**
 * Muestra los datos del clima actual.
 * @param {HTMLElement} container - El elemento donde se renderizará el resultado.
 * @param {Object} place - Objeto con los datos de la ubicación ({name, country, latitude, longitude, etc.}).
 * @param {Object} weather - Objeto con los datos del clima actual (temperatura, etc.).
 */
export function renderWeather(container, place, weather) {
    if (!weather) {
        return renderError(container, `No se pudo obtener el clima para ${place.name}.`);
    }

    const html = `
        <div class="current-weather-card">
            <h2>Clima Actual en ${place.name}</h2>
            
            <div class="weather-info">
                <p class="temperature">
                    ${Math.round(weather.temperature)}°C 
                    <span class="small-text"> (${weather.is_day ? 'Día' : 'Noche'})</span>
                </p>
                
                <p>Velocidad del Viento: ${weather.windspeed} km/h</p>
                <p>Dirección del Viento: ${weather.winddirection}°</p>
            </div>
        </div>
    `;
    
    // Insertamos el clima actual antes del pronóstico, pero dentro del contenedor
    const weatherSection = document.createElement('section');
    weatherSection.innerHTML = html;
    container.appendChild(weatherSection);
}

// 🗓️ FUNCIÓN PARA EL PRONÓSTICO DE 5 DÍAS

// Función auxiliar para obtener la descripción del clima basada en el código WMO
// Puedes expandir esta lista para mayor detalle.
function getWeatherDescription(code) {
    const descriptions = {
        0: 'Despejado', 1: 'Mayormente despejado', 2: 'Parcialmente nublado',
        3: 'Nublado', 45: 'Niebla', 51: 'Llovizna ligera', 
        61: 'Lluvia ligera', 63: 'Lluvia moderada', 65: 'Lluvia intensa',
        80: 'Chubascos', 82: 'Chubascos fuertes', 95: 'Tormenta',
        // Si el código no está aquí, usamos un genérico:
    };
    return descriptions[code] || 'Condición desconocida'; 
}

/**
 * Muestra el pronóstico de 5 días en el contenedor de resultados.
 * @param {HTMLElement} container - El elemento DOM donde se renderizarán los resultados.
 * @param {Array<Object>} forecastData - El array con los datos del pronóstico.
 */
export function renderForecast(container, forecastData) {
    if (!forecastData || forecastData.length === 0) {
        return; // No renderizamos si no hay datos
    }

    const forecastHTML = forecastData.map(day => {
        // Formateamos la fecha (ej. "jueves, 13/05/2027")
        const dateOptions = { weekday: 'short', day: 'numeric', month: 'numeric' };
        const date = new Date(day.date).toLocaleDateString(undefined, dateOptions);
        
        const description = getWeatherDescription(day.weather_code);
        
        return `
            <div class="forecast-day">
                <h4>${date}</h4>
                <p class="description">${description}</p>
                <p class="temp-max">⬆️ ${Math.round(day.max_temp)}°C</p>
                <p class="temp-min">⬇️ ${Math.round(day.min_temp)}°C</p>
            </div>
        `;
    }).join('');

    // Creamos un contenedor específico para el pronóstico y lo anexamos
    const forecastSection = document.createElement('section');
    forecastSection.className = 'forecast-section';
    forecastSection.innerHTML = `
        <h3>Pronóstico de 5 Días</h3>
        <div class="forecast-list">
            ${forecastHTML}
        </div>
    `;
    container.appendChild(forecastSection);
}