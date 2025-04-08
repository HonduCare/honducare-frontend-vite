import { getToken } from "../components/Helpers/getToken.helper";

async function createAuthHeaders() {
  try {
    // Obtener el token directamente desde Firebase
    const token = await getToken();
    console.log("Token obtenido:", token);

    // Retorna el objeto con el encabezado de autenticación
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };
  } catch (error) {
    console.error("Error al obtener el token:", error);
    throw new Error("No se pudo crear el encabezado de autenticación.");
  }
}

export default createAuthHeaders;