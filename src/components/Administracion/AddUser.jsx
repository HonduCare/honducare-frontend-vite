import React, { useEffect, useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import Select from "react-select";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import createAuthHeaders from "../../helpers/createAuthHeaders";

const AddUser = () => {
  const navigate = useNavigate();
  const [rolSelected, setRolSelected] = useState({
    value: '1',
    label: 'Doctor'
  });
  const [especialidades, setEspecialidades] = useState([]);

  const [especialidadSelected, setEspecialidadSelected] = useState({
    value: especialidades.length > 0 ? especialidades[0].id_especialidad : '',
    label: especialidades.length > 0 ? especialidades[0].nombre : '',
  });

  const [showEspecialidad, setShowEspecialidad] = useState(true);
  const [roles, setRoles] = useState([]);

  const [nombre, setNombre] = useState('');
  const [identidad, setIdentidad] = useState('');
  const [direccion, setDireccion] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function onCancelGuardarUsuario() {
    navigate('/Usuariolista');
  }

  const createUser = async (e) => {
    e.preventDefault();

    if ([nombre, identidad, email, password, direccion].includes('')) {
      Swal.fire({
        icon: "error",
        title: "Información incompleta",
        text: "Revise y complete el nombre, documento, correo electrónico y dirección para continuar",
        timer: 4000,
        confirmButtonText: "Cerrar",
      });
      return;
    }

    const API_URL = import.meta.env.VITE_REACT_APP_API_URL; // Obtener la URL desde el .env
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/Crear/Usuario`;

    const body = {
      numero_identidad: identidad,
      direccion1: direccion,
      nombre_de_usuario: nombre,
      contrasena: password,
      id_rol: rolSelected.value,
      estado: "activo",
      correo_electronico: email,
      fecha_ultima_conexion: Date.now(),
      fecha_vencimiento: "2026-11-12",
      firebase_uid: "1",
      id_especialidad: rolSelected.label.toLowerCase() == 'doctor' ? especialidadSelected.value : null,
    };

    try {
      console.log("Datos enviados:", body);

      const config = await createAuthHeaders();

      const response = await axios.post(url, body, config);
      console.log("Usuario creado");
      console.log(response.data);

      Swal.fire({
        icon: "success",
        title: "¡Usuario creado con éxito!",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/Usuariolista");
      });
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Error al crear el usuario",
        text: "Ocurrió un problema al intentar crear el usuario. Intente nuevamente." + error.response.data.details,
      });
    }
  }

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

  useEffect(() => {
    // getRoles();
    getData();
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
                      <Link to="#">Usuario </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active">Agregar Usuario</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <form >
                      <div className="row">
                        <div className="col-12">
                          <div className="form-heading">
                            <h4>Nuevo Usuario</h4>
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
                              value={nombre}
                              onChange={(e) => setNombre(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Numero Documento <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              value={identidad}
                              onChange={(e) => setIdentidad(e.target.value)}
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
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
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
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6 form-group local-forms">
                            <label>Rol<span className="login-danger">*</span>
                            </label>
                            <Select
                              defaultValue={rolSelected}
                              onChange={setRolSelected}
                              value={rolSelected}
                              options={roles}
                              id="search-rol"
                              onInputChange={() => rolSelected.label.toLowerCase() == 'doctor' ? setShowEspecialidad(true) : setShowEspecialidad(false)}
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
                          {showEspecialidad ? (
                            <div className="col-md-6 form-group local-forms">
                              <label>Especialidad<span className="login-danger">*</span>
                              </label>
                              <Select
                                defaultValue={especialidadSelected}
                                onChange={setEspecialidadSelected}
                                value={especialidadSelected}
                                options={especialidades}
                                id="search-especialidad"
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
                          ) : null}
                        </div>
                        <div className="col-12 col-sm-12">
                          <div className="form-group local-forms">
                            <label>
                              Direccion <span className="login-danger">*</span>
                            </label>
                            <textarea
                              className="form-control"
                              type="text"
                              value={direccion}
                              onChange={(e) => setDireccion(e.target.value)}
                            />
                          </div>
                        </div>
                        {/* <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Estado<span className="login-danger">*</span>
                            </label>
                            <Select
                              defaultValue={selectedOption}
                              onChange={setSelectedOption}
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
                        </div> */}
                        <div className="col-12">
                          <div className="text-center">
                            <button
                              className="btn btn-primary"
                              type="submit"
                              onClick={e => createUser(e)}

                            >
                              Guardar
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary submit-form me-2"
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
        </div>
      </>
    </div>
  );
};

export default AddUser;

