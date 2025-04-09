/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { DatePicker } from "antd";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import Select from "react-select";
import { Link, useParams, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

import axios from 'axios';
import createAuthHeaders from "../../helpers/createAuthHeaders";

const EditUsuario = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [nombre, setNombre] = useState('');
  const [identidad, setIdentidad] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const [especialidades, setEspecialidades] = useState([]);
  const [showEspecialidad, setShowEspecialidad] = useState(false);
  const [especialidadSelected, setEspecialidadSelected] = useState({
    value: especialidades.length > 0 ? especialidades[0].id_especialidad : '',
    label: especialidades.length > 0 ? especialidades[0].nombre : '',
  });

  const [rolSelected, setRolSelected] = useState({
    value: roles.length ? roles[0].id_rol : '',
    label: roles.length ? roles[0].rol : '',
  });
  const [direccion, setDireccion] = useState('');
  const [estadoSelected, setEstadoSelected] = useState({ value: 'activo', label: 'Activo' });

  const es_ci = [
    { value: 'activo', label: "ACTIVO" },
    { value: 'inactivo', label: "INACTIVO" },
  ];

  async function getData() {
    
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

    const [rolesResponse, especialidadesResponse] = await Promise.all([
      axios(`${import.meta.env.VITE_REACT_APP_API_URL}/obtener/roles/rol/roles`),
      axios(`${import.meta.env.VITE_REACT_APP_API_URL}/especialidad`),
    ]);

    const rolesTransformed = rolesResponse.data.map((rol) => ({
      value: rol.id_rol.toString(),
      label: rol.rol,
    }));
    setRoles(rolesTransformed);

    const especialidadesTransformed = especialidadesResponse.data.especialidades.map((esp) => ({
      value: esp.id_especialidad.toString(),
      label: esp.nombre,
    }));
    setEspecialidades(especialidadesTransformed);
  }

  async function getUserInfo() {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/obtener/${params.id}`;
    try {
      const { data } = await axios.get(url);


      if (data.rol.rol.toLowerCase() == 'doctor') {
        setShowEspecialidad(true);
      }

      // LLenar los campos del formulario con el usuario encontrado.
      setNombre(data.nombre_de_usuario);
      setIdentidad(data.numero_identidad);
      setRolSelected({
        value: data.rol.id_rol.toString(),
        label: data.rol.rol,
      });
      setEstadoSelected({
        value: data.estado,
        label: data.estado.toUpperCase(),
      });
      setEspecialidadSelected({
        value: data.especialidad != null ? data.especialidad.id_especialidad : '',
        label: data.especialidad != null ? data.especialidad.nombre : '',
      });

      setCorreo(data.correo_electronico);
      setDireccion(data.direccion1);
    } catch (error) {
      console.log(error);
    }
  }

  function onCancelGuardarUsuario() {
    navigate('/Usuariolista');
  }

  async function updateUsuario(e) {
    e.preventDefault();
    if ([nombre, identidad, correo, direccion].includes('')) {
      return;
    }

    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/actualizar-usuario/${params.id}`;

    const body = {
      nombre,
      identidad,
      correo,
      rol_id: rolSelected.value,
      direccion: direccion,
      estado: estadoSelected.value,
      id_especialidad: especialidadSelected.value,
    }
    const config = await createAuthHeaders();

    try {
      const { status } = await axios.put(url, body, config);

      if (status == 200) {
        Swal.fire({
          icon: "success",
          title: "¡Usuario actualizado con éxito!",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          navigate("/Usuariolista");
        });
      }

    } catch (error) {
      console.log(error);
    }

  }

  useEffect(() => {
    getData();
    getUserInfo();
  }, []);

  return (
    <div>
      <Header />
      <Sidebar
        id="menu-item1"
        id1="menu-items1"
        activeClassName="add-patient"
      />
      <>
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="#">Usuario</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active">Editar Usuario</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <form>
                      <div className="row">
                        <div className="col-12">
                          <div className="form-heading">
                            <h4>Editar Datos Usuario</h4>
                          </div>
                        </div>
                        <div className="col-12 col-sm-12">
                          <div className="form-group local-forms">
                            <label>
                              Nombre Completo<span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder=""
                              value={nombre}
                              onChange={e => setNombre(e.target.value ?? '')}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Numero Identidad <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder=""
                              autoComplete="new-password"
                              value={identidad}
                              onChange={e => setIdentidad(e.target.value ?? '')}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Correo Electronico <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder=""
                              value={correo}
                              onChange={e => setCorreo(e.target.value ?? '')}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Contraseña <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder=""
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Cambio de contraseña <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder=""
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Rol
                              <span className="login-danger">*</span>
                            </label>
                            <Select
                              defaultValue={rolSelected}
                              onChange={setRolSelected}
                              value={rolSelected}
                              options={roles}
                              id="search-commodity"
                              components={{
                                IndicatorSeparator: () => null
                              }}
                              styles={{
                                control: (baseStyles, state) => ({
                                  ...baseStyles,
                                  borderColor: state.isFocused ? 'none' : '2px solid rgba(46, 55, 164, 0.1);',
                                  boxShadow: state.isFocused ? '0 0 0 1px #41c1ef' : 'none',
                                  '&:hover': {
                                    borderColor: state.isFocused ? 'none' : '2px solid rgba(46, 55, 164, 0.1)',
                                  },
                                  borderRadius: '10px',
                                  fontSize: "14px",
                                  minHeight: "45px",
                                }),
                                dropdownIndicator: (base, state) => ({
                                  ...base,
                                  transform: state.selectProps.menuIsOpen ? 'rotate(-180deg)' : 'rotate(0)',
                                  transition: '250ms',
                                  width: '35px',
                                  height: '35px',
                                }),
                              }}
                            />
                          </div>
                        </div>
                        {showEspecialidad ? (
                          <div className="col-12 col-md-6 col-xl-4">
                            <div className="form-group local-forms">
                              <label>
                                Especialidad
                                <span className="login-danger">*</span>
                              </label>
                              <Select
                                defaultValue={especialidadSelected}
                                onChange={setEspecialidadSelected}
                                value={especialidadSelected}
                                options={especialidades}
                                id="search-commodity"
                                components={{
                                  IndicatorSeparator: () => null
                                }}
                                styles={{
                                  control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: state.isFocused ? 'none' : '2px solid rgba(46, 55, 164, 0.1);',
                                    boxShadow: state.isFocused ? '0 0 0 1px #41c1ef' : 'none',
                                    '&:hover': {
                                      borderColor: state.isFocused ? 'none' : '2px solid rgba(46, 55, 164, 0.1)',
                                    },
                                    borderRadius: '10px',
                                    fontSize: "14px",
                                    minHeight: "45px",
                                  }),
                                  dropdownIndicator: (base, state) => ({
                                    ...base,
                                    transform: state.selectProps.menuIsOpen ? 'rotate(-180deg)' : 'rotate(0)',
                                    transition: '250ms',
                                    width: '35px',
                                    height: '35px',
                                  }),
                                }}
                              />
                            </div>
                          </div>
                        ) : null}
                        <div className="col-12 col-sm-12">
                          <div className="form-group local-forms">
                            <label>
                              Direccion <span className="login-danger">*</span>
                            </label>
                            <textarea
                              className="form-control"
                              rows={3}
                              cols={30}
                              value={direccion}
                              onChange={e => setDireccion(e.target.value ?? '')}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Estado<span className="login-danger">*</span>
                            </label>
                            <Select
                              defaultValue={estadoSelected}
                              onChange={setEstadoSelected}
                              value={estadoSelected}
                              options={es_ci}
                              id="search-commodity"
                              components={{
                                IndicatorSeparator: () => null
                              }}
                              styles={{
                                control: (baseStyles, state) => ({
                                  ...baseStyles,
                                  borderColor: state.isFocused ? 'none' : '2px solid rgba(46, 55, 164, 0.1);',
                                  boxShadow: state.isFocused ? '0 0 0 1px #41c1ef' : 'none',
                                  '&:hover': {
                                    borderColor: state.isFocused ? 'none' : '2px solid rgba(46, 55, 164, 0.1)',
                                  },
                                  borderRadius: '10px',
                                  fontSize: "14px",
                                  minHeight: "45px",
                                }),
                                dropdownIndicator: (base, state) => ({
                                  ...base,
                                  transform: state.selectProps.menuIsOpen ? 'rotate(-180deg)' : 'rotate(0)',
                                  transition: '250ms',
                                  width: '35px',
                                  height: '35px',
                                }),
                              }}
                            />

                          </div>
                        </div>

                        <div className="col-12">
                          <div className="usuariolist-submit text-end">
                            <button
                              type="submit"
                              className="btn btn-primary submit-form me-2"
                              onClick={updateUsuario}
                            >
                              Guardar
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary cancel-form"
                              onClick={onCancelGuardarUsuario}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="notification-box">
            <div className="msg-sidebar notifications msg-noti">
              <div className="topnav-dropdown-header">
                <span>Messages</span>
              </div>
              <div className="drop-scroll msg-list-scroll" id="msg_list">
                <ul className="list-box">
                  <li>
                    <Link to="#">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">R</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Richard Miles </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <div className="list-item new-message">
                        <div className="list-left">
                          <span className="avatar">J</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">John Doe</span>
                          <span className="message-time">1 Aug</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">T</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">
                            {" "}
                            Tarah Shropshire{" "}
                          </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">M</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Mike Litorus</span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">C</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">
                            {" "}
                            Catherine Manseau{" "}
                          </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">D</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">
                            {" "}
                            Domenic Houston{" "}
                          </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">B</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">
                            {" "}
                            Buster Wigton{" "}
                          </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">R</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">
                            {" "}
                            Rolland Webber{" "}
                          </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">C</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author"> Claire Mapes </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">M</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Melita Faucher</span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">J</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Jeffery Lalor</span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">L</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Loren Gatlin</span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">T</span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">
                            Tarah Shropshire
                          </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="topnav-dropdown-footer">
                <Link to="#">See all messages</Link>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default EditUsuario;
