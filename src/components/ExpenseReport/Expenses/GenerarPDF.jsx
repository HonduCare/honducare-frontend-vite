import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import FullColorHorizontal from "../../../assets/img/FullColorHorizontal.png";

const formatDate = () => {
  try {
    return format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es });
  } catch (error) {
    console.error(error);
    return "Fecha inválida";
  }
};

export const generarReportePDF = async (data) => {

  console.log("Data entrante: ", data)
  // Crear contenedor oculto
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.width = "210mm"; // Ancho A4
  container.style.minHeight = "279mm";
  container.style.padding = "10mm"
  container.style.background = "#ffffff";
  container.style.fontFamily = "Arial, sans-serif";
  container.style.color = "#000000";
  container.style.lineHeight = "1.5";

  document.body.appendChild(container);

  // Generar contenido del PDF
  container.innerHTML = `
    <div style="width: 100%; height: 100%; background: #ffffff; color: #000000;">
      <!-- Encabezado -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div style="flex: 1;">
          <h1 style="font-size: 24pt; margin: 0 0 10px 0;">Expediente</h1>
          <p style="font-size: 14pt; margin: 0 0 5px 0;">Paciente: ${data.paciente.nombre_completo}</p>
          <p style="font-size: 12pt;">Fecha de emisión: ${formatDate()}</p>
        </div>
        <div style="flex: 1; text-align: right;">
          <img src="${FullColorHorizontal}" alt="Logo" style="width: 150px; height: auto;" />
        </div>
      </div>

      <!-- Datos Generales -->
      ${generateSection("Datos Generales", generateGeneralData(data.paciente))}

      <!-- Historia Familiar Patológica -->
      ${generateSection(
        "Historia Familiar Patológica",
        generateTable(data.patologiasFamiliares, ["Patología", "Parentesco"], ["patologia.descripcion", "parentesco"])
      )}

      <!-- Historia Personal Patológica -->
      ${generateSection(
        "Historia Personal Patológica",
        generateTable(data.patologiasPersonales, ["Patología", "Medicamentos", "Dosis", "Horario"], [
          "tbl_patologia.descripcion",
          "medicamentos",
          "dosis",
          "horario",
        ])
      )}

      <!-- Antecedentes -->
      ${generateSection(
        "Antecedentes",
        generateTable(data.antecedentes, ["Antecedente", "Descripcion"], ["descripcion_antecedente", "descripcion"]),
      )}

      <!-- Hábitos Tóxicos -->
      ${generateSection(
        "Hábitos Tóxicos",
        generateList(data.habitosToxicos, "descripcion")
      )}

      <!-- Historia Ginecobstétrica -->
      ${
        data.paciente.tbl_sexo.descripcion !== "Masculino"
          ? generateSection(
              "Historia Ginecobstétrica",
              generateTable(data.historiaGineco, ["Historia", "Cantidad"], ["descripcion", "cantidad"]),
            )
          : ""
      }
    </div>
  `;

  try {
    await new Promise((resolve) => {
      const img = container.querySelector("img");
      if (!img) return resolve();
      if (img.complete) return resolve();
      img.onload = resolve;
      img.onerror = resolve;
    });
  
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
  
    const pdf = new jsPDF("p", "mm", "a4");
  
    const pageWidth = 210;
    const pageHeight = 297;
  
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
  
    const imgWidth = pageWidth;
    const pxPerMm = canvasWidth / pageWidth;
    const pageHeightPx = pxPerMm * pageHeight;
  
    let renderedHeight = 0;
    let pageIndex = 0;
  
    while (renderedHeight < canvasHeight) {
      const sliceHeight = Math.min(pageHeightPx, canvasHeight - renderedHeight);
  
      if (sliceHeight <= 0) break; // evita pasar height = 0
  
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvasWidth;
      pageCanvas.height = sliceHeight;
  
      const context = pageCanvas.getContext("2d");
      context.drawImage(
        canvas,
        0,
        renderedHeight,
        canvasWidth,
        sliceHeight,
        0,
        0,
        canvasWidth,
        sliceHeight
      );
  
      const imgData = pageCanvas.toDataURL("image/jpeg", 1.0);
  
      if (pageIndex > 0) pdf.addPage();
      const sliceHeightMm = sliceHeight / pxPerMm;
  
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, sliceHeightMm);
  
      renderedHeight += sliceHeight;
      pageIndex++;
    }
  
    pdf.save(`Reporte-${data.paciente.nombre_completo}.pdf`);
  } catch (error) {
    console.error("Error generando PDF:", error);
  } finally {
    document.body.removeChild(container);
  }
};

// Función para generar una sección
const generateSection = (title, content) => {
  return `
    <div style="margin-bottom: 30px;">
      <h2 style="font-size: 13pt; margin-bottom: 10px;">${title}</h2>
      ${content}
    </div>
  `;
};

// Función para generar datos generales
const generateGeneralData = (paciente) => {
  return `
    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
      ${generateDataRow("Nombre", paciente.nombre_completo)}
      ${generateDataRow("Edad", `${paciente.edad} años`)}
      ${generateDataRow("Sexo", paciente.tbl_sexo.descripcion)}
      ${generateDataRow("Teléfono", paciente.telefono)}
      ${generateDataRow("Dirección", paciente.direccion)}
      ${generateDataRow("Correo Electrónico", paciente.correo_electronico)}
      ${generateDataRow("Estado Civil", paciente.tbl_estado_civil.descripcion)}
      ${generateDataRow("Ocupación", paciente.tbl_ocupacion.descripcion)}
    </div>
  `;
};

// Función para generar una fila de datos
const generateDataRow = (label, value) => {
  return `
    <div style="flex: 1 1 45%; font-size: 11pt; margin: 5px 0;">
      <strong>${label}:</strong> ${value || "No disponible"}
    </div>
  `;
};

// Función para generar una tabla
const generateTable = (data, headers, keys) => {
  if (!data || data.length === 0) {
    return `<p style="text-align: center;">No hay datos disponibles</p>`;
  }

  const headerRow = headers
    .map((header) => `<th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">${header}</th>`)
    .join("");

  const bodyRows = data
    .map((item) => {
      const row = keys
        .map((key) => {
          const value = key.split(".").reduce((acc, curr) => acc && acc[curr], item);
          return `<td style="padding: 12px; border-bottom: 1px solid #dee2e6;">${value || "No disponible"}</td>`;
        })
        .join("");
      return `<tr>${row}</tr>`;
    })
    .join("");

  return `
    <table style="width: 100%; margin-bottom: 25px; border-collapse: collapse;">
      <thead>
        <tr style="background: #f8f9fa;">
          ${headerRow}
        </tr>
      </thead>
      <tbody>
        ${bodyRows}
      </tbody>
    </table>
  `;
};

// Función para generar una lista
const generateList = (data, key) => {
  if (!data || data.length === 0) {
    return `<p style="text-align: center;">No hay datos disponibles</p>`;
  }

  return data
    .map((item) => {
      const value = key.split(".").reduce((acc, curr) => acc && acc[curr], item);
      return `<p style="font-size: 11pt; margin: 5px 0;">${value || "No disponible"}</p>`;
    })
    .join("");
};