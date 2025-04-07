import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login02, loginlogo, loginicon01, loginicon02, loginicon03 } from '../../imagepath';
import { auth } from '../../../FirebaseConfig';
import { confirmPasswordReset } from "firebase/auth";
import Swal from 'sweetalert2';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const oobCode = query.get('oobCode');

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden. Por favor, verifica e intenta de nuevo.',
            });
            return;
        }

        try {
            await confirmPasswordReset(auth, oobCode, newPassword);
            Swal.fire({
                icon: 'success',
                title: 'Contraseña cambiada con éxito',
                text: 'Tu contraseña ha sido actualizada.',
            }).then(() => {
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
                        <div className="col-lg-6 login-wrap">
                            <div className="login-sec">
                                <div className="log-img">
                                    <img className="img-fluid" src={login02} alt="Logo" />
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
                                            <h2>Cambiar Contraseña</h2>
                                            <form onSubmit={handleResetPassword}>
                                                <div className="form-group">
                                                    <label>Nueva Contraseña <span className="login-danger">*</span></label>
                                                    <input
                                                        className="form-control"
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Confirmar Contraseña <span className="login-danger">*</span></label>
                                                    <input
                                                        className="form-control"
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group login-btn">
                                                    <button className="btn btn-primary btn-block" type="submit">
                                                        Guardar Contraseña
                                                    </button>
                                                </div>
                                            </form>
                                            <div className="next-sign">
                                                <p className="account-subtitle">
                                                    ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
                                                </p>
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;