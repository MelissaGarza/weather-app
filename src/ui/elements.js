// src/ui/elements.js

/**
 * Obtiene y devuelve las referencias a los elementos esenciales del DOM.
 * @returns {Object} Un objeto con referencias a los elementos del formulario, input, estado y resultados.
 */
export function getElements() {
    // Obtener los elementos por su ID REAL en index.html
    const form = document.querySelector('#search-form');
    const input = document.querySelector('#city-input');
    const status = document.querySelector('#status');
    const results = document.querySelector('#results');

    // Validación mínima para asegurarnos de que el HTML esté completo.
    if (!form || !input || !status || !results) {
        console.error('ERROR: No se pudieron encontrar todos los elementos esenciales del DOM.');
        throw new Error('Faltan elementos HTML necesarios (search-form, city-input, status, results).');
    }

    return {
        form,    
        input,   
        status,  
        results, 
    };
}
