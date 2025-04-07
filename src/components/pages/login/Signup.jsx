import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../FirebaseConfig";
import { login02, loginlogo } from "../../imagepath"; // Reutilizamos las imágenes del login
import Swal from 'sweetalert2'; // Importamos SweetAlert2

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      
      // Mostrar alerta de éxito
      Swal.fire({
        title: 'Registro exitoso!',
        text: 'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        // Redirige al usuario a la página de inicio de sesión
        navigate("/login");
      });
    } catch (err) {
      setError("Error al registrarse: " + err.message);
    }
  };

  const imageStyle = {
    width: '100%',
    height: 'auto',
  };

  return (
    <>
      {/* Main Wrapper */}
      <div className="main-wrapper login-body">
        <div className="container-fluid px-0">
          <div className="row">
            {/* Signup logo */}
            <div className="col-lg-6 login-wrap">
              <div className="login-sec">
                <div className="log-img">
                  <img
                    className="img-fluid"
                    src={login02}
                    alt="#"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6 login-wrap-bg">
              <div className="login-wrapper">
                <div className="loginbox">
                  <div className="login-right">
                    <div className="login-right-wrap">
                      <div className="account-logo size">
                        <img src={loginlogo} alt="#" style={imageStyle} />
                      </div>
                      <h2>Registrarse</h2>
                      {error && <p className="text-danger">{error}</p>}
                      <form onSubmit={handleSignup}>
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
                            className="form-control"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Confirmar Contraseña</label>
                          <input
                            className="form-control"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group login-btn">
                          <button type="submit" className="btn btn-primary btn-block">Registrarse</button>
                        </div>
                      </form>
                      <div className="next-sign">
                        <p className="account-subtitle">
                          ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
                        </p>
                      </div>
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

export default Signup;

