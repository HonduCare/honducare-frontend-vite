import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from "sweetalert2";
import { formatearFecha, formatearHora } from "../../helpers";

// Exportar a PDF
import { pdficon } from '../imagepath';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Expediente = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [datosPaciente, setDatosPaciente] = useState({});
  const [historialConsultas, setHistorialConsultas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const expedienteRef = useRef();
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const handleExportPDF = (paciente) => {
    const input = expedienteRef.current;

    html2canvas(input, {
      useCORS: true, // Permite cargar imágenes externas si es necesario
      scale: 2, // Mejora la calidad de la imagen
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'png', 10, 10, pdfWidth - 20, pdfHeight - 20); // Aquí se aplica el padding en el PDF
        pdf.save(`Expediente de ${paciente.nombre_completo}.pdf`);
      })
      .catch((err) => console.error('Error generating PDF', err));
  };

  async function getExpediente() {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/obtener/antecedentes/${params.id}`;

    try {

      const { data } = await axios(url);

      setMensaje('');
      if (data.mensaje) {
        setMensaje(data.mensaje);
        return;
      }
      setHistorialConsultas(data);
      console.log(data);
      setIsLoading(false);

    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setMensaje(error.response.data.mensaje);
    }

  }

  useEffect(() => {
    getExpediente();
  }, []);

  if (isLoading) {
    return <p>Obteniendo información...</p>
  }

  return (
    <>
      <div>
        <Header />
        <Sidebar id='menu-item6' id1='menu-items6' activeClassName='examenfisico-list' />
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

                        {historialConsultas.length > 0 ? (
                          <div className="d-flex">
                            <div className="col-md-6">

                              <button
                                type="button"
                                onClick={() => handleExportPDF(historialConsultas[0].paciente)}
                              >
                                <img src={pdficon} alt="guardar pdf" />
                              </button>

                              <h4>Datos del paciente</h4>
                              <p>Nombre del paciente: <span className="fw-bold">{historialConsultas[0].paciente.nombre_completo}</span> </p>
                              <p>Identidad: <span className="fw-bold">{historialConsultas[0].paciente.numero_identidad}</span> </p>
                              <p>Número de telefono: <span className="fw-bold">{historialConsultas[0].paciente.telefono}</span> </p>
                            </div>
                          </div>
                        ) : null}

                        <div className="col-12">
                          {historialConsultas.length === 0 ? (
                            <div>
                              <p className="text-center fw-bold p-2">{mensaje}</p>
                              <Link to='/consultalista' className="text-center d-block">
                                Regresar
                              </Link>
                            </div>
                          ) : (
                            <table className="table table-striped">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Fecha de cita</th>
                                  <th>Hora de cita</th>
                                  <th>Historia de enfermedad</th>
                                  <th>Diagnostico</th>
                                  <th>Receta</th>
                                </tr>
                              </thead>
                              <tbody>
                                {historialConsultas.map(consulta => (
                                  <tr key={consulta.id_diagnostico}>
                                    <td>{consulta.id_diagnostico}</td>
                                    <td>{formatearFecha(consulta.cita.fecha)}</td>
                                    <td>{formatearHora(consulta.cita.hora)}</td>
                                    <td>{consulta.historia_enfermedad}</td>
                                    <td>{consulta.diagnostico}</td>
                                    <td>{consulta.receta}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>

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
