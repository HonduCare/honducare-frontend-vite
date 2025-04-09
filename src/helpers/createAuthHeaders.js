import { getToken } from "../components/Helpers/getToken.helper";

async function createAuthHeaders() {
  try {
    const token = await getToken();
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