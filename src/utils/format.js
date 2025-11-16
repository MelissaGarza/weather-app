export function formatTemperature(t){
  return `${Math.round(t)} °C`;
}

export function weatherCodeToText(code){
  const map = {
    0: 'Cielo claro',
    1: 'Principalmente despejado',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Niebla',
    48: 'Depositos de escarcha',
    51: 'Llovizna ligera',
    61: 'Lluvia ligera',
    71: 'Nieve ligera',
    80: 'Lluvias',
    95: 'Tormenta',
  };
  return map[code] ?? 'Desconocido';
}
