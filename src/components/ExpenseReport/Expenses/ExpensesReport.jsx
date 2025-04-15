/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { generarReportePDF } from "./GenerarPDF";
//import jsPDF from "jspdf";
import { Row, Col, List, Table } from "antd";
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

  async function getExpediente() {
    const url = `${API_URL}/obtener/expediente/${params.id}`;
    try {
      const { data } = await axios.get(url);
      console.log("Esta es la data del expediente: ", data);
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
        <div className="mb-4 mt-4">
          <h2 className="mb-4">Datos Generales</h2>
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
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th>Patología</th>
                <th>Parentesco</th>
              </tr>
            </thead>
            <tbody>
              {expediente?.patologiasFamiliares?.length > 0 ? (
                expediente.patologiasFamiliares.map((pato, index) => (
                  <tr key={index}>
                    <td>{pato?.patologia?.descripcion || "No disponible"}</td>
                    <td>{pato?.parentesco || "No disponible"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center">
                    No hay datos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <br />

        {/* Historia Personal Patológica */}
        <h2>Historia Personal Patológica</h2>
        {expediente?.patologiasPersonales?.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="thead-light">
                <tr>
                  <th>Patología</th>
                  <th>Medicamentos</th>
                  <th>Dosis</th>
                  <th>Horario</th>
                </tr>
              </thead>
              <tbody>
                {expediente.patologiasPersonales.map((patologia, index) => (
                  <tr key={index}>
                    <td>
                      {patologia?.patologia?.descripcion || "No disponible"}
                    </td>
                    <td>{patologia?.medicamentos || "Ninguno"}</td>
                    <td>{patologia?.dosis || "No disponible"}</td>
                    <td>
                      {patologia?.horario
                        ? new Date(
                            `1970-01-01T${patologia.horario}`
                          ).toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "No disponible"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No hay datos disponibles</p>
        )}
        <br />

        {expediente?.antecedentes?.length > 0 ? (
          <List
            header={<h3>Antecedentes</h3>}
            bordered
            dataSource={expediente.antecedentes}
            renderItem={(antecedente) => (
              <List.Item>
                <strong>{antecedente.descripcion_antecedente}:</strong>{" "}
                {antecedente.descripcion || "No disponible"}
              </List.Item>
            )}
          />
        ) : (
          <p>No hay datos disponibles</p>
        )}
        <br />

        {expediente.habitosToxicos?.length > 0 ? (
          <List
            header={<h3>Hábitos Tóxicos</h3>}
            bordered
            dataSource={expediente.habitosToxicos}
            renderItem={(habito) => (
              <List.Item>
                <strong>Descripción:</strong>{" "}
                {habito.descripcion || "No disponible"}
              </List.Item>
            )}
          />
        ) : (
          <p>No hay datos disponibles</p>
        )}
        <br />

        {/* Historia Ginecobstétrica */}
        {expediente?.paciente?.tbl_sexo?.descripcion !== "Masculino" && (
          <>
            {expediente?.historiaGineco?.length > 0 ? (
              <List
                header={<h3>Historia Ginecobstétrica</h3>}
                bordered
                dataSource={expediente.historiaGineco}
                renderItem={(historia) => (
                  <List.Item>
                    <strong>{historia.descripcion}:</strong> {historia.cantidad}
                  </List.Item>
                )}
              />
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
            backgroundColor: "#874695",
            color: "#FFF",
            border: "none",
            borderRadius: "5px",
            marginRight: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#874699")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#874695")}
        >
          Exportar a PDF
        </button>
      
        <button
          type="button"
          className="no-print btn-secondary"
          onClick={handlePrint}
          style={{
            backgroundColor: "#6c757d",
            color: "#FFF",
            border: "none",
            borderRadius: "5px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#5a6268")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#6c757d")}
        >
          Imprimir
        </button>
      </div>
      )}
    </div>
  );
};

export default ExpensesReport;
