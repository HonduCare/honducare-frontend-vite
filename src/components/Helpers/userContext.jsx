/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuarioLogged, setUsuarioLogged] = useState(null);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("user"));
    setUsuarioLogged(usuario ? usuario : { id_rol: "5" }); // Rol por defecto: Paciente
  }, []);

  const updateUser = (user) => {
    setUsuarioLogged(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  return (
    <UserContext.Provider value={{ usuarioLogged, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};