/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../Helpers/userContext";
import { Table } from "antd";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { onShowSizeChange, itemRender } from "../Pagination";
import {
  imagesend,
  pdficon,
  pdficon3,
  pdficon4,
  refreshicon,
  searchnormal,
  plusicon,
} from "../imagepath";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";

const PatientsList = () => {
  const { usuarioLogged } = useContext(UserContext);
  const [pacientes, setPacientes] = useState([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const getPacientes = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/pacientes`
      );
      setPacientes(response.data.reverse());
    } catch (error) {
      console.error("Error al cargar los datos: ", error);
    }
  };

  useEffect(() => {
    getPacientes();
  }, []);

  // Manejar la búsqueda
  useEffect(() => {
    const timeout = setTimeout(() => {
      const query = searchQuery.toLowerCase();

      if (query === "") {
        setPacientesFiltrados([]);
      } else {
        const filtered = pacientes.filter(
          (patient) =>
            patient.nombre_completo.toLowerCase().includes(query) ||
            patient.numero_identidad?.toLowerCase().includes(query)
        );
        setPacientesFiltrados(filtered);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery, pacientes]);

  // Función para manejar la eliminación
  const handleDelete = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${import.meta.env.VITE_REACT_APP_API_URL}/pacientes/${id}`
          );

          // Si la eliminación fue exitosa
          const updatedPacientes = pacientes.filter(
            (paciente) => paciente.id_paciente !== id
          );
          setPacientes(updatedPacientes);
          setPacientesFiltrados(updatedPacientes);

          Swal.fire({
            icon: "success",
            title: "¡Paciente eliminado!",
            text: "El paciente ha sido eliminado con éxito.",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            // Aquí cerramos el modal
            const closeButton = document.querySelector(
              '[data-bs-dismiss="modal"]'
            );
            if (closeButton) closeButton.click(); // Cierra el modal
          });
        } catch (error) {
          // En caso de error, mostramos un mensaje
          console.error("Error al eliminar el paciente:", error);
          Swal.fire({
            icon: "error",
            title: "¡Error!",
            text: "Hubo un problema al eliminar el paciente.",
            confirmButtonText: "Cerrar",
          });
        }
      }
    });
  };

  // Refrescar los datos
  const handleRefresh = () => {
    setPacientes([]);
    setPacientesFiltrados([]);
    setSearchQuery("");
    getPacientes();
  };

  const columns = [
    {
      title: "Nombre Completo",
      dataIndex: "nombre",
      render: (text, record) => (
        <h2 className="profile-image">{record.nombre_completo}</h2>
      ),
    },
    {
      title: "# Identidad",
      dataIndex: "num_doc",
      render: (text, record) => (
        <h2 className="profile-image">{record.numero_identidad}</h2>
      ),
    },
    {
      title: "Edad",
      dataIndex: "edad",
      render: (text, record) => (
        <h2 className="profile-image">{record.edad}</h2>
      ),
    },
    {
      title: "Teléfono",
      dataIndex: "telefono",
      render: (text, record) => (
        <h2 className="profile-image">{record.telefono}</h2>
      ),
    },
    {
      title: "Correo",
      dataIndex: "correo",
      render: (text, record) => (
        <h2 className="profile-image">{record.correo_electronico}</h2>
      ),
    },
    {
      title: "Acciones",
      dataIndex: "FIELD8",
      render: (text, record) => (
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
              <Link
                className="dropdown-item"
                to={`/expense-Report/${record.id_paciente}`}
              >
                <i className="far fa-edit me-2" />
                Ver expediente
              </Link>
              <Link
                className="dropdown-item"
                to={`/editPaciente/${record.id_paciente}`}
              >
                <i className="far fa-edit me-2" />
                Editar
              </Link>
              {usuarioLogged?.rol?.permisos.some(
                (permiso) => permiso.nombre === "eliminar"
              ) && (
                <button
                  className="dropdown-item"
                  onClick={() => handleDelete(record.id_paciente)}
                >
                  <i className="fa fa-trash-alt m-r-5"></i> Eliminar
                </button>
              )}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Header />
      <Sidebar
        id="menu-item2"
        id1="menu-items2"
        activeClassName="patient-list"
      />
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="#">Pacientes</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right">
                      <FeatherIcon icon="chevron-right" />
                    </i>
                  </li>
                  <li className="breadcrumb-item active">Lista de Pacientes</li>
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
                        <h3>Lista de Pacientes</h3>
                        <div className="doctor-search-blk">
                          <div className="top-nav-search table-search-blk">
                            <form>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por nombre o número de documento"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />

                              <Link className="btn">
                                <img src={searchnormal} alt="#" />
                              </Link>
                            </form>
                          </div>
                          <div className="add-group">
                            <Link
                              to="/agregarpaciente"
                              className="btn btn-primary add-pluss ms-2"
                            >
                              <img src={plusicon} alt="#" />
                            </Link>
                            <Link
                              to="#"
                              className="btn btn-primary doctor-refresh ms-2"
                              onClick={handleRefresh}
                            >
                              <img src={refreshicon} alt="#" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive doctor-list">
                    <Table
                      pagination={{
                        total:
                          pacientesFiltrados?.length > 0
                            ? pacientesFiltrados
                            : pacientes.length,
                        showTotal: (total, range) =>
                          `Mostrando ${range[0]} a ${range[1]} de ${total} entradas`,
                        onShowSizeChange: onShowSizeChange,
                        itemRender: itemRender,
                      }}
                      columns={columns}
                      dataSource={
                        pacientesFiltrados?.length > 0
                          ? pacientesFiltrados
                          : pacientes
                      }
                      // rowSelection={rowSelection}
                      rowKey={(record) => record.id_paciente}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientsList;
