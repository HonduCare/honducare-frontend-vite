import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../Helpers/userContext";
import { Table } from "antd";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { searchnormal, plusicon } from "../imagepath";
import { onShowSizeChange, itemRender } from "../Pagination";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import axios from "axios"; // Asegúrate de haber instalado axios
import Swal from "sweetalert2";

import { formatearFecha, formatearHora } from "../../helpers";

const AppoinmentList = () => {
  const { usuarioLogged } = useContext(UserContext);
  //const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [datasource, setDatasource] = useState([]);
  const [search, setSearch] = useState("");
  const [citasFiltradas, setCitasFiltradas] = useState([]);

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL; // Obtiene la URL base desde el .env

  function buscarCitaNombre() {
    if (search == "") {
      setCitasFiltradas([]);
      obtenerCita();
      return;
    }

    const filtroCitasNombre = datasource.filter((cita) =>
      cita.paciente.nombre_completo.toLowerCase().includes(search.toLowerCase())
    );
    setCitasFiltradas(filtroCitasNombre);
  }

  const columns = [
    {
      title: "Nombre",
      dataIndex: "Name",
      render: (text, record) => (
        <h2 className="profile-image">
          {/* <Link to="#" className="avatar avatar-sm me-2">
            <img className="avatar-img rounded-circle" src={record.Img} alt="User Image" />
          </Link> */}
          <Link to="#">{record.paciente.nombre_completo}</Link>
        </h2>
      ),
    },
    {
      title: "Doctor",
      dataIndex: "ConsultingDoctor",
      sorter: (a, b) => a.ConsultingDoctor.length - b.ConsultingDoctor.length,
      render: (text, record) => (
        <h2 className="profile-image">
          <Link to="#">{record.usuario.nombre_de_usuario}</Link>
        </h2>
      ),
    },
    {
      title: "Motivo",
      dataIndex: "Motivo",
      sorter: (a, b) => a.Motivo.length - b.Motivo.length,
      render: (text, record) => (
        <h2 className="profile-image">
          <Link to="#">{record.motivo_cita}</Link>
        </h2>
      ),
    },
    {
      title: "Teléfono",
      dataIndex: "Teléfono",
      sorter: (a, b) => a.Teléfono.length - b.Teléfono.length,
      render: (text, record) => (
        <h2 className="profile-image">
          <Link to="#">{record.paciente.telefono}</Link>
        </h2>
      ),
    },
    {
      title: "Identificación",
      dataIndex: "Identificacion",
      sorter: (a, b) => a.Identificacion.length - b.Identificacion.length,
      render: (text, record) => (
        <h2 className="profile-image">
          <Link to="#">{record.paciente.numero_identidad}</Link>
        </h2>
      ),
    },
    {
      title: "Día",
      dataIndex: "Date",
      sorter: (a, b) => a.Date.length - b.Date.length,
      render: (text, record) => (
        <h2 className="profile-image">
          <Link to="#">{formatearFecha(record.fecha)}</Link>
        </h2>
      ),
    },
    {
      title: "Hora",
      dataIndex: "Time",
      sorter: (a, b) => a.Time.length - b.Time.length,
      render: (text, record) => (
        <h2 className="profile-image">
          <Link to="#">{formatearHora(record.hora)}</Link>
        </h2>
      ),
    },
    {
      title: "",
      dataIndex: "FIELD8",
      render: (text, record) => {
        const hasUpdatePermission = usuarioLogged?.rol?.permisos.some(
          (permiso) => permiso.nombre === "actualizar"
        );
        const hasDeletePermission = usuarioLogged?.rol?.permisos.some(
          (permiso) => permiso.nombre === "eliminar"
        );
      
        // Si no tiene permisos, no renderizar nada
        if (!hasUpdatePermission && !hasDeletePermission) {
          return null;
        }
      
        return (
          <div className="text-end">
            <div className="dropdown dropdown-action">
              <Link
                to="#"
                className="action-icon dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-ellipsis-v" />
              </Link>
              <div className="dropdown-menu dropdown-menu-end">
                {/* Mostrar opción "Editar" si el usuario tiene permiso "actualizar" */}
                {hasUpdatePermission && (
                  <Link
                    className="dropdown-item"
                    to={`/EditCita/${record.id_cita}`}
                  >
                    <i className="far fa-edit me-2" />
                    Editar
                  </Link>
                )}
      
                {/* Mostrar opción "Cancelar Cita" si el usuario tiene permiso "eliminar" */}
                {hasDeletePermission && (
                  <button
                    className="dropdown-item"
                    to="#"
                    onClick={ async () => {
                      await DeleteCita(record.id_cita);
                    }}
                  >
                    <i className="fa fa-trash-alt m-r-5"></i> Cancelar Cita
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  // Función para eliminar la cita
  const DeleteCita = async (idCita) => {
    if (!idCita) return;
  
    // Mostrar Swal de confirmación
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer. ¿Deseas eliminar esta cita?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });
  
    if (result.isConfirmed) {
      try {
        const url = `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/eliminar/cita/${idCita}`;
        const response = await axios.delete(url);
  
        if (response.data.mensaje === "Cita eliminada exitosamente") {
          Swal.fire({
            icon: "success",
            title: "¡Cita eliminada con éxito!",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            // Elimina la cita de la lista localmente
            setDatasource((prevDatasource) =>
              prevDatasource.filter((cita) => cita.id_cita !== idCita)
            );
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response.data.mensaje || "Hubo un problema al eliminar la cita",
          });
        }
      } catch (error) {
        console.error("Error al eliminar la cita:", error);
        Swal.fire({
          icon: "error",
          title: "Error al eliminar la cita",
          text: "Hubo un problema al procesar tu solicitud. Intenta de nuevo.",
        });
      }
    } else {
      Swal.fire({
        icon: "info",
        title: "Cancelado",
        text: "La cita no fue eliminada.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  async function obtenerCita() {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/obtener/citas`
      );
      setDatasource(data);
    } catch (error) {
      console.error("Error al obtener las citas:", error);
    }
  }


  useEffect(() => {
    obtenerCita();
  }, []);

  return (
    <>
      <Header />
      <Sidebar
        id="menu-item4"
        id1="menu-items4"
        activeClassName="appoinment-list"
      />
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="#">Agendar Cita</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right">
                      <FeatherIcon icon="chevron-right" />
                    </i>
                  </li>
                  <li className="breadcrumb-item active">Listado de citas</li>
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
                          <h3>Listado de citas</h3>
                          <div className="doctor-search-blk">
                            <div className="top-nav-search table-search-blk">
                              <form>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Buscar por nombre de paciente"
                                  value={search}
                                  onChange={(e) => setSearch(e.target.value)}
                                  onInput={buscarCitaNombre}
                                />
                                <Link className="btn">
                                  <img src={searchnormal} alt="#" />
                                </Link>
                              </form>
                            </div>
                            <div className="add-group">
                              {usuarioLogged?.rol?.permisos.some(
                                (permiso) => permiso.nombre === "registrar"
                              ) && (
                                <Link
                                  to="/AgregarCita"
                                  className="btn btn-primary add-pluss ms-2"
                                >
                                  <img src={plusicon} alt="#" />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {datasource.length > 0 || citasFiltradas.length > 0 ? (
                    <div className="table-responsive doctor-list">
                      <Table
                        pagination={{
                          total:
                            citasFiltradas.length > 0
                              ? citasFiltradas.length
                              : datasource.length,
                          showTotal: (total, range) =>
                            `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                          onShowSizeChange: onShowSizeChange,
                          itemRender: itemRender,
                        }}
                        columns={columns}
                        dataSource={
                          citasFiltradas.length > 0
                            ? citasFiltradas
                            : datasource
                        }
                        //rowSelection={rowSelection}
                        rowKey={(record) => record.id_cita}
                      />
                    </div>
                  ) : (
                    <p className="text-center mt-4">No hay citas agendadas.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      <div
        className="modal fade"
        id="delete_patient"
        tabIndex={-1}
        aria-labelledby="delete_patientLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="delete_patientLabel">
                Eliminar cita
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar esta cita?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={DeleteCita}
                data-bs-dismiss="modal"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppoinmentList;
