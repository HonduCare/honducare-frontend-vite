/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { dashboard, doctor, doctorschedule, logout, menuicon04, menuicon06, menuicon08, menuicon09, menuicon10, menuicon11, menuicon12, menuicon14, menuicon15, menuicon16, patients, sidemenu } from './imagepath';
import Scrollbars from "react-custom-scrollbars-2";


const Sidebar = (props) => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState("");

  const [usuarioLogged, setUsuarioLogged] = useState({});

  const handleClick = (e, item, item1, item3) => {
    if (e == null || item == null || item1 == null) return;
    const div = document.querySelector(`#${item}`);
    const ulDiv = document.querySelector(`.${item1}`);
    e?.target?.className ? ulDiv.style.display = 'none' : ulDiv.style.display = 'block'
    e?.target?.className ? div.classList.remove('subdrop') : div.classList.add('subdrop');
  }


  useEffect(() => {
    if (props?.id && props?.id1) {
      const ele = document.getElementById(`${props?.id}`);
      handleClick(ele, props?.id, props?.id1);
    }
  }, [])


  const expandMenu = () => {
    document.body.classList.remove("expand-menu");
  };
  const expandMenuOpen = () => {
    document.body.classList.add("expand-menu");
  };

  async function getInfo() {
    const usuario = JSON.parse(localStorage.getItem('user'));
    setUsuarioLogged(usuario);
  }

  function logOut() {
    localStorage.removeItem('user');
    navigate('/login');
  }

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <>
      <div className="sidebar" id="sidebar">
        <Scrollbars
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
          autoHeight
          autoHeightMin={0}
          autoHeightMax="95vh"
          thumbMinSize={30}
          universal={false}
          hideTracksWhenNotNeeded={true}
        >
          <div className="sidebar-inner slimscroll">
            <div id="sidebar-menu" className="sidebar-menu"
              onMouseLeave={expandMenu}
              onMouseOver={expandMenuOpen}
            >
              <ul>
                <li className="menu-title">Menú</li>
                <li className="submenu" >
                  <Link to="/Bienvenida" id="menu-item"
                    onClick={(e) => { handleClick(e, "menu-item", "menu-items") }}
                  >
                    <span className="menu-side">
                      <img src={dashboard} alt="" />
                    </span>{" "}
                    <span> Bienvenida </span> <span className="menu-arrow" />
                  </Link>
                  <ul style={{ display: sidebar === 'Dashboard' ? 'block' : "none" }} className='menu-items'>
                  </ul>
                </li>

                {usuarioLogged.id_rol == 3 ? (
                  <li className="submenu">
                    <Link to="#" id="menu-item1" onClick={(e) => {
                      // setSidebar('Doctors')
                      handleClick(e, "menu-item1", "menu-items1")
                    }}>
                      <span className="menu-side">
                        <img src={doctor} alt="" />
                      </span>{" "}
                      <span> Administración </span> <span className="menu-arrow" />
                    </Link>
                    <ul style={{ display: sidebar === 'Administración' ? 'block' : 'none' }} className="menu-items1">
                      <li>
                        <Link className={props?.activeClassName === 'usuario-list' ? 'active' : ''} to="/Usuariolista">Gestion de Usuarios</Link>
                      </li>
                      <li>
                        <Link className={props?.activeClassName === 'Bitacora' ? 'active' : ''} to="/Bitacora">Bitacora</Link>
                      </li>
                      <li>
                        <Link className={props?.activeClassName === 'Permisos-roles' ? 'active' : ''} to="/permisos-roles">Permisos Roles</Link>
                      </li>
                    </ul>
                  </li>
                ) : null}

                {usuarioLogged.id_rol == 5 || usuarioLogged.id_rol == 3 || usuarioLogged.id_rol == 4 ? (
                  <li className="submenu">
                    <Link to="/PacienteLista" id="menu-item2"
                      onClick={(e) => handleClick(e, "menu-item2", "menu-items2")}>
                      <span className="menu-side">
                        <img src={patients} alt="" />
                      </span>{" "}
                      <span>Pacientes </span> <span className="menu-arrow" />
                    </Link>
                    <ul style={{ display: "none" }} className="menu-items2">

                    </ul>
                  </li>
                ) : null}

                {usuarioLogged.id_rol == 1 || usuarioLogged.id_rol == 2 || usuarioLogged.id_rol == 3 || usuarioLogged.id_rol == 4 ? (
                  <li className="submenu">
                    <Link to="#" id="menu-item4"
                      onClick={(e) => handleClick(e, "menu-item4", "menu-items4")}>
                      <span className="menu-side">
                        <img src={menuicon04} alt="" />
                      </span>{" "}
                      <span> Citas </span> <span className="menu-arrow" />
                    </Link>
                    <ul style={{ display: "none" }} className="menu-items4">
                      <li>
                        <Link className={props?.activeClassName === 'appoinment-list' ? 'active' : ''} to="/CitasLista">Lista de Citas</Link>
                      </li>
                      <li>
                        <Link className={props?.activeClassName === 'calendar' ? 'active' : ''} to="/Calendario">Calendario</Link>
                      </li>
                    </ul>
                  </li>
                ) : null}

                {usuarioLogged.id_rol == 1 || usuarioLogged.id_rol == 2 || usuarioLogged.id_rol == 3 || usuarioLogged.id_rol == 4 ? (
                  <li className="submenu">
                    <Link to="#" id="menu-item5"
                      onClick={(e) => handleClick(e, "menu-item5", "menu-items5")}>
                      <span className="menu-side">
                        <img src={doctorschedule} alt="" />
                      </span>{" "}
                      <span> Consulta </span> <span className="menu-arrow" />
                    </Link>
                    <ul className="menu-items5">
                      {usuarioLogged.id_rol == 1 || usuarioLogged.id_rol == 3 || usuarioLogged.id_rol == 4 ? (
                        <li>
                          <Link className={props?.activeClassName === 'shedule-list' ? 'active' : ''} to="/ConsultaLista">Consultas Próximas</Link>
                        </li>
                      ) : null}
                      <li>
                        <Link className={props?.activeClassName === 'preclinica-list' ? 'active' : ''} to="/PreclinicaLista">Preclínica</Link>
                      </li>
                      <li>
                        <Link className={props?.activeClassName === 'consulta-expediente' ? 'active' : ''} to="/consulta-expediente">Consultar Expediente Paciente</Link>
                      </li>
                      <li>
                        <Link className={props?.activeClassName === 'consulta-itinerario' ? 'active' : ''} to="/consulta-itinerario">Consultar Itinerario Doctor</Link>
                      </li>
                    </ul>
                  </li>
                ) : null}

                {usuarioLogged.id_rol == 3 ? (
                  <li className="submenu">
                    <Link to="#" id="menu-item6" onClick={(e) => handleClick(e, "menu-item6", "menu-items6")}>
                      <span className="menu-side">
                        <img src={menuicon06} alt="" />
                      </span>{" "}
                      <span> Mantenimiento </span> <span className="menu-arrow" />
                    </Link>
                    <ul style={{ display: "none" }} className="menu-items6">
                      <li>
                        <Link className={props?.activeClassName === 'lista-antecedentes' ? 'active' : ''} to="/lista-antecedentes">Antecedentes</Link>
                      </li>
                      {/* <li>
                      <Link className={props?.activeClassName === 'lista-cargos' ? 'active' : ''} to="/lista-cargos">Cargos</Link>
                    </li> */}
                      <li>
                        <Link className={props?.activeClassName === 'lista-estadocivil' ? 'active' : ''} to="/lista-estadocivil">Estado Civil</Link>
                      </li>
                      {/* <li>
                        <Link className={props?.activeClassName === 'lista-estados' ? 'active' : ''} to="/lista-estados">Estados Citas</Link>
                      </li> */}
                      <li>
                        <Link className={props?.activeClassName === 'lista-hg' ? 'active' : ''} to="/lista-hg">Historia Ginecobstetrica</Link>
                      </li>
                      <li>
                        <Link className={props?.activeClassName === 'lista-ht' ? 'active' : ''} to="/lista-ht">Hábitos Toxicos</Link>
                      </li>
                      <li>
                        <Link className={props?.activeClassName === 'lista-ocupaciones' ? 'active' : ''} to="/lista-ocupaciones">Ocupaciones</Link>
                      </li>
                      <li>
                        <Link className={props?.activeClassName === 'lista-patologias' ? 'active' : ''} to="/lista-patologias">Patologias</Link>
                      </li>
                      {/* <li>
                      <Link className={props?.activeClassName === 'lista-td' ? 'active' : ''} to="/lista-td">Tipo de documento</Link>
                    </li> */}
                      <li>
                        <Link className={props?.activeClassName === 'lista-sexo' ? 'active' : ''} to="/lista-sexo">Sexo</Link>
                        <Link className={props?.activeClassName === 'especialidades' ? 'active' : ''} to="/especialidades">Especialidades</Link>
                      </li>

                    </ul>
                  </li>
                ) : null}

                <li className="submenu">
                  <Link to="/Estadisticas" id="menu-item7" onClick={(e) => {
                    // setSidebar('Doctors')
                    handleClick(e, "menu-item7", "menu-items7")
                  }}>
                    <span className="menu-side">
                      <img src={dashboard} alt="" />
                    </span>{" "}
                    <span> Estadisticas </span> <span className="menu-arrow" />
                  </Link>
                  <ul style={{ display: sidebar === 'Dashboard' ? 'block' : 'none' }} className="menu-items7">


                  </ul>
                </li>


              </ul>
              <div className="logout-btn">
                <button type='button' onClick={logOut} className='btn'>
                  <span className="menu-side">
                    <img src={logout} alt="" />
                  </span>{" "}
                  <span>Cerrar sesion</span>
                </button>
              </div>
            </div>
          </div>
        </Scrollbars>
      </div>
    </>
  )
}
export default Sidebar
