/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { generarReportePDF } from "./GenerarPDF";
//import jsPDF from "jspdf";
import { Row, Col, Table } from "antd";
//import html2canvas from "html2canvas";
import FullColorHorizontal from "../../../assets/img/FullColorHorizontal.png";
import { useParams } from "react-router-dom";
import axios from "axios";

const ExpensesReport = () => {
  const params = useParams();
  const [expediente, setExpediente] = useState({});
  const [loading, setLoading] = useState(true);
  const [showPrint, setShowPrint] = useState(true);
  const reportRef = useRef();
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  const handlePrint = async () => {
    setShowPrint(false);
    await window.print();
  };

{/*  const handleExportPDF = () => {
    const input = reportRef.current;

    html2canvas(input, {
      useCORS: true,
      scale: 2,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "png", 10, 10, pdfWidth - 20, pdfHeight - 20);
        pdf.save("expenses_report.pdf");
      })
      .catch((err) => console.error("Error generating PDF", err));
  };*/}

  async function getExpediente() {
    const url = `${API_URL}/obtener/expediente/${params.id}`;
    try {
      const { data } = await axios.get(url);
      setExpediente(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getExpediente();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          className="spinner"
          style={{
            width: "50px",
            height: "50px",
            border: "5px solid rgba(0, 0, 0, 0.1)",
            borderTop: "5px solid #007bff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "85%",
        padding: "20px",
        margin: "auto",
        fontFamily: "Arial, sans-serif",
        color: "#000",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img
          src={FullColorHorizontal}
          alt="HONDUCARE IPS"
          style={{ width: "200px", height: "auto" }}
        />
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>HONDUCARE IPS</h1>
      </div>
      <br />
      <div ref={reportRef}>
        {/* Datos Generales */}
        <div className="mb-4">
          <h2 className="text-center mb-4">Datos Generales</h2>
          <Row gutter={[0, 10]}>
            <Col xs={24} sm={12}>
              <p>
                <strong>Nombre y Apellidos:</strong>{" "}
                {expediente?.paciente?.nombre_completo || "No disponible"}
              </p>
            </Col>
            <Col xs={24} sm={12}>
              <p>
                <strong>Fecha de Nacimiento:</strong>{" "}
                {expediente?.paciente?.fecha_nacimiento || "No disponible"}
              </p>
            </Col>
            <Col xs={24} sm={12}>
              <p>
                <strong>Edad:</strong>{" "}
                {expediente?.paciente?.edad || "No disponible"} años
              </p>
            </Col>
            <Col xs={24} sm={12}>
              <p>
                <strong>Sexo:</strong>{" "}
                {expediente?.paciente?.tbl_sexo?.descripcion || "No disponible"}
              </p>
            </Col>
            <Col xs={24} sm={12}>
              <p>
                <strong>Teléfono:</strong>{" "}
                {expediente?.paciente?.telefono || "No disponible"}
              </p>
            </Col>
            <Col xs={24} sm={12}>
              <p>
                <strong>Número de identidad:</strong>{" "}
                {expediente?.paciente?.numero_identidad || "No disponible"}
              </p>
            </Col>
            <Col xs={24} sm={12}>
              <p>
                <strong>Estado Civil:</strong>{" "}
                {expediente?.paciente?.tbl_estado_civil?.descripcion ||
                  "No disponible"}
              </p>
            </Col>
            <Col xs={24} sm={12}>
              <p>
                <strong>Ocupación:</strong>{" "}
                {expediente?.paciente?.tbl_ocupacion?.descripcion ||
                  "No disponible"}
              </p>
            </Col>
            <Col xs={24} sm={12}>
              <p>
                <strong>Correo electrónico:</strong>{" "}
                {expediente?.paciente?.correo_electronico || "No disponible"}
              </p>
            </Col>
            <Col xs={24} sm={12}>
              <p>
                <strong>Dirección:</strong>{" "}
                {expediente?.paciente?.direccion || "No disponible"}
              </p>
            </Col>
          </Row>
        </div>

        {/* Historia Familiar Patológica */}
        <h2>Historia Familiar Patológica</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "5px" }}>
                Patología
              </th>
              <th style={{ border: "1px solid black", padding: "5px" }}>
                Parentesco
              </th>
            </tr>
          </thead>
          <tbody>
            {expediente?.patologiasFamiliares?.length > 0 ? (
              expediente.patologiasFamiliares.map((pato, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid black", padding: "5px" }}>
                    {pato?.patologia?.descripcion || "No disponible"}
                  </td>
                  <td style={{ border: "1px solid black", padding: "5px" }}>
                    {pato?.parentesco || "No disponible"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" style={{ textAlign: "center" }}>
                  No hay datos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <br />

        {/* Historia Personal Patológica */}
        <h2>Historia Personal Patológica</h2>
        {expediente?.patologiasPersonales?.length > 0 ? (
          expediente.patologiasPersonales.map((patologia, index) => (
            <div key={index}>
              <p>
                Patología:{" "}
                {patologia?.tbl_patologia?.descripcion || "No disponible"}
              </p>
              <p>Medicamentos: {patologia?.medicamentos || "Ninguno"}</p>
              <p>Dosis: {patologia?.dosis || "No disponible"}</p>
              <p>Horario: {patologia?.horario || "No disponible"}</p>
            </div>
          ))
        ) : (
          <p>No hay datos disponibles</p>
        )}
        <br />

        {/* Antecedentes */}
        <h2>Antecedentes</h2>
        {expediente?.antecedentes?.length > 0 ? (
          expediente.antecedentes.map((antecedente, index) =>
            antecedente.tbl_descripcion_antecedente ? (
              <p key={index}>
                Nombre: {antecedente.tbl_descripcion_antecedente.descripcion}
              </p>
            ) : (
              <p>No hay datos disponibles</p>
            )
          )
        ) : (
          <p>No hay datos disponibles</p>
        )}
        <br />

        {/* Hábitos Tóxicos */}
        <h2>Hábitos Tóxicos</h2>
        {expediente.habitosToxicos?.length > 0 ? (
          expediente.habitosToxicos.map((habito, index) =>
            habito.tbl_descripcion_habito ? (
              <p key={index}>
                Nombre: {habito.tbl_descripcion_habito.descripcion}
              </p>
            ) : (
              <p>No hay datos disponibles</p>
            )
          )
        ) : (
          <p>No hay datos disponibles</p>
        )}
        <br />

        {/* Historia Ginecobstétrica */}
        {expediente?.paciente?.tbl_sexo?.descripcion !== "Masculino" && (
          <>
            <h2>Historia Ginecobstétrica</h2>
            {expediente?.historiaGineco?.length > 0 ? (
              expediente.historiaGineco.map((historia, index) =>
                historia.tbl_descripcion_ginecoobstretica ? (
                  <p key={index}>
                    Nombre:{" "}
                    {historia.tbl_descripcion_ginecoobstretica.descripcion}
                  </p>
                ) : (
                  <p>No hay datos disponibles</p>
                )
              )
            ) : (
              <p>No hay datos disponibles</p>
            )}
          </>
        )}
      </div>

      {showPrint && (
        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <button
            type="button"
            onClick={() => generarReportePDF(expediente)}
            style={{
              color: "#FFF",
              marginRight: "10px",
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Exportar a PDF
          </button>

          <button
            type="button"
            className="no-print btn-secondary"
            onClick={handlePrint}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Imprimir
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpensesReport;
