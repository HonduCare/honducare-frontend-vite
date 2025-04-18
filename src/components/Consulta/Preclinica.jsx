/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../Helpers/userContext";
import axios from "axios"; // Importamos axios para hacer la petición
import Header from "../Header";
import Sidebar from "../Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { Table } from "antd";
import { onShowSizeChange, itemRender } from "../Pagination";
import { pdficon } from "../imagepath";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import "bootstrap/dist/css/bootstrap.min.css";

import { formatearFecha, formatearHora } from "../../helpers";

const Preclinica = () => {
  const { usuarioLogged } = useContext(UserContext);
  const navigate = useNavigate();
  const [datasource, setDatasource] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/obtener/cita/hoy/today`
      ); // Ruta de tu API
      let citasFiltradas = data;
      if (usuarioLogged.rol.rol === "Doctor") {
        citasFiltradas = data.filter(
          (cita) => cita.id_usuario === usuarioLogged.id_usuario
        );
      }
      setMensaje("");
      if (data.mensaje) {
        setMensaje(mensaje);
        return;
      }
      setDatasource(citasFiltradas);
    } catch (error) {
      console.error("Error al cargar los datos: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "Nombre paciente",
      dataIndex: "nombre_completo",
      render: (text, record) => (
        <h2 className="profile-image">
          <Link to="#">{record.paciente.nombre_completo}</Link>
        </h2>
      ),
    },
    {
      title: "Identidad",
      dataIndex: "identidad",
      sorter: (a, b) => a.identidad.length - b.identidad.length,
      render: (text, record) => (
        <h2 className="profile-image">
          <Link to="#">{record.paciente.numero_identidad}</Link>
        </h2>
      ),
    },
    {
      title: "Doctor",
      dataIndex: "doctor",
      sorter: (a, b) => a.doctor.length - b.doctor.length,
      render: (text, record) => (
        <h2 className="profile-image">
          <Link to="#">{record.usuario.nombre_de_usuario}</Link>
        </h2>
      ),
    },
    {
      title: "Día de cita",
      dataIndex: "fecha",
      sorter: (a, b) => a.fecha.length - b.fecha.length,
      render: (text, record) => (
        <h2 className="profile-image">
          <Link to="#">
            {formatearFecha(record.fecha, "long").split(" ")[0].toUpperCase()}
          </Link>
        </h2>
      ),
    },
    {
      title: "Hora",
      dataIndex: "hora",
      sorter: (a, b) => a.hora.length - b.hora.length,
      render: (text, record) => (
        <h2 className="profile-image">
          <Link to="#">{formatearHora(record.hora)}</Link>
        </h2>
      ),
    },
    {
      title: "Estado de la cita",
      render: (text, record) => (
        <div className="d-flex align-items-center">
          <div>
            {record.estado.descripcion === "agendada" && (
              <span className="custom-badge status-green">
                {record.estado.descripcion}
              </span>
            )}
            {record.estado.descripcion === "consulta" && (
              <span className="custom-badge status-blue">
                {record.estado.descripcion}
              </span>
            )}
            {record.estado.descripcion === "finalizada" && (
              <span className="custom-badge status-pink">
                {record.estado.descripcion}
              </span>
            )}
          </div>
          <div className="ms-3">
            {usuarioLogged?.rol?.permisos.some(
              (permiso) =>
                permiso.nombre === "registrar" ||
                permiso.nombre === "actualizar"
            ) && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() =>
                  navigate(
                    `/examenfisico/${record.id_cita}/${record.paciente.id_paciente}`
                  )
                }
              >
                Registro de Preclínica
              </button>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Header />
      <Sidebar
        id="menu-item5"
        id1="menu-items5"
        activeClassName="preclinica-list"
      />
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
                  <li className="breadcrumb-item active">Preclinica</li>
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
                          <h3>Lista de pacientes</h3>
                        </div>
                      </div>
                      <div className="col-auto text-end float-end ms-auto download-grp">
                        <Link to="#" className="me-2">
                          <img src={pdficon} alt="#" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  {mensaje ? (
                    <p className="text-center fw-bold">{mensaje}</p>
                  ) : (
                    <div className="table-responsive">
                      <Table
                        pagination={{
                          total: datasource.length,
                          showTotal: (total, range) =>
                            `Mostrando ${range[0]} a ${range[1]} de ${total}`,
                          onShowSizeChange: onShowSizeChange,
                          itemRender: itemRender,
                        }}
                        columns={columns}
                        dataSource={datasource}
                        rowSelection={false}
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
    </div>
  );
};

export default Preclinica;
