/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { Link, useParams } from "react-router-dom";
import { formatearFecha, formatearHora } from "../../helpers";
import moment from "moment";
import { Table } from "antd";

// Exportar a PDF
import { pdficon } from "../imagepath";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Expediente = () => {
  const params = useParams();
  const [expediente, setExpediente] = useState(null);

  const [mensaje, setMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const expedienteRef = useRef();
  const handleExportPDF = (paciente) => {
    const input = expedienteRef.current;

    html2canvas(input, {
      useCORS: true, // Permite cargar imágenes externas si es necesario
      scale: 2, // Mejora la calidad de la imagen
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "png", 10, 10, pdfWidth - 20, pdfHeight - 20); // Aquí se aplica el padding en el PDF
        pdf.save(`Expediente de ${paciente.nombre_completo}.pdf`);
      })
      .catch((err) => console.error("Error generating PDF", err));
  };

  async function getExpediente() {
    const url = `${
      import.meta.env.VITE_REACT_APP_API_URL
    }/obtener/antecedentes/${params.id}`;
    try {
      const { data } = await axios(url);
      console.log("data: ", data)
      setMensaje("");
      if (data.mensaje) {
        setMensaje(data.mensaje);
        return;
      }
      setExpediente(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setMensaje(error.response.data.mensaje);
    }
  }

  useEffect(() => {
    getExpediente();
  }, []);

  return (
    <>
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
                      <Link to="#">Expediente</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="row" ref={expedienteRef}>
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <form>
                      <div className="row">
                        {isLoading ? (
                          <div className="d-flex justify-content-center align-items-center w-100 py-5">
                            <div
                              className="spinner-border text-primary"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Cargando...
                              </span>
                            </div>
                          </div>
                        ) : (
                          <>
                            {expediente && (
                              <div className="d-flex flex-column mb-3">
                                <div className="d-flex align-items-center justify-content-between w-100 mb-4">
                                  <h4>Datos del paciente</h4>
                                  <button
                                    className="btn"
                                    type="button"
                                    onClick={() =>
                                      handleExportPDF(expediente.paciente)
                                    }
                                  >
                                    <img src={pdficon} alt="guardar pdf" />
                                  </button>
                                </div>
                                <div className="row">
                                  <div className="col-md-6">
                                    <p>
                                      Nombre del paciente:{" "}
                                      <span className="fw-bold">
                                        {expediente.paciente?.nombre_completo}
                                      </span>
                                    </p>
                                    <p>
                                      Identidad:{" "}
                                      <span className="fw-bold">
                                        {expediente.paciente?.numero_identidad}
                                      </span>
                                    </p>
                                    <p>
                                      Edad:{" "}
                                      <span className="fw-bold">
                                        {expediente.paciente?.edad}
                                      </span>
                                    </p>
                                  </div>

                                  <div className="col-md-6">
                                    <p>
                                      Número de teléfono:{" "}
                                      <span className="fw-bold">
                                        {expediente.paciente?.telefono}
                                      </span>
                                    </p>
                                    <p>
                                      Dirección:{" "}
                                      <span className="fw-bold">
                                        {expediente.paciente?.direccion ||
                                          "Sin especificar"}
                                      </span>
                                    </p>
                                    <p>
                                      Correo Electronico:{" "}
                                      <span className="fw-bold">
                                        {expediente.paciente
                                          ?.correo_electronico ||
                                          "Sin especificar"}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-12 mt-4">
                                    <h4 className="mb-3">Datos de la cita</h4>
                                    <div className="row">
                                      <div className="col-md-12">
                                        <p>
                                          Motivo:{" "}
                                          <span className="fw-bold">
                                            {
                                              expediente.preclinica.cita
                                                ?.motivo_cita
                                            }
                                          </span>
                                        </p>
                                      </div>
                                      <div className="col-md-6">
                                        <p>
                                          Fecha:{" "}
                                          <span className="fw-bold">
                                            {
                                              expediente.preclinica.cita
                                                ?.fecha
                                            }
                                          </span>
                                        </p>
                                      </div>
                                      <div className="col-md-6">
                                        <p>
                                          Hora:{" "}
                                          <span className="fw-bold">
                                          {moment(expediente.preclinica.cita?.hora, "HH:mm:ss").format("h:mm A")}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                    <Table
                                      pagination={false}
                                      bordered
                                      size="middle"
                                      columns={[
                                        {
                                          title: "Presión Arterial",
                                          dataIndex: "presion_arterial",
                                          key: "presion_arterial",
                                        },
                                        {
                                          title: "Frecuencia Cardíaca",
                                          dataIndex: "frecuencia_cardiaca",
                                          key: "frecuencia_cardiaca",
                                        },
                                        {
                                          title: "Frecuencia Respiratoria",
                                          dataIndex: "frecuencia_respiratoria",
                                          key: "frecuencia_respiratoria",
                                        },
                                        {
                                          title: "Temperatura",
                                          dataIndex: "temperatura",
                                          key: "temperatura",
                                        },
                                        {
                                          title: "Peso Actual",
                                          dataIndex: "peso_actual",
                                          key: "peso_actual",
                                        },
                                        {
                                          title: "Talla",
                                          dataIndex: "talla",
                                          key: "talla",
                                        },
                                        {
                                          title: "Glucometría",
                                          dataIndex: "glucometria",
                                          key: "glucometria",
                                        },
                                      ]}
                                      dataSource={
                                        expediente?.preclinica
                                          ? [
                                              {
                                                ...expediente.preclinica,
                                                key: "1",
                                              },
                                            ]
                                          : []
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="col-12">
                              {expediente?.diagnosticos?.length === 0 ? (
                                <div>
                                  <p className="text-center fw-bold p-2">
                                    {mensaje ||
                                      "No hay diagnósticos registrados."}
                                  </p>
                                  <Link
                                    to="/consultalista"
                                    className="text-center d-block"
                                  >
                                    Regresar
                                  </Link>
                                </div>
                              ) : (
                                <table className="table table-striped">
                                  <thead>
                                    <tr>
                                      <th>Fecha cita</th>
                                      <th>Hora</th>
                                      <th>Historia enfermedad</th>
                                      <th>Diagnóstico</th>
                                      <th>Receta</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {expediente.diagnosticos.map((consulta) => (
                                      <tr key={consulta.id_diagnostico}>
                                        <td>
                                          {formatearFecha(
                                            expediente.cita?.fecha
                                          )}
                                        </td>
                                        <td>
                                          {formatearHora(expediente.cita?.hora)}
                                        </td>
                                        <td>{consulta.historia_enfermedad}</td>
                                        <td>{consulta.diagnostico}</td>
                                        <td>{consulta.receta}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </>
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
    </>
  );
};

export default Expediente;
