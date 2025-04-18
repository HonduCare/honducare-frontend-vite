/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../Helpers/userContext.jsx";
import Header from "../Header";
import Sidebar from "../Sidebar";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

import createAuthHeaders from "../../helpers/createAuthHeaders.js";

const ExamenFisico = () => {
  const { usuarioLogged } = useContext(UserContext);
  const navigate = useNavigate();
  const params = useParams();

  const [nombre, setNombre] = useState("");
  const [identidad, setIdentidad] = useState("");
  const [edad, setEdad] = useState("");
  const [presion, setPresion] = useState("");
  const [frecuenciaCardiaca, setFrecuenciaCardiaca] = useState("");
  const [frecuenciaRespiratoria, setFrecuenciaRespiratoria] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [peso, setPeso] = useState("");
  const [talla, setTalla] = useState("");
  const [glucometria, setGlucometria] = useState("");
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  async function handleSave() {
    if (
      [
        presion,
        frecuenciaCardiaca,
        frecuenciaRespiratoria,
        temperatura,
        peso,
        talla,
      ].some((p) => p <= 0)
    ) {
      Swal.fire({
        icon: "warning",
        text: "Debe de especificar valores mayores a 0",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    console.log({
      nombre,
      identidad,
      edad,
      presion,
      frecuenciaCardiaca,
      frecuenciaRespiratoria,
      temperatura,
      peso,
      talla,
      glucometria,
    });

    try {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/crear/preclinica`;

      const config = await createAuthHeaders();

      const body = {
        id_cita: params.id_cita,
        id_paciente: params.id_paciente,
        presion_arterial: presion,
        frecuencia_cardiaca: frecuenciaCardiaca,
        frecuencia_respiratoria: frecuenciaRespiratoria,
        temperatura,
        peso_actual: peso,
        talla,
        glucometria,
      };
      console.log("Datos de preclinica: ", body)
       const { data } = await axios.post(url, body, config);
      console.log(data);
      Swal.fire({
        icon: "success",
        title: "¡Registro agregado con éxito!",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/PreclinicaLista");
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getPaciente() {
    console.log("Id del paciente;", params.id_paciente)
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/obtener/expediente/${params.id_paciente}`;
    try {
      const { data } = await axios(url);
      setNombre(data.paciente.nombre_completo);
      setIdentidad(data.paciente.numero_identidad);
      setEdad(data.paciente.edad ? data.paciente.edad : "No definida");
    } catch (error) {
      console.log(error);
    }
  }

  function onCancel() {
    navigate("/PreclinicaLista");
  }

  useEffect(() => {
    getPaciente();
  }, []);

  return (
    <div>
      <Header />
      <Sidebar
        id="menu-item6"
        id1="menu-items6"
        activeClassName="examenfisico-list"
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
                      <Link to="#">Consulta</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active">Preclinica</li>
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
                            <h4>Paso a preclínica</h4>
                          </div>
                        </div>

                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Paciente:<span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              value={nombre}
                              readOnly
                              disabled
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-6 col-xl-2">
                          <div className="form-group local-forms">
                            <label>
                              DNI:<span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              value={identidad}
                              readOnly
                              disabled
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Edad:<span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder=""
                              value={edad}
                              readOnly
                              disabled
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Presión Arterial
                              <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="number"
                              placeholder="Presion arterial"
                              value={presion}
                              onChange={(e) =>
                                setPresion(Number(e.target.value))
                              }
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Frecuencia cardiaca{" "}
                              <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="number"
                              placeholder="Frecuencia cardiaca"
                              value={frecuenciaCardiaca}
                              onChange={(e) =>
                                setFrecuenciaCardiaca(Number(e.target.value))
                              }
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Frecuencia Respiratoria{" "}
                              <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="number"
                              min={0}
                              max={100}
                              placeholder="Frecuencia respiratoria"
                              value={frecuenciaRespiratoria}
                              onChange={(e) =>
                                setFrecuenciaRespiratoria(
                                  Number(e.target.value)
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Temperatura
                              <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="number"
                              min={0}
                              max={100}
                              placeholder=""
                              value={temperatura}
                              onChange={(e) =>
                                setTemperatura(Number(e.target.value))
                              }
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-2">
                          <div className="form-group local-forms">
                            <label className="gen-label">
                              Peso actual<span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="number"
                              min={0}
                              max={100}
                              value={peso}
                              onChange={(e) => setPeso(Number(e.target.value))}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-2">
                          <div className="form-group local-forms">
                            <label>
                              Talla <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="number"
                              min={0}
                              max={100}
                              value={talla}
                              onChange={(e) => setTalla(Number(e.target.value))}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-2">
                          <div className="form-group local-forms">
                            <label>
                              Glucometria{" "}
                              <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              type="number"
                              min={0}
                              max={100}
                              value={glucometria}
                              onChange={(e) =>
                                setGlucometria(Number(e.target.value))
                              }
                            />
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="doctor-submit text-end">
                            {usuarioLogged?.rol?.permisos.some(
                              (permiso) =>
                                permiso.nombre === "registrar" ||
                                permiso.nombre === "actualizar"
                            ) && (
                              <button
                                type="button"
                                className="btn btn-primary submit-form me-2"
                                onClick={handleSave}
                              >
                                Guardar
                              </button>
                            )}
                            <button
                              type="button"
                              className="btn btn-primary cancel-form"
                              onClick={onCancel}
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

export default ExamenFisico;
