/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ConsultaExpediente = () => {
  const navigate = useNavigate();
  const [identidad, setIdentidad] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expediente, setExpediente] = useState({});
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  async function obtenerExpedientePaciente() {
    const url = `${API_URL}/obtener/expediente?identidad=${identidad}`;

    try {
      setIsLoading(true);
      setExpediente({});
      const { data } = await axios.get(url);
      console.log("Expediente recibido:", data);
      setExpediente(data);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Error al obtener expediente");
      setTimeout(() => setError(""), 2000);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Header />
      <Sidebar
        id="menu-item6"
        id1="menu-items6"
        activeClassName="examenfisico-list"
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
                  <li className="breadcrumb-item active">Expediente</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              {error && <p className="text-danger p-2">{error}</p>}

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="form-group local-forms">
                    <label>
                      Identidad Paciente: <span className="login-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      value={identidad}
                      onChange={(e) => setIdentidad(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-6 d-flex align-items-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={obtenerExpedientePaciente}
                  >
                    Buscar
                  </button>
                </div>
              </div>

              {isLoading && (
                <div className="d-flex justify-content-center my-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              )}

              {/* Datos del Expediente */}
              {expediente?.paciente && !isLoading && (
                <>
                  <p>
                    <strong>Nombre:</strong>{" "}
                    <span className="fw-bold">{expediente.paciente.nombre_completo}</span>
                  </p>
                  <p>
                    <strong>Número Identidad:</strong>{" "}
                    <span className="fw-bold">{expediente.paciente.numero_identidad}</span>
                  </p>
                  <p>
                    <strong>Edad:</strong>{" "}
                    <span className="fw-bold">{expediente.paciente.edad}</span> años
                  </p>
                  {expediente.paciente.tbl_sexo && (
                    <p>
                      <strong>Sexo:</strong>{" "}
                      <span className="fw-bold">{expediente.paciente.tbl_sexo.descripcion}</span>
                    </p>
                  )}
                  <p>
                    <strong>Nacionalidad:</strong>{" "}
                    <span className="fw-bold">{expediente.paciente.nacionalidad}</span>
                  </p>
                  {expediente.paciente.tbl_ocupacion && (
                    <p>
                      <strong>Ocupación:</strong>{" "}
                      <span className="fw-bold">
                        {expediente.paciente.tbl_ocupacion.descripcion}
                      </span>
                    </p>
                  )}

                  <div className="d-flex gap-3 mt-3">
                    <Link
                      to={`/expense-report/${expediente.paciente.id_paciente}`}
                      target="_blank"
                      className="btn btn-outline-primary"
                    >
                      Ver más información
                    </Link>
                    <Link
                      to={`/expediente/${expediente.paciente.id_paciente}`}
                      target="_blank"
                      className="btn btn-outline-secondary"
                    >
                      Consultar antecedentes
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultaExpediente;
