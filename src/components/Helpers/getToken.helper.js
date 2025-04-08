import { auth } from "../../FirebaseConfig";
import { getIdToken } from "firebase/auth";

export const getToken = async () => {
    try {
      const user = auth.currentUser; // Obtén el usuario actual
      if (user) {
        const token = await getIdToken(user); // Obtén el token del usuario
        return token;
      } else {
        throw new Error("No hay un usuario autenticado.");
      }
    } catch (error) {
      console.error("Error al obtener el token:", error);
      throw error;
    }
  };