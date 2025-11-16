/**
 * Busca las coordenadas geográficas (lat/lon) y datos de ubicación para una ciudad dada.
 * Utiliza el servicio gratuito de geocodificación de Open-Meteo.
 * @param {string} name - El nombre de la ciudad o lugar a buscar.
 * @returns {Promise<Object | null>} Una promesa que resuelve con un objeto de ubicación o null si no se encuentra.
 * @throws {Error} Si hay un error de red o de la API.
 */
export async function searchCity(name) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1`;
    
    const res = await fetch(url);
    
    if (!res.ok) {
        // Mejoramos el manejo de errores para dar más detalle
        throw new Error(`Geocoding API error: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    
    if (!data.results || data.results.length === 0) {
        return null; // No se encontraron resultados para la ciudad
    }
    
    const first = data.results[0];
    
    // Devolvemos el objeto con la información completa que ya manejabas
    return {
        name: first.name,
        latitude: first.latitude,
        longitude: first.longitude,
        country: first.country,
        timezone: first.timezone // Esta propiedad puede ser útil más adelante
    };
}