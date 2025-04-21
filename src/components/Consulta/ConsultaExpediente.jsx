import { useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { Link } from "react-router-dom";
import axios from "axios";
import { Modal } from "antd";

const ConsultaExpediente = () => {
  const [identidad, setIdentidad] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expediente, setExpediente] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  async function obtenerExpedientePaciente() {
    const url = `${API_URL}/obtener/expediente?identidad=${identidad}`;

    try {
      setIsLoading(true);
      setExpediente({});
      const { data } = await axios.get(url);
      console.log("Expediente recibido:", data);
      setExpediente(data);
      setIsModalOpen(true);
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
                <div className="col-md-8">
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

                <div className="col-md-4">
                  <button
                    type="button"
                    className="btn btn-primary mt-1"
                    onClick={obtenerExpedientePaciente}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Buscando...
                      </>
                    ) : (
                      "Buscar"
                    )}
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
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Paciente encontrado"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Link
            key="info"
            to={`/expense-report/${expediente?.paciente?.id_paciente}`}
            className="btn btn-outline-primary mx-3"
          >
            Ver más información
          </Link>,
          <Link
            key="antecedentes"
            to={`/expediente/${expediente?.paciente?.id_paciente}`}
            className="btn btn-outline-secondary"
          >
            Consultar antecedentes
          </Link>,
         
        ]}
      >
        {isLoading ? (
          <div className="d-flex justify-content-center my-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : (
          expediente?.paciente && (
            <div className="mt-4">
              <p><strong>Nombre:</strong> {expediente.paciente.nombre_completo}</p>
              <p><strong>Número Identidad:</strong> {expediente.paciente.numero_identidad}</p>
              <p><strong>Teléfono</strong> {expediente.paciente.telefono}</p>
              <p><strong>Correo Electrónico:</strong> {expediente.paciente.correo_electronico} </p>
              <p><strong>Fecha Nacimiento:</strong> {expediente.paciente.fecha_nacimiento} </p>
              <p><strong>Edad:</strong> {expediente.paciente.edad} años</p>
              
              {expediente.paciente.tbl_sexo &&(
                <p><strong>Sexo:</strong> {expediente.paciente.tbl_sexo.descripcion}</p>
              )}
              {expediente.paciente.tbl_ocupacion && (
                <p><strong>Ocupación:</strong> {expediente.paciente.tbl_ocupacion.descripcion}</p>
              )}
              {expediente.paciente.tbl_estado_civil && (
                <p><strong>Estado civil:</strong> {expediente.paciente.tbl_estado_civil.descripcion}</p>
              )}
               <p><strong>Direccion:</strong> {expediente.paciente.direccion}</p>
            </div>
          )
        )}
      </Modal>
    </div>
  );
};

export default ConsultaExpediente;
