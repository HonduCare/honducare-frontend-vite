import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login02, loginlogo } from '../../imagepath';
import { auth } from '../../../FirebaseConfig';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import Swal from 'sweetalert2';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {}; // Obtener el email del estado

    useEffect(() => {
        if (!email) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se proporcionó un correo electrónico.',
            }).then(() => {
                navigate('/login');
            });
        }
    }, [email, navigate]);

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden. Por favor, verifica e intenta de nuevo.',
            });
            return;
        }

        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(email, currentPassword); // Usa el email proporcionado

        try {
            // Reautenticación del usuario
            await reauthenticateWithCredential(user, credential);
            // Actualiza la contraseña
            await updatePassword(user, newPassword);
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
                                            <form onSubmit={handleChangePassword}>
                                                <div className="form-group">
                                                    <label>Contraseña Actual <span className="login-danger">*</span></label>
                                                    <input
                                                        className="form-control"
                                                        type="password"
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>
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
                                                    <button type="submit" className="btn btn-primary btn-block">Cambiar Contraseña</button>
                                                </div>
                                            </form>
                                            <div className="next-sign">
                                                <p className="account-subtitle">
                                                    <Link to="/login">Regresar a inicio de sesión</Link>
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
        </div>
    );
};

export default ChangePassword;
