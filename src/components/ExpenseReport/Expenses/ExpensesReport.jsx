import React, { useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import FullColorHorizontal from '../../../assets/img/FullColorHorizontal.png';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ExpensesReport = () => {

  const params = useParams();

  const [expediente, setExpediente] = useState({});
  const [loading, setLoading] = useState(true);
  const [showPrint, setShowPrint] = useState(true);

  const reportRef = useRef();

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  const handlePrint = async () => {
    // console.log('Entramos a la funcion');
    setShowPrint(false);
    console.log(showPrint)
    await window.print();

  };

  const handleExportPDF = () => {
    const input = reportRef.current;

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
        pdf.save('expenses_report.pdf');
      })
      .catch((err) => console.error('Error generating PDF', err));
  };


  async function getExpediente() {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/obtener/expediente/${params.id}`;
    try {
      const { data } = await axios.get(url);
      console.log(data);
      setExpediente(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getExpediente();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner" style={{
          width: '50px',
          height: '50px',
          border: '5px solid rgba(0, 0, 0, 0.1)',
          borderTop: '5px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
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
    <div style={{ width: '70%', padding: '20px', margin: 'auto', fontFamily: 'Arial, sans-serif', color: '#000' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src={FullColorHorizontal} alt="HONDUCARE IPS" style={{ width: '200px', height: 'auto' }} />
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>HONDUCARE IPS</h1>
      </div>
      <br />
      <div ref={reportRef}>
        {/* Datos Generales */}
        <h2>Datos Generales</h2>
        <p>Nombre y Apellidos: {expediente?.paciente?.nombre_completo || 'No disponible'}</p>
        <p>Edad: {expediente?.paciente?.edad || 'No disponible'} años</p>
        <p>Sexo: {expediente?.paciente?.tbl_sexo?.descripcion || 'No disponible'}</p>
        <p>Teléfono: {expediente?.paciente?.telefono || 'No disponible'}</p>
        <p>Número de identidad: {expediente?.paciente?.numero_identidad || 'No disponible'}</p>
        <p>Estado Civil: {expediente?.paciente?.tbl_estado_civil?.descripcion || 'No disponible'}</p>
        <p>Ocupación: {expediente?.paciente?.tbl_ocupacion?.descripcion || 'No disponible'}</p>
        <p>Correo electrónico: {expediente?.paciente?.correo_electronico || 'No disponible'}</p>
        <p>Dirección: {expediente?.paciente?.direccion || 'No disponible'}</p>
        <br />

        {/* Historia Familiar Patológica */}
        <h2>Historia Familiar Patológica</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '5px' }}>Patología</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>Parentesco</th>
            </tr>
          </thead>
          <tbody>
            {expediente?.patologiasFamiliares?.length > 0 ? (
              expediente.patologiasFamiliares.map((pato, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black', padding: '5px' }}>{pato?.tbl_patologia?.descripcion || 'No disponible'}</td>
                  <td style={{ border: '1px solid black', padding: '5px' }}>{pato?.parentesco || 'No disponible'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" style={{ textAlign: 'center' }}>No hay datos disponibles</td>
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
              <p>Patología: {patologia?.tbl_patologia?.descripcion || 'No disponible'}</p>
              <p>Medicamentos: {patologia?.medicamentos || 'Ninguno'}</p>
              <p>Dosis: {patologia?.dosis || 'No disponible'}</p>
              <p>Horario: {patologia?.horario || 'No disponible'}</p>
            </div>
          ))
        ) : (
          <p>No hay datos disponibles</p>
        )}
        <br />

        {/* Antecedentes */}
        <h2>Antecedentes</h2>
        {expediente?.antecedentes?.length > 0 ? (
          expediente.antecedentes.map((antecedente, index) => (
            antecedente.tbl_descripcion_antecedente ? (
              <p key={index}>Nombre: {antecedente.tbl_descripcion_antecedente.descripcion}</p>
            ) : (
              <p>No hay datos disponibles</p>
            )
          ))
        ) : (
          <p>No hay datos disponibles</p>
        )}
        <br />

        {/* Hábitos Tóxicos */}
        <h2>Hábitos Tóxicos</h2>
        {expediente.habitosToxicos ? (
          expediente.habitosToxicos.map((habito, index) => (
            habito.tbl_descripcion_habito ? (
              <p key={index}>Nombre: {habito.tbl_descripcion_habito.descripcion}</p>
            ) : (
              <p>No hay datos disponibles</p>
            )
          ))
        ) : (
          <p>No hay datos disponibles</p>
        )}
        <br />

        {/* Historia Ginecobstétrica */}
        <h2>Historia Ginecobstétrica</h2>
        {expediente?.historiaGineco.length > 0 ? (
          expediente.historiaGineco.map((historia, index) => (
            historia.tbl_descripcion_ginecoobstretica ? (
              <p key={index}>Nombre: {historia.tbl_descripcion_ginecoobstretica.descripcion}</p>
            ) : (
              <p>No hay datos disponibles</p>
            )
          ))
        ) : (
          <p>No hay datos disponibles</p>
        )}
      </div>

      {showPrint && (
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button type='button' className='no-print btn-primary' onClick={handleExportPDF} style={{ color: '#FFF', marginRight: '10px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>Exportar a PDF</button>

          <button type='button' className='no-print btn-secondary' onClick={handlePrint} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>Imprimir</button>
        </div>
      )}


    </div>
  );
};

export default ExpensesReport;