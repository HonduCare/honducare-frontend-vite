/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { Link, useParams } from "react-router-dom";
import { formatearFecha, formatearHora } from "../../helpers";
import { Table, Select } from "antd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import FullColorHorizontal from "../../assets/img/FullColorHorizontal.png";

const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const Expediente = () => {
  const params = useParams();
  const [expediente, setExpediente] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const expedienteRef = useRef();

  const handleExportCitaPDF = (paciente, cita) => {
    const content = document.getElementById(`cita-${cita.id_cita}`);
    if (!content) return;

    const printButtons = content.querySelectorAll(".btn-imprimir-cita");
    printButtons.forEach((btn) => (btn.style.display = "none"));

    html2canvas(content, { useCORS: true, scale: 2 }).then((canvas) => {
      printButtons.forEach((btn) => (btn.style.display = "inline-block"));

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const logoWidth = pdfWidth * 0.4;
      const imgHeight = 20;
      const x = (pdfWidth - logoWidth) / 2;

      const pdfHeight = (canvas.height * (pdfWidth - 20)) / canvas.width;

      pdf.addImage(FullColorHorizontal, "PNG", x, 10, logoWidth, imgHeight);
      pdf.addImage(
        imgData,
        "PNG",
        10,
        imgHeight + 15,
        pdfWidth - 20,
        pdfHeight
      );
      pdf.save(`Cita_${paciente.nombre_completo}_${cita.fecha}.pdf`);
    });
  };

  async function getExpediente() {
    const url = `${
      import.meta.env.VITE_REACT_APP_API_URL
    }/obtener/antecedentes/${params.id}`;
    try {
      const { data } = await axios(url);
      setExpediente(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getExpediente();
  }, []);

  const availableYears = [
    ...new Set(expediente?.citas?.map((c) => parseInt(c.fecha.split("-")[0]))),
  ];

  const availableMonths = [
    ...new Set(
      expediente?.citas
        ?.filter(
          (c) =>
            !selectedYear || parseInt(c.fecha.split("-")[0]) === selectedYear
        )
        .map((c) => parseInt(c.fecha.split("-")[1]))
    ),
  ];

  const filteredCitas = expediente?.citas?.filter((c) => {
    const [year, month] = c.fecha.split("-").map(Number);
    return (
      (!selectedYear || year === selectedYear) &&
      (!selectedMonth || month === selectedMonth)
    );
  });

  return (
    <>
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
                  {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center w-100 py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="d-flex justify-content-between mb-2">
                        <h4>Datos del paciente</h4>
                      </div>

                      <div className="row">
                        <div className="col-md-4">
                          <p>
                            <strong>Nombre:</strong>{" "}
                            {expediente.paciente?.nombre_completo}
                          </p>
                          <p>
                            <strong>Identidad:</strong>{" "}
                            {expediente.paciente?.numero_identidad}
                          </p>
                          <p>
                            <strong>Edad:</strong> {expediente.paciente?.edad}
                          </p>
                        </div>
                        <div className="col-md-4">
                          <p>
                            <strong>Teléfono:</strong>{" "}
                            {expediente.paciente?.telefono}
                          </p>
                          <p>
                            <strong>Dirección:</strong>{" "}
                            {expediente.paciente?.direccion}
                          </p>
                          <p>
                            <strong>Correo:</strong>{" "}
                            {expediente.paciente?.correo_electronico}
                          </p>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label>Año</label>
                            <Select
                              allowClear
                              className="w-100"
                              placeholder="Seleccionar año"
                              value={selectedYear}
                              onChange={(value) => {
                                setSelectedYear(value);
                                setSelectedMonth(null);
                              }}
                            >
                              {availableYears.map((y) => (
                                <Select.Option key={y} value={y}>
                                  {y}
                                </Select.Option>
                              ))}
                            </Select>
                          </div>
                          <div>
                            <label>Mes</label>
                            <Select
                              allowClear
                              className="w-100"
                              placeholder="Seleccionar mes"
                              value={selectedMonth}
                              onChange={(value) => setSelectedMonth(value)}
                            >
                              {availableMonths.map((m) => (
                                <Select.Option key={m} value={m}>
                                  {meses[m - 1]}
                                </Select.Option>
                              ))}
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        {filteredCitas?.length === 0 ? (
                          <p className="fw-bold text-center">
                            No hay citas para el filtro seleccionado.
                          </p>
                        ) : (
                          filteredCitas.map((cita, idx) => (
                            <div
                              key={idx}
                              id={`cita-${cita.id_cita}`}
                              className="mb-5 border rounded p-3"
                            >
                              <div className="d-flex justify-content-between mb-2">
                                <h4 className="fw-bold">
                                  Cita del {formatearFecha(cita.fecha)} -{" "}
                                  {formatearHora(cita.hora)}
                                </h4>
                                <button
                                  className="btn btn-sm btn-outline-primary btn-imprimir-cita"
                                  onClick={() =>
                                    handleExportCitaPDF(
                                      expediente.paciente,
                                      cita
                                    )
                                  }
                                >
                                  Imprimir cita
                                </button>
                              </div>

                              <div className="mb-3">
                                <p>
                                  <strong>Paciente:</strong>{" "}
                                  {expediente.paciente.nombre_completo}
                                </p>
                                <p>
                                  <strong>Identidad:</strong>{" "}
                                  {expediente.paciente.numero_identidad}
                                </p>
                                <p>
                                  <strong>Edad:</strong>{" "}
                                  {expediente.paciente.edad}
                                </p>
                                <p>
                                  <strong>Teléfono:</strong>{" "}
                                  {expediente.paciente.telefono}
                                </p>
                              </div>

                              <p>
                                <strong>Motivo:</strong> {cita.motivo_cita}
                              </p>
                              <p>
                                <strong>Doctor:</strong>{" "}
                                {cita.usuario?.nombre_de_usuario}
                              </p>

                              {cita.preclinica && (
                                <>
                                  <h4 className="fw-bold mt-5">Preclínica</h4>
                                  <Table
                                    pagination={false}
                                    bordered
                                    size="middle"
                                    columns={[
                                      {
                                        title: "Presión Arterial",
                                        dataIndex: "presion_arterial",
                                      },
                                      {
                                        title: "Frec. Cardíaca",
                                        dataIndex: "frecuencia_cardiaca",
                                      },
                                      {
                                        title: "Frec. Respiratoria",
                                        dataIndex: "frecuencia_respiratoria",
                                      },
                                      {
                                        title: "Temperatura",
                                        dataIndex: "temperatura",
                                      },
                                      {
                                        title: "Peso",
                                        dataIndex: "peso_actual",
                                      },
                                      { title: "Talla", dataIndex: "talla" },
                                      {
                                        title: "Glucometría",
                                        dataIndex: "glucometria",
                                      },
                                    ]}
                                    dataSource={[
                                      { ...cita.preclinica, key: idx },
                                    ]}
                                  />
                                </>
                              )}

                              {cita.diagnosticos?.length > 0 && (
                                <>
                                  <h4 className="mt-4 fw-bold">Diagnóstico</h4>
                                  <table className="table table-striped">
                                    <thead>
                                      <tr>
                                        <th>Historia</th>
                                        <th>Diagnóstico</th>
                                        <th>Receta</th>
                                        <th>Examen Físico</th>
                                        <th>Indicaciones</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {cita.diagnosticos.map((d, i) => (
                                        <tr key={i}>
                                          <td>{d.historia_enfermedad}</td>
                                          <td>{d.diagnostico}</td>
                                          <td>{d.receta}</td>
                                          <td>{d.examen_fisico}</td>
                                          <td>{d.indicaciones}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </>
                  )}
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
