export function formatearFecha(fechaISO, weekday) {
  const fecha = new Date(fechaISO);

  // Sumarle 6 horas para que muestre el valor correcto y no 1 dia menos en la fecha formateada
  fecha.setUTCHours(fecha.getUTCHours() + 6);

  const opciones = {
    timeZone: 'America/Tegucigalpa',
    weekday: weekday ? weekday : 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return fecha.toLocaleDateString('es-HN', opciones);
}

export function formatearHora(hora) {
  const [h, m] = hora.split(':');
  let hora12 = parseInt(h);
  const ampm = hora12 >= 12 ? 'PM' : 'AM';

  // Convertir a formato de 12 horas
  hora12 = hora12 % 12;
  hora12 = hora12 ? hora12 : 12; // El 0 de las 00:00 se convierte en 12
  const minutosFormateados = m.padStart(2, '0');

  return `${hora12}:${minutosFormateados} ${ampm}`;
}

export function removeComillas(str) {
  return str.replace(/['"]/g, '');
}