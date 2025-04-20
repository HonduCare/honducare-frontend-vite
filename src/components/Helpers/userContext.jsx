/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuarioLogged, setUsuarioLogged] = useState(null);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("user"));
    setUsuarioLogged(usuario ? usuario : { id_rol: "5" });
  }, []);

  const updateUser = (user) => {
    setUsuarioLogged(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const reloadUser = () => {
    const usuario = JSON.parse(localStorage.getItem("user"));
    setUsuarioLogged(usuario ? usuario : { id_rol: "5" });
  };
  const clearUser = () => {
    localStorage.removeItem("user");
    setUsuarioLogged(null);
  };

  return (
    <UserContext.Provider value={{ usuarioLogged, updateUser, reloadUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};