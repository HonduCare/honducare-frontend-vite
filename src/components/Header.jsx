/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  logo,
  baricon,
  baricon1,
  searchnormal,
  imguser,
  user06,
  settingicon01,
  noteicon1, // Asegúrate de incluir esta línea para importar noteicon1
} from "./imagepath";

import axios from 'axios';
import { formatearFecha, formatearHora } from "../helpers";

const Header = () => {
  const [usuarioLogged, setUsuarioLogged] = useState({ id_rol: 1 });
  const [rol, setRol] = useState({});
  const [citas, setCitas] = useState([]);

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  async function getInfo() {
    const usuario = JSON.parse(localStorage.getItem('user'));
    setUsuarioLogged(usuario);
  }

  const handlesidebar = () => {
    document.body.classList.toggle("mini-sidebar");
  };

  const handlesidebarmobilemenu = () => {
    document.body.classList.toggle("slide-nav");
    document.getElementsByTagName("html")[0].classList.toggle('menu-opened');
    document.getElementsByClassName("sidebar-overlay")[0].classList.toggle("opened");
  };

  const openDrawer = () => {
    const div = document.querySelector(".main-wrapper");
    if (div?.className?.includes("open-msg-box")) {
      div?.classList?.remove("open-msg-box");
    } else {
      div?.classList?.add("open-msg-box");
    }
  };

  async function getRoles() {
    const usuario = JSON.parse(localStorage.getItem('user'));
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/obtener/roles/${Number(usuario.id_rol)}`;

    try {
      const { data } = await axios.get(url);
      // console.log(data);
      setRol(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getItinerario() {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/itinerario?id_doctor=${usuarioLogged.id_usuario}`;

    try {
      const { data } = await axios(url);
      setCitas(data.citas);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const handleClick = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    };

    const maximizeBtn = document.querySelector(".win-maximize");
    // maximizeBtn.addEventListener('click', handleClick);

    return () => {
      // maximizeBtn.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    getInfo();
    setTimeout(() => {
      getRoles();
    }, 3000);
  }, []);

  return (
    <div className="main-wrapper">
      <div className="header">
        <div className="header-left">
          <Link to="/Bienvenida" className="logo">
            <img src={logo} width={85} height={75} alt="" />{" "}
            <span>Honducare</span>
          </Link>
        </div>
        <Link id="toggle_btn" to="#" onClick={handlesidebar}>
          <img src={baricon} alt="" />
        </Link>
        <Link id="mobile_btn" className="mobile_btn float-start" to="#" onClick={handlesidebarmobilemenu}>
          <img src={baricon1} alt="" />
        </Link>
        <div className="top-nav-search mob-view">
          <form>
            <input
              type="text"
              className="form-control"
              placeholder="Search here"
            />
            <Link className="btn">
              <img src={searchnormal} alt="" />
            </Link>
          </form>
        </div>
        <ul className="nav user-menu float-end">
          {/* <li className="nav-item dropdown d-none d-sm-block">
           <Link
              onClick={openDrawer}
              id="open_msg_box"
              className="hasnotifications nav-link"
            >
              <img src={noteicon1} alt="" /> 
              <span className="pulse" />{" "}
            </Link>
          </li>     */}
          <li className="nav-item dropdown has-arrow user-profile-list">
            <Link
              to="#"
              className="dropdown-toggle nav-link user-link"
              data-bs-toggle="dropdown"
            >
              <div className="user-names">
                <h5>{usuarioLogged?.nombre_de_usuario ?? ''}</h5>
                <span>{rol?.rol ?? 'Doctor'}</span>
              </div>
              <span className="user-img">
                <img src={user06} alt="Admin" />
              </span>
            </Link>
            <div className="dropdown-menu">
              {usuarioLogged.id_rol == 1 ? (
                <button onClick={getItinerario} className="dropdown-item" data-bs-toggle="modal" data-bs-target="#itinerario-modal">
                  Ver mi itinerario
                </button>
              ) : null}
              <Link className="dropdown-item" to="/perfil">
                Ver Perfil
              </Link>
              <Link className="dropdown-item" to="/login">
                Cerrar Sesión
              </Link>
            </div>
          </li>
        </ul>
        <div className="dropdown mobile-user-menu float-end">
          <Link
            to="#"
            className="dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa-solid fa-ellipsis-vertical" />
          </Link>
          <div className="dropdown-menu dropdown-menu-end">
            <Link className="dropdown-item" to="/login">
              Cerrar Sesion
            </Link>
          </div>
        </div>
      </div>
      <div className="modal" tabIndex="-1" id="itinerario-modal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Citas del dia: <span className="fw-normal">{formatearFecha(new Date(new Date().setHours(new Date().getHours() - 6)))}</span> </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {citas.length === 0 ? (
                <p className="text-center fw-bold">No tiene citas agendadas para el día de hoy.</p>
              ) : (
                citas.map((cita, i) => (
                  <div className="border p-2 shadow-sm" key={i}>
                    <p className="fw-bold mb-2">{i + 1}.</p>
                    <p className="fw-bold mb-2">Paciente: {' '} <span className="fw-normal">{cita.paciente.nombre_completo}</span></p>
                    <p className="fw-bold mb-2">Fecha: {' '} <span className="fw-normal">{formatearFecha(cita.fecha)}</span></p>
                    <p className="fw-bold mb-2">Hora: {' '} <span className="fw-normal">{formatearHora(cita.hora)}</span></p>
                    <p className="fw-bold mb-2">Estado: {' '} <span className="fw-normal">{cita.estado.descripcion.toUpperCase()}</span></p>
                    <p className="fw-bold mb-2">Motivo de la cita: {' '} <span className="fw-normal">{cita.motivo_cita}</span></p>
                  </div>
                ))
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
