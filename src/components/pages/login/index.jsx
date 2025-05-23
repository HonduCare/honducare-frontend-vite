/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeOff, Eye } from "react-feather";
import { login02, loginlogo } from "../../imagepath";
import { auth } from "../../../FirebaseConfig.js";
import { signInWithEmailAndPassword,getIdToken, signOut, onAuthStateChanged  } from "firebase/auth";
import axios from "axios";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await getIdToken(user);
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/Verificar`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(response.data.data.estado !== "activo" ){
        localStorage.removeItem("user");
        await signOut(auth);
        Swal.fire({
          title: "Error!",
          text: "Usuario inactivo. Por favor, contacte al administrador.",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
      if (response.data.autenticated == true ) {
        localStorage.setItem("user", JSON.stringify(response.data.data));
        localStorage.setItem("firstLogin", true);
        navigate("/Bienvenido");
      } else {
        Swal.fire({
          title: "Error!",
          text: "Correo o contraseña incorrectos. Por favor, intente nuevamente.",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      if (error.response) {   
        Swal.fire({
          title: "Error!",
          text:
            error.response.data.message ||
            "Error al verificar los datos. Por favor, intente nuevamente.",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
      } else if (error.code === "auth/invalid-credential" ) {
        const result = await axios.post(`${API_URL}/Verificar/inicio-fallido`,{email});
        if (result.data.activo === true) {
          Swal.fire({
            title: "Contraseña Incorrecta",
            text: `Te quedan ${result.data.intentos} intentos, luego de eso se bloqueará tu cuenta.`,
            icon: "error",
            timer: 3000,
            showConfirmButton: false,
          });
        }else {
          Swal.fire({
            title: "Error!",
            text: `${result.data.message}`,
            icon: "error",
            timer: 3000,
            showConfirmButton: false,
          });
        }
      } else {
        Swal.fire({
          title: "Error!",
          text: `Ha ocurrido un error inesperado. Por favor, intente nuevamente.`,
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    }
  };

  const imageStyle = {
    width: "100%",
    height: "auto",
  };

  const verificarSesion = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_API_URL}/Verificar`,
          { email: user.email },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.data.data.estado !== "activo") {
          console.log("Usuario autenticado en Firebase pero inactivo en BD");
          await signOut(auth);
          localStorage.removeItem("user");
          navigate("/");
        } else {
          console.log("Usuario activo");
          navigate("/Bienvenido")
        }
      } else {
        console.log("Usuario no autenticado");
      }
    });
  };
  
 
useEffect(() => {
  verificarSesion();
}, [])


  return (
    <>
      <div className="main-wrapper login-body">
        <div className="container-fluid px-0">
          <div className="row">
            <div className="col-lg-6 login-wrap">
              <div className="login-sec">
                <div className="log-img">
                  <img className="img-fluid" src={login02} alt="#" />
                </div>
              </div>
            </div>
            <div className="col-lg-6 login-wrap-bg">
              <div className="login-wrapper">
                <div className="loginbox">
                  <div className="login-right">
                    <div className="login-right-wrap h-75">
                      <div className="account-logo size">
                        <img src={loginlogo} alt="#" style={imageStyle} />
                      </div>
                      <h2>Iniciar sesión</h2>
                      <form onSubmit={handleLogin}>
                        <div className="form-group">
                          <label>Correo</label>
                          <input
                            className="form-control"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Contraseña</label>
                          <input
                            type={passwordVisible ? "text" : "password"}
                            className="form-control pass-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <span
                            className="toggle-password"
                            onClick={togglePasswordVisibility}
                          >
                            {passwordVisible ? (
                              <EyeOff className="react-feather-custom" />
                            ) : (
                              <Eye className="react-feather-custom" />
                            )}
                          </span>
                        </div>
                        <div className="forgotpass">
                          <div className="remember-me">
                            <label className="custom_check mr-2 mb-0 d-inline-flex remember-me">
                              Recuérdame
                              <input type="checkbox" />
                              <span className="checkmark" />
                            </label>
                          </div>
                          <Link to="/forgotpassword">
                            Olvidó su contraseña?
                          </Link>
                        </div>
                        <div className="form-group login-btn">
                          <button
                            type="submit"
                            className="btn btn-primary btn-block"
                          >
                            Iniciar sesión
                          </button>
                        </div>
                      </form>
                      {/*<div className="next-sign">
                        <p className="account-subtitle">
                          ¿Necesita una cuenta? <Link to="/signup">Registrarse</Link>
                        </p>
                        <p className="account-subtitle">
                          <button
                            onClick={handleChangePassword}
                            className="btn btn-link"
                            style={{ textDecoration: 'none', color: '#41c1ef' }} // Cambios aquí
                          >
                            Cambiar Contraseña
                          </button>
                        </p>
                      </div>*/}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
