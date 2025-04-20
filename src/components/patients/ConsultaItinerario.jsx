import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Select from "react-select";
import { Link } from "react-router-dom";
import { Card, Row, Col } from "antd";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { formatearFecha, formatearHora } from "../../helpers";

const ConsultaItinerario = () => {
  const [doctorSelected, setDoctorSelected] = useState(null);
  const [doctores, setDoctores] = useState([]);
  const [citas, setCitas] = useState([]);
  const [msg, setMsg] = useState("");

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
        value: data.length > 0 ? data[0].id_usuario.toString() : "",
        label: data.length > 0 ? data[0].nombre_de_usuario : "",
      });
    } catch (error) {
      console.error("Error al cargar doctores:", error);
    }
  }

  async function getItinerario() {
    setCitas([]);
    const url = `${
      import.meta.env.VITE_REACT_APP_API_URL
    }/itinerario?id_doctor=${doctorSelected.value}&fecha=${fecha}`;
    try {
      setIsLoading(true);
      const { data } = await axios.get(url);
      setCitas(data.citas);
      console.log("Citas itinerario: ", data);
      if (data.citas.length === 0) {
        setMsg("No hay citas para el doctor seleccionado en esta fecha.");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error al cargar doctores:", error);
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
                      <div className="col-12 col-md-5 col-xl-5">
                        <div className="form-group local-forms">
                          <label>
                            Seleccione doctor:{" "}
                            <span className="login-danger">*</span>
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

                      <div className="col-10 col-md-5 col-xl-5">
                        <input
                          type="date"
                          className="form-control"
                          value={fecha}
                          onChange={(e) => setFecha(e.target.value)}
                          min={`${new Date().getFullYear()}-${
                            (new Date().getMonth() + 1).toString().length == 1
                              ? "0"
                              : ""
                          }${
                            new Date().getMonth() + 1
                          }-${new Date().getDate()}`}
                        />
                      </div>
                      <div className="col-2 col-md-2 col-xl-2">
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
                      <p className="m-4 text-center">
                        Obteniendo Información...
                      </p>
                    ) : null}

                    <div className="mt-3">
                      {citas.length ? (
                        <div className="">
                          <h4 className="w-75 mb-4 fw-bold">
                            Citas del doctor:{" "}
                            {doctorSelected.label.toUpperCase()}
                          </h4>

                          <Row gutter={[16, 16]} justify="center">
                            {citas.map((cita, i) => (
                              <Col
                                key={i}
                                xs={24}
                                sm={24}
                                md={20}
                                lg={12}
                                xl={12}
                                className="d-flex justify-content-center"
                              >
                                <Card
                                  title={`#${i + 1} - ${
                                    cita.paciente.nombre_completo
                                  }`}
                                  bordered={true}
                                  className="w-100 shadow-sm"
                                >
                                  <p>
                                    <strong>Fecha:</strong>{" "}
                                    {formatearFecha(cita.fecha)}
                                  </p>
                                  <p>
                                    <strong>Hora:</strong>{" "}
                                    {formatearHora(cita.hora)}
                                  </p>
                                  <p>
                                    <strong>Estado:</strong>{" "}
                                    {cita.estado.descripcion.toUpperCase()}
                                  </p>
                                  <p>
                                    <strong>Motivo de la cita:</strong>{" "}
                                    {cita.motivo_cita}
                                  </p>
                                </Card>
                              </Col>
                            ))}
                          </Row>
                        </div>
                      ) : (
                        <p className="text-center mt-4">{msg}</p>
                      )}
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
