
/**
 * Crea encabezados de autenticación para una solicitud HTTP.
 * Obtiene un token de autenticación almacenado y lo utiliza para
 * configurar el encabezado `Authorization` con formato Bearer.
 *
 * @async
 * @function createAuthHeaders
 * @returns {Promise<Object>} Un objeto con la propiedad `headers`, 
 * donde `Authorization` contiene el token en formato Bearer.
 *
 * @example
 * const headers = await createAuthHeaders();
 * fetch('https://api.example.com/data', { method: 'GET', ...headers });
 */

function createAuthHeaders() {
  // Obtener el token de autenticación almacenado en storage del dispositivo.
  const token = localStorage.getItem('token');

  // Retorna el objeto con el encabezado de autenticación
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }
}

export default createAuthHeaders;
