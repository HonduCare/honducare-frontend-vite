
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { login02, loginlogo, loginicon01, loginicon02, loginicon03 } from '../../imagepath';
import { auth } from '../../../FirebaseConfig';
import { sendPasswordResetEmail } from "firebase/auth";
import Swal from 'sweetalert2';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            Swal.fire({
                icon: 'success',
                title: 'Correo Enviado',
                text: 'Revisa tu bandeja de entrada para restablecer tu contraseña.',
            }).then(() => {
                // Navegar a la página de login después de cerrar la alerta
                navigate('/login');
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        }
    };

    const imageStyle = {
        width: '100%',
        height: 'auto',
    };

    return (
        <div>
            <div className="main-wrapper login-body">
                <div className="container-fluid px-0">
                    <div className="row">
                        {/* Login logo */}
                        <div className="col-lg-6 login-wrap">
                            <div className="login-sec">
                                <div className="log-img">
                                    <img className="img-fluid" src={login02} alt="Logo" />
                                </div>
                            </div>
                        </div>
                        {/* /Login logo */}
                        {/* Login Content */}
                        <div className="col-lg-6 login-wrap-bg">
                            <div className="login-wrapper">
                                <div className="loginbox">
                                    <div className="login-right">
                                        <div className="login-right-wrap">
                                            <div className="account-logo size">
                                                <img src={loginlogo} alt="#" style={imageStyle} />
                                            </div>
                                            <h2>Resetear contraseña</h2>
                                            {/* Form */}
                                            <form onSubmit={handleResetPassword}>
                                                <div className="form-group">
                                                    <label>Email <span className="login-danger">*</span></label>
                                                    <input
                                                        className="form-control"
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group login-btn">
                                                    <button className="btn btn-primary btn-block" type="submit">
                                                        Enviar Correo
                                                    </button>
                                                </div>
                                            </form>
                                            {/* /Form */}
                                            <div className="next-sign">
                                                <p className="account-subtitle">
                                                    ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
                                                </p>
                                                {/* Social Login */}
                                                <div className="social-login">
                                                    <Link to="#">
                                                        <img src={loginicon01} alt="#" />
                                                    </Link>
                                                    <Link to="#">
                                                        <img src={loginicon02} alt="#" />
                                                    </Link>
                                                    <Link to="#">
                                                        <img src={loginicon03} alt="#" />
                                                    </Link>
                                                </div>
                                                {/* /Social Login */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* /Login Content */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;


