/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../Helpers/userContext";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { Link } from "react-router-dom";
import { Table } from "antd";
import { itemRender } from "../Pagination";
import {
  plusicon,
  refreshicon,
  searchnormal,
} from "../imagepath";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios';
import { formatearFecha } from '../../helpers';

const Consulta = () => {
  const {usuarioLogged} = useContext(UserContext);
  const [citasHoy, setCitasHoy] = useState([]);
  const [mensaje, setMensaje] = useState('');

  async function obtenerCitasDelDia() {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/obtener/cita/hoy/today?id_estado_cita=3&id_doctor=${usuarioLogged.id_rol == 3 ? '*' : usuarioLogged.id_usuario}`);
      console.log("Lista Citaas: ", data)
      setMensaje('');
      if (data.mensaje) {
        setMensaje(data.mensaje);
        return;
      }
      setCitasHoy(data);

    } catch (error) {
      console.error("Error al obtener las citas:", error);
    }
  };



  useEffect(() => {
    obtenerCitasDelDia();
  }, []);

  const columns = [
    {
      title: "Nombre paciente",
      dataIndex: "PacienteName",
      render: (text, record) => (
        <h2 className="profile-image">
          <Link to="#">{record.paciente.nombre_completo}</Link>
        </h2>
      ),
    },
    {
      title: "Identidad",
      dataIndex: "Identity",
      sorter: (a, b) => a.Identity.length - b.Identity.length,
      render: (text, record) => (
        <h2 className="profile-image">
          <Link to="#">{record.paciente.numero_identidad}</Link>
        </h2>
      ),
    },
    {
      title: "Doctor",
      dataIndex: "Doctor",
      sorter: (a, b) => a.Doctor.length - b.Doctor.length,
      render: (text, record) => (
        <h2 className="profile-image">
          <Link to="#">{record.usuario.nombre_de_usuario}</Link>
        </h2>
      ),
    },
    {
      title: "Día de cita",
      dataIndex: "AvailableDays",
      sorter: (a, b) => a.AvailableDays.length - b.AvailableDays.length,
      render: (text, record) => (
        <h2 className="profile-image">
          <Link to="#">{formatearFecha(record.fecha, 'long').split(' ')[0].toUpperCase()}</Link>
        </h2>
      ),
    },
    {
      title: "Hora",
      dataIndex: "AvailableTime",
      sorter: (a, b) => a.AvailableTime.length - b.AvailableTime.length,
      render: (text, record) => (
        <h2 className="profile-image">
          <Link to="#">{record.hora}</Link>
        </h2>
      ),
    },
    {
      title: 'Estado de la cita',
      dataIndex: 'Status',
      render: (text, record) => (
        <div>
          {record.estado.descripcion === "agendada" && (
            <span className="custom-badge status-gray">
              {record.estado.descripcion}
            </span>
          )}
          {record.estado.descripcion === "enpreclinica" && (
            <span className="custom-badge status-blue">
              {record.estado.descripcion}
            </span>
          )}
          {record.estado.descripcion === "finpreclinica" && (
            <span className="custom-badge status-green">
              Listo para consulta
            </span>
          )}
          {record.estado.descripcion === "atender" && (
            <span className="custom-badge status-green">
              Listo para consulta
            </span>
          )}
        </div>
      ),
    },
    {
      render: (text, record) => (
        <div className="d-flex gap-2">
          {usuarioLogged.id_rol == 1 ? (
            <Link to={`/Diagnostico/${record.paciente.id_paciente}/${record.id_cita}`} className="btn btn-primary btn-sm">
              Atender
            </Link>
          ) : null}

          <Link className="btn btn-secondary btn-sm" to={`/expediente/${record.paciente.id_paciente}`}>
            Ver antecedentes
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      <>
        <Header />
        <Sidebar id='menu-item5' id1='menu-items5' activeClassName='shedule-list' />
        <div className="page-wrapper">
          <div className="content">
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
                    <li className="breadcrumb-item active">Lista de Consulta</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <div className="card card-table show-entire">
                  <div className="card-body">
                    <div className="page-table-header mb-2">
                      <div className="row align-items-center">
                        <div className="col">
                          <div className="doctor-table-blk">
                            <h3>Lista de Consultas</h3>
                            <div className="doctor-search-blk">
                              <div className="top-nav-search table-search-blk">
                                <form>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search here"
                                  />
                                  <Link className="btn">
                                    <img
                                      src={searchnormal}
                                      alt="#"
                                    />
                                  </Link>
                                </form>
                              </div>
                              <div className="add-group">
                                <Link
                                  to="/AgregarConsulta"
                                  className="btn btn-primary add-pluss ms-2"
                                >
                                  <img src={plusicon} alt="#" />
                                </Link>
                                <Link
                                  to="#"
                                  className="btn btn-primary doctor-refresh ms-2"
                                >
                                  <img src={refreshicon} alt="#" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {mensaje ? <p className="text-center fw-bold p-3 mt-2">{mensaje}</p> : (
                      <div className="table-responsive">
                        <Table
                          pagination={{
                            total: citasHoy.length,
                            itemRender: itemRender,
                          }}
                          columns={columns}
                          dataSource={citasHoy}
                          rowKey={(record) => record.id_cita}
                        />
                      </div>
                    )}
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

export default Consulta;
