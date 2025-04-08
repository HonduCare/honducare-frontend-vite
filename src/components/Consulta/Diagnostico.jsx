/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { UserContext } from "../Helpers/userContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { formatearFecha, formatearHora } from "../../helpers";

const Diagnostico = () => {
  const { usuarioLogged } = useContext(UserContext);
  const navigate = useNavigate();
  const params = useParams();
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL; // Obtiene la URL base desde el .env
  const [isLoading, setIsLoading] = useState(true);

  const [paciente, setPaciente] = useState({
    id_paciente: 1,
    nombre_completo: "",
    numero_identidad: "",
  });

  const [cita, setCita] = useState({
    fecha: "",
    hora: "",
  });

  const [signosVitales, setSignosVitales] = useState({});

  const [historiaEnfermedad, setHistoriaEnfermedad] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [receta, setReceta] = useState("");
  const [examenFisico, setExamenFisico] = useState("");
  const [indicaciones, setIndicaciones] = useState("");

  async function handleSave() {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/diagnosticos`;

    if ([historiaEnfermedad, diagnostico, receta].includes("")) {
      Swal.fire({
        icon: "error",
        title: "Campos obligatorios",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    const body = {
      id_cita: params.id_cita,
      id_paciente: params.id_paciente,
      historia_enfermedad: historiaEnfermedad,
      receta,
      diagnostico,
      id_doctor: cita.id_usuario,
      examen_fisico: examenFisico,
      indicaciones,
    };

    try {
      await axios.post(url, body);

      Swal.fire({
        icon: "success",
        title: "¡Registro agregado con éxito!",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/ConsultaLista");
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error al crear el diagnostico",
        text: error.response.data.mensaje,
      });
    }
  }

  async function getInfo() {
    const urlPaciente = `${import.meta.env.VITE_REACT_APP_API_URL}/pacientes/${
      params.id_paciente
    }`;
    const urlPreclinica = `${
      import.meta.env.VITE_REACT_APP_API_URL
    }/preclinica?id_paciente=${params.id_paciente}&id_cita=${params.id_cita}`;
    const urlCita = `${import.meta.env.VITE_REACT_APP_API_URL}/obtener/cita/${
      params.id_cita
    }`;

    const [pacienteResponse, preclinicaResponse, citaResponse] =
      await Promise.all([
        axios(urlPaciente),
        axios(urlPreclinica),
        axios(urlCita),
      ]);

    setPaciente(pacienteResponse.data);
    setCita(citaResponse.data);

    setIsLoading(false);

    if (preclinicaResponse.data.length > 0) {
      setSignosVitales(preclinicaResponse.data[0]);
    }
  }

  useEffect(() => {
    getInfo();
  }, []);

  return isLoading ? (
    <div class="d-flex justify-content-center">
      <div class="spinner-border text-primary" role="status"></div>{" "}
    </div>
  ) : (
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
                    <li className="breadcrumb-item active">Diagnostico</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <form>
                      <div className="row">
                        <div className="col-12">
                          <div className="form-heading">
                            <h4>Diagnostico del paciente</h4>
                          </div>
                        </div>

                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Paciente:<span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              value={paciente.nombre_completo}
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
                              value={paciente.numero_identidad}
                              disabled
                              readOnly
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
                              value={
                                paciente.edad ? paciente.edad : "No asignada"
                              }
                              disabled
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="form-heading">
                            <h4>Detalles de la Consulta</h4>
                          </div>
                        </div>

                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Fecha Atención:
                              <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              value={formatearFecha(
                                cita.fecha.includes("T")
                                  ? cita.fecha.split("T")[0]
                                  : cita.fecha
                              )}
                              disabled
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Hora Atención:
                              <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              value={formatearHora(cita.hora)}
                              disabled
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="form-heading">
                            <h4>Signos Vitales</h4>
                          </div>
                        </div>

                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Temperatura:
                              <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              value={signosVitales.temperatura ?? 0}
                              disabled
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Presión Arterial (PA):
                              <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              value={signosVitales.presion_arterial ?? 0}
                              disabled
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Frecuencia Cardiaca (FC):
                              <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              value={signosVitales.frecuencia_cardiaca ?? 0}
                              disabled
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>Glucometría</label>
                            <input
                              className="form-control"
                              value={signosVitales.glucometria ?? 0}
                              disabled
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Frecuencia Cardiaca (FC):
                              <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              value={signosVitales.frecuencia_cardiaca ?? 0}
                              disabled
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Frecuencia Respiratoria (FR):
                              <span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              value={signosVitales.frecuencia_respiratoria ?? 0}
                              disabled
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="form-heading">
                            <h4>Datos Antropométricos</h4>
                          </div>
                        </div>

                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Peso:<span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              value={signosVitales.peso_actual ?? 0}
                              disabled
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Talla:<span className="login-danger">*</span>
                            </label>
                            <input
                              className="form-control"
                              value={signosVitales.talla ?? 0}
                              disabled
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-12">
                          <div className="form-group local-forms">
                            <label>
                              Historia de la enfermedad actual:{" "}
                              <span className="login-danger">*</span>
                            </label>
                            <textarea
                              className="form-control"
                              rows={3}
                              cols={30}
                              maxLength={255}
                              value={historiaEnfermedad}
                              onChange={(e) =>
                                setHistoriaEnfermedad(e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-12">
                          <div className="form-group local-forms">
                            <label>
                              Diagnóstico:
                              <span className="login-danger">*</span>
                            </label>
                            <textarea
                              className="form-control"
                              rows={3}
                              cols={30}
                              maxLength={255}
                              value={diagnostico}
                              onChange={(e) => setDiagnostico(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-12">
                          <div className="form-group local-forms">
                            <label>
                              Receta:<span className="login-danger">*</span>
                            </label>
                            <textarea
                              className="form-control"
                              rows={3}
                              cols={30}
                              maxLength={255}
                              value={receta}
                              onChange={(e) => setReceta(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-sm-12">
                          <div className="form-group local-forms">
                            <label>
                              Indicaciones
                              <span className="login-danger">*</span>
                            </label>
                            <textarea
                              className="form-control"
                              rows={3}
                              cols={30}
                              maxLength={255}
                              value={indicaciones}
                              onChange={(e) => setIndicaciones(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-sm-12">
                          <div className="form-group local-forms">
                            <label>
                              Examen Fisico:
                              <span className="login-danger">*</span>
                            </label>
                            <textarea
                              className="form-control"
                              rows={3}
                              cols={30}
                              maxLength={255}
                              value={examenFisico}
                              onChange={(e) => setExamenFisico(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="doctor-submit text-end">
                            {usuarioLogged?.rol?.permisos.some(
                              (permiso) =>permiso.nombre === "registrar" || permiso.nombre === "actualizar"
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
                              onClick={() => navigate("/ConsultaLista")}
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

export default Diagnostico;
