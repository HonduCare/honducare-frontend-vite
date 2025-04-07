/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { Link, useNavigate, useParams } from 'react-router-dom';

import axios from "axios";

const ConsultaExpediente = () => {
  const navigate = useNavigate();
  const params = useParams();
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  const [identidad, setIdentidad] = useState('');
  const [error, setError] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [expediente, setExpediente] = useState({});

  async function obtenerExpedientePaciente() {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/obtener/expediente?identidad=${identidad}`;

    try {
      setIsLoading(true);
      setExpediente({});
      const { data } = await axios.get(url);
      console.log(data);
      setExpediente(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
      setTimeout(() => {
        setError('');
      }, 2000);
      setIsLoading(false);
    }

  }

  return (
    <div>
      <Header />
      <Sidebar id='menu-item6' id1='menu-items6' activeClassName='examenfisico-list' />
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
                    <li className="breadcrumb-item active">Expediente</li>
                  </ul>
                </div>
              </div>
            </div>


            <div className="card">
              <div className="card-body">
                {error ? (
                  <p className="text-red p-2">{error}</p>
                ) : null}
                <div className="row">

                  <div className="col-12 col-md-6 col-xl-6">
                    <div className="form-group local-forms">
                      <label>
                        Identidad Paciente:<span className="login-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        value={identidad}
                        onChange={e => setIdentidad(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-xl-6">
                    <button
                      type="button"
                      className="btn-primary p-1 text-white"
                      onClick={obtenerExpedientePaciente}
                    >
                      Buscar
                    </button>
                  </div>

                </div>

                {isLoading ? (
                  <p>Obteniendo Información...</p>
                ) : null}

                {/* Expdiente */}
                {expediente.paciente ? (
                  <>
                    <p>Nombre: <span className="fw-bold">{expediente.paciente.nombre_completo}</span></p>
                    <p>Numero Identidad: <span className="fw-bold">{expediente.paciente.numero_identidad}</span></p>
                    <p>Edad: <span className="fw-bold">{expediente.paciente.edad}</span> años</p>
                    {expediente.paciente.tbl_sexo && (<p>Sexo: <span className="fw-bold">{expediente.paciente.tbl_sexo.descripcion}</span></p>)}
                    <p>Nacionalidad: <span className="fw-bold">{expediente.paciente.nacionalidad}</span></p>
                    {expediente.paciente.tbl_ocupacion && (<p>Ocupación: <span className="fw-bold">{expediente.paciente.tbl_ocupacion.descripcion}</span></p>)}

                    <div className="d-flex gap-2">
                      <Link to={`/expense-report/${expediente.paciente.id_paciente}`} target="_blank" >Ver más información</Link>
                      <Link to={`/expediente/${expediente.paciente.id_paciente}`} target="_blank" >Consultar antecedentes</Link>
                    </div>
                  </>
                ) : null}

              </div>
            </div>

          </div>
        </div>
      </>
    </div>
  );
};

export default ConsultaExpediente;
