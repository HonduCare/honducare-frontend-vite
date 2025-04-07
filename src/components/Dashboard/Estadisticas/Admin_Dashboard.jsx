import React, { useEffect, useState } from "react";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import DonutChart from "./DonutChart";
import Sidebar from "../../Sidebar";
import Header from "../../Header";
import PatientChart from "./PaitentChart";
import Select from "react-select";

import {
  calendar,
  patients,
  dep_icon1,
  dep_icon2,
  dep_icon3,
  dep_icon4,
  dep_icon5,
  profile_add,
  user001,
} from "../../imagepath";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import axios from "axios";
import { label } from "yet-another-react-lightbox";

const Admin_Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState({
    value: 2025,
    label: "2025",
  });
  // eslint-disable-next-line no-unused-vars
  const YEAR = [
    { value: 2024, label: "2024" },
    { value: 2025, label: "2025" },
  ];

  const [estadisticas, setEstadisticas] = useState({});

  const [isLoading, setIsLoading] = useState(true);

  const [pacientesMas, setPacientesMas] = useState([]);
  const [pacientesFem, setPacientesFem] = useState([]);

  const [citasEspecialidad, setCitasEspecialidad] = useState([]);

  async function getEstadisticas() {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/estadisticas`;

    console.log(url);

    try {
      const { data } = await axios(url);
      console.log(data);
      setEstadisticas(data);
      setIsLoading(false);
      setPacientesMas(data.pacientesMas);
      setPacientesFem(data.pacientesFem);
      setCitasEspecialidad(data.citasEspecialidad);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  async function getPacientesPorMes() {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/estadisticas/pacientes-genero?year=${selectedOption.value}`;

    try {
      const { data } = await axios(url);
      // console.log(data);
      setPacientesFem(data.pacientesFem);
      setPacientesMas(data.pacientesMas);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getEstadisticas();
  }, []);

  return (
    <>
      <Header />
      <Sidebar
        id="menu-item7"
        id1="menu-items7"
        activeClassName="admin-dashboard"
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
                      <Link to="#">Estadísticas</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active">
                      Estadísticas Generales
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div class="d-flex justify-content-center">
                <div class="spinner-border text-primary" role="status"></div>
              </div>
            ) : (
              <>
                <div className="row">
                  <div className="col-md-6 col-sm-6 col-lg-6 col-xl-4">
                    <div className="dash-widget">
                      <div className="dash-boxs comman-flex-center">
                        <img src={patients} alt="#" />
                      </div>
                      <div className="dash-content dash-count flex-grow-1">
                        <h4>Total de Pacientes</h4>
                        <h2>
                          <CountUp
                            delay={0.4}
                            end={estadisticas.cantidadPacientes}
                            duration={0.6}
                          />
                        </h2>
                        <p>
                          <span className="passive-view">
                            <i className="feather-arrow-up-right me-1">
                              <FeatherIcon icon="arrow-up-right" />
                            </i>
                            100%
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6 col-xl-4">
                    <div className="dash-widget">
                      <div className="dash-boxs comman-flex-center">
                        <img src={profile_add} alt="#" />
                      </div>
                      <div className="dash-content dash-count">
                        <h4>Nuevos Pacientes del Mes</h4>
                        <h2>
                          <CountUp
                            delay={0.4}
                            end={estadisticas.cantidadPacientesMesActual}
                            duration={0.6}
                          />
                        </h2>
                        <p>
                          <span
                            className={
                              estadisticas.cantidadPacientesMesAnterior <
                              estadisticas.cantidadPacientesMesActual
                                ? "passive-view"
                                : "negative-view"
                            }
                          >
                            <i
                              className={
                                estadisticas.cantidadPacientesMesAnterior <
                                estadisticas.cantidadPacientesMesActual
                                  ? "feather-arrow-up-right me-1"
                                  : "feather-arrow-down-right me-1"
                              }
                            >
                              <FeatherIcon
                                icon={
                                  estadisticas.cantidadPacientesMesAnterior <
                                  estadisticas.cantidadPacientesMesActual
                                    ? "arrow-up-right"
                                    : "arrow-down-right"
                                }
                              />
                            </i>
                            {estadisticas.porcentajePacientes}%
                          </span>{" "}
                          vs El mes anterior (
                          {estadisticas.cantidadPacientesMesAnterior})
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6 col-xl-4">
                    <div className="dash-widget">
                      <div className="dash-boxs comman-flex-center">
                        <img src={calendar} alt="#" />
                      </div>
                      <div className="dash-content dash-count">
                        <h4>Citas del Mes</h4>
                        <h2>
                          <CountUp
                            delay={0.4}
                            end={estadisticas.cantidadCitasMesActual}
                            duration={0.6}
                          />
                        </h2>
                        <p>
                          <span
                            className={
                              estadisticas.cantidadCitasMesAnterior <
                              estadisticas.cantidadCitasMesActual
                                ? "passive-view"
                                : "negative-view"
                            }
                          >
                            <i
                              className={
                                estadisticas.cantidadCitasMesAnterior <
                                estadisticas.cantidadCitasMesActual
                                  ? "feather-arrow-up-right me-1"
                                  : "feather-arrow-down-right me-1"
                              }
                            >
                              <FeatherIcon
                                icon={
                                  estadisticas.cantidadCitasMesAnterior <
                                  estadisticas.cantidadCitasMesActual
                                    ? "arrow-up-right"
                                    : "arrow-down-right"
                                }
                              />
                            </i>
                            {estadisticas.porcentajeCitas}%
                          </span>{" "}
                          vs El mes anterior (
                          {estadisticas.cantidadCitasMesAnterior})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-md-12 col-lg-6 col-xl-6">
                    <div className="card">
                      <div className="card-body">
                        <div className="chart-title patient-visit">
                          <h4>Visita de Pacientes por Género</h4>
                          <div>
                            <ul className="nav chat-user-total">
                              <li>
                                <i
                                  className="fa fa-circle current-users"
                                  aria-hidden="true"
                                />
                                Masculino {estadisticas.porcentajeMasculino}%
                              </li>
                              <li>
                                <i
                                  className="fa fa-circle old-users"
                                  aria-hidden="true"
                                />{" "}
                                Femenino {estadisticas.porcentajeFemenino}%
                              </li>
                            </ul>
                          </div>
                          <div className="form-group mb-0">
                            <Select
                              className="custom-react-select"
                              defaultValue={selectedOption}
                              onChange={(newValue) => {
                                setSelectedOption({
                                  value: newValue.value,
                                  label: newValue.label,
                                });
                                getPacientesPorMes();
                                // console.log(newValue);
                              }}
                              options={YEAR}
                              id="search-commodity"
                              components={{
                                IndicatorSeparator: () => null,
                              }}
                              styles={{
                                control: (baseStyles, state) => ({
                                  ...baseStyles,
                                  borderColor: state.isFocused
                                    ? "none"
                                    : "2px solid rgba(46, 55, 164, 0.1);",
                                  boxShadow: state.isFocused
                                    ? "0 0 0 1px #2e37a4"
                                    : "none",
                                  "&:hover": {
                                    borderColor: state.isFocused
                                      ? "none"
                                      : "2px solid rgba(46, 55, 164, 0.1)",
                                  },
                                  borderRadius: "10px",
                                  fontSize: "14px",
                                  minHeight: "45px",
                                }),
                                dropdownIndicator: (base, state) => ({
                                  ...base,
                                  transform: state.selectProps.menuIsOpen
                                    ? "rotate(-180deg)"
                                    : "rotate(0)",
                                  transition: "250ms",
                                  width: "35px",
                                  height: "35px",
                                }),
                              }}
                            />
                          </div>
                        </div>
                        <div id="patient-chart" />
                        <PatientChart
                          pacientesFem={pacientesFem}
                          pacientesMas={pacientesMas}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-12 col-lg-6 col-xl-3 d-flex">
                    <div className="card">
                      <div className="card-body">
                        <div className="chart-title">
                          <h4>Pacientes por Enfermedad</h4>
                        </div>
                        <div id="donut-chart-dash" className="chart-user-icon">
                          <DonutChart patologias={estadisticas.patologias} />
                          <img src={user001} alt="#" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-12 col-xl-3">
                    <div className="card top-departments">
                      <div className="card-header">
                        <h4 className="card-title mb-0">
                          Atención por Especialidad
                        </h4>
                      </div>
                      <div className="card-body">
                        {citasEspecialidad.length > 0
                          ? citasEspecialidad.map((cita) => (
                              <div
                                key={cita.especialidad}
                                className="activity-top"
                              >
                                <div className="activity-boxs comman-flex-center">
                                  <img
                                    src={
                                      cita.especialidad
                                        .toLowerCase()
                                        .includes("dentista")
                                        ? dep_icon2
                                        : dep_icon1
                                    }
                                    alt="icono especialidad"
                                  />
                                </div>
                                <div className="departments-list">
                                  <h4>{cita.especialidad}</h4>
                                  <p>{cita.porcentaje}%</p>
                                </div>
                              </div>
                            ))
                          : null}

                        {/* <div className="activity-top">
                          <div className="activity-boxs comman-flex-center">
                            <img src={dep_icon2} alt="#" />i
                          </div>
                          <div className="departments-list">
                            <h4>Dentista</h4>
                            <p>24%</p>
                          </div>
                        </div>
                        <div className="activity-top">
                          <div className="activity-boxs comman-flex-center">
                            <img src={dep_icon3} alt="#" />
                          </div>
                          <div className="departments-list">
                            <h4>Otorrino</h4>
                            <p>10%</p>
                          </div>
                        </div>
                        <div className="activity-top">
                          <div className="activity-boxs comman-flex-center">
                            <img src={dep_icon4} alt="#" />
                          </div>
                          <div className="departments-list">
                            <h4>Cardiologo</h4>
                            <p>15%</p>
                          </div>
                        </div>
                        <div className="activity-top mb-0">
                          <div className="activity-boxs comman-flex-center">
                            <img src={dep_icon5} alt="#" />
                          </div>
                          <div className="departments-list">
                            <h4>Oftamólogo</h4>
                            <p>20%</p>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    </>
  );
};

export default Admin_Dashboard;
