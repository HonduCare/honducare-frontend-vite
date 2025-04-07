import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import FullColorHorizontal from '../../../assets/img/FullColorHorizontal.png';

const DiagnosticReport = () => {
    const reportRef = useRef();

    const handlePrint = () => {
        window.print();
    };

    const handleExportPDF = () => {
        const input = reportRef.current;
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('diagnostic_report.pdf');
            })
            .catch((err) => console.error('Error generating PDF', err));
    };

    return (
        <div style={{ width: '100%', padding: '20px', fontFamily: 'Arial, sans-serif', color: '#000' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <img src={FullColorHorizontal} alt="HONDUCARE IPS" style={{ width: '200px', height: 'auto' }} />
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>HONDUCARE IPS</h1>
            </div>
            <br />

            <div ref={reportRef} style={{ border: '2px solid #000', borderRadius: '15px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ border: '2px solid #000', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px' }}>
                        <strong>SP:</strong>
                    </div>
                    <p style={{ margin: '0', fontSize: '18px' }}>Cefalea SP. Provicional</p>
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>HEA:</h3>
                    <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
                        Paciente masculino de 35 años que acude a consulta por presentar cefalea de inicio hace 3 días. 
                        Describe el dolor como de intensidad moderada, de tipo pulsátil, localizado en la región frontal, 
                        que aumenta con la exposición a la luz y se alivia parcialmente con el descanso. 
                        Refiere haber tomado analgésicos de venta libre sin obtener alivio completo. 
                        Niega otros síntomas asociados como fiebre, vómitos, o rigidez de nuca. 
                        No refiere antecedentes similares ni historial de migrañas. Se encuentra en aparente buen estado general, 
                        con signos vitales dentro de los rangos normales al momento de la evaluación.
                    </p>
                </div>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button onClick={handleExportPDF} style={{ marginRight: '10px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>Exportar a PDF</button>
                <button onClick={handlePrint} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>Imprimir</button>
            </div>
        </div>
    );
};

export default DiagnosticReport;



