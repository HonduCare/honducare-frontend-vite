import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import FullColorHorizontal from '../../../assets/img/FullColorHorizontal.png';

const PreclinicaReport = () => {
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
                pdf.save('preclinica_report.pdf');
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
            <div ref={reportRef} style={{ border: '2px solid #000', borderRadius: '50px', padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Examen Físico</h3>
                    <p style={{ margin: '5px 0' }}><strong>Frecuencia cardíaca:</strong> 72 bpm</p>
                    <p style={{ margin: '5px 0' }}><strong>Temperatura:</strong> 36.7 °C</p>
                </div>
                <div>
                    <p style={{ margin: '28px 0 5px 0' }}><strong>Presión arterial:</strong> 120/80 mmHg</p>
                    <p style={{ margin: '5px 0' }}><strong>Peso actual:</strong> 70 kg</p>
                </div>
                <div>
                    <p style={{ margin: '28px 0 5px 0' }}><strong>Frecuencia Respiratoria:</strong> 16 rpm</p>
                    <p style={{ margin: '5px 0' }}><strong>Talla:</strong> 1.75 m</p>
                </div>
            </div>
            
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button onClick={handleExportPDF} style={{ marginRight: '10px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>Exportar a PDF</button>
                <button onClick={handlePrint} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>Imprimir</button>
            </div>
        </div>
    );
};

export default PreclinicaReport;


