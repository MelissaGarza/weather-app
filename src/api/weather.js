/**

Obtiene el estado del tiempo actual para una ubicación dada.
Consulta un proveedor de datos meteorológicos para recuperar información
en tiempo real (temperatura, sensación térmica, descripción, humedad, viento, etc.)
de la ubicación solicitada. Permite configurar unidades e intercambiar el proveedor.
@param {string | [number, number] | {lat:number, lon:number} | Object} location
Ubicación a consultar. Puede ser:
string: nombre de lugar o dirección (p. ej., "Madrid, ES").
[lat, lon]: coordenadas en grados decimales.
{lat, lon} u objeto con claves equivalentes (p. ej., {city, country}).
@param {"metric"|"imperial"|"standard"} [units="metric"]
Unidades para los resultados.
"metric": °C y m/s
"imperial": °F y mph
"standard": K y m/s
@param {Object} [provider]
Cliente/proveedor meteorológico que implemente una API de “clima actual”.
Si no se especifica, se usará el proveedor por defecto de la app.
@param {number} [timeout=10]
Tiempo máximo en segundos para la consulta antes de abortar.
@returns {Promise<{
location: any,
temperature: number,
feels_like: number,
description: string,
humidity: number,
wind_speed: number,
wind_deg: number,
pressure: number,
timestamp: number
}>}
Promesa que resuelve con los datos del clima actual. El proveedor puede
añadir campos extra (p. ej., visibilidad, nubosidad, icono, etc.).
@throws {TypeError}
Si el parámetro location no tiene un formato válido.
@throws {Error}
Si ocurre un problema de red, timeout o el proveedor responde con error.
@example
// Por nombre de ciudad
const data = await getCurrentWeather("Madrid, ES", "metric");
console.log(Math.round(data.temperature));
@example
// Por coordenadas
const data = await getCurrentWeather([40.4168, -3.7038], "imperial");
console.log(data.description);
@example
// Usando un proveedor personalizado y manejando errores
try {
const data = await getCurrentWeather({ lat: 40.4168, lon: -3.7038 }, "metric", myProvider, 5);
console.log(data.feels_like);
} catch (err) {
// Manejo de errores (TypeError, Error por red/timeout/proveedor)
console.error(err);
} */

export async function getCurrentWeather(lat, lon) {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    throw new Error('Latitude and longitude must be numbers');
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius&timezone=auto`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Weather API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const weather = data?.current_weather;

    return weather ?? null; // devuelve null si no existe current_weather
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    return null; // evita romper el flujo del programa
  }
}


/**
 * Obtiene el pronóstico del tiempo de 5 días para una ubicación dada.
 * @param {number} lat - Latitud de la ubicación.
 * @param {number} lon - Longitud de la ubicación.
 * @returns {Promise<Array<{
 * date: string,
 * max_temp: number,
 * min_temp: number,
 * description: string, // Nota: La descripción la inferiremos del código.
 * weather_code: number
 * }>>} Promesa que resuelve con un array de pronósticos diarios.
 * @throws {Error} Si las coordenadas no son números o si falla la API.
 */
export async function getFiveDayForecast(lat, lon) {
    if (typeof lat !== 'number' || typeof lon !== 'number') {
        throw new Error('Latitude and longitude must be numbers');
    }

    // Solicitamos 5 días de pronóstico y las temperaturas (máx y mín)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&temperature_unit=celsius&timezone=auto`;

    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Forecast API error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        const dailyData = data?.daily;

        if (!dailyData || dailyData.time.length === 0) {
            return []; // Devuelve un array vacío si no hay datos
        }

        // Mapeamos los arrays paralelos a un formato de objeto más limpio
        const forecast = dailyData.time.map((date, index) => ({
            date: date,
            max_temp: dailyData.temperature_2m_max[index],
            min_temp: dailyData.temperature_2m_min[index],
            weather_code: dailyData.weather_code[index]
        }));

        return forecast;
    } catch (error) {
        // Esto permite que el error sea capturado y manejado en el archivo index.js
        console.error('Error fetching forecast data:', error.message);
        throw new Error('Failed to retrieve 5-day forecast.');
    }
}
