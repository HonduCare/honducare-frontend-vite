/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Select from "react-select";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { formatearFecha, formatearHora } from "../../helpers";

const ConsultaItinerario = () => {

  const [doctorSelected, setDoctorSelected] = useState(null);
  const [doctores, setDoctores] = useState([]);
  const [citas, setCitas] = useState([]);

  const [fecha, setFecha] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  async function getDoctores() {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/obtener/rol/1`;
    try {
      const { data } = await axios.get(url);

      const doctoresTransformed = data.map((doc) => ({
        value: doc.id_usuario.toString(),
        label: doc.nombre_de_usuario,
      }));

      setDoctores(doctoresTransformed);
      setDoctorSelected({
        value: data.length > 0 ? data[0].id_usuario.toString() : '',
        label: data.length > 0 ? data[0].nombre_de_usuario : '',
      });

    } catch (error) {
      console.error('Error al cargar doctores:', error);
    }
  }

  async function getItinerario() {
    setCitas([]);
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/itinerario?id_doctor=${doctorSelected.value}&fecha=${fecha}`;
    try {
      setIsLoading(true);
      const { data } = await axios.get(url);
      setCitas(data.citas);

      setIsLoading(false);

    } catch (error) {
      setIsLoading(false);
      console.error('Error al cargar doctores:', error);
    }
  }

  useEffect(() => {
    getDoctores();
  }, []);


  return (
    <div>
      <Header />
      <Sidebar
        id="menu-item2"
        id1="menu-items2"
        activeClassName="add-patient"
      />
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
                  <li className="breadcrumb-item active">Itinerario</li>
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
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <label>
                            Seleccione doctor: {' '} <span className="login-danger">*</span>
                          </label>
                          <Select
                            value={doctorSelected}
                            onChange={setDoctorSelected}
                            options={doctores}
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
                                  ? "0 0 0 1px #41c1ef"
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

                      <div className="col-12 col-md-6 col-xl-6">
                        <input
                          type="date"
                          className="form-control"
                          value={fecha}
                          onChange={e => setFecha(e.target.value)}
                          min={`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().length == 1 ? '0' : ''}${new Date().getMonth() + 1}-${new Date().getDate()}`}
                        // min={'2025-01-14'}
                        />
                      </div>
                      <div className="col-12 col-md-6 col-xl-6">
                        <button
                          type="button"
                          className="btn-primary p-1 text-white"
                          onClick={getItinerario}
                        >
                          Buscar
                        </button>
                      </div>

                    </div>

                    {isLoading ? (
                      <p className="m-4 text-center">Obteniendo Información...</p>
                    ) : null}

                    <div className="mt-3">
                      {citas.length ? (
                        <div className="">
                          <h4 className="w-75 mx-auto">Citas del doctor: {doctorSelected.label.toUpperCase()}</h4>

                          {citas.map((cita, i) => (
                            <div className="border p-2 shadow-sm w-75 mx-auto" key={i}>
                              <p className="fw-bold mb-2">{i + 1}.</p>
                              <p className="fw-bold mb-2">Paciente: {' '} <span className="fw-normal">{cita.paciente.nombre_completo}</span></p>
                              <p className="fw-bold mb-2">Fecha: {' '} <span className="fw-normal">{formatearFecha(cita.fecha)}</span></p>
                              <p className="fw-bold mb-2">Hora: {' '} <span className="fw-normal">{formatearHora(cita.hora)}</span></p>
                              <p className="fw-bold mb-2">Estado: {' '} <span className="fw-normal">{cita.estado.descripcion.toUpperCase()}</span></p>
                              <p className="fw-bold mb-2">Motivo de la cita: {' '} <span className="fw-normal">{cita.motivo_cita}</span></p>
                            </div>
                          ))}

                        </div>
                      ) : null}
                    </div>

                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultaItinerario;