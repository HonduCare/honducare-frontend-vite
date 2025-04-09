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
  // Crear contenedor oculto
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.width = "210mm";
  container.style.height = "297mm";
  container.style.padding = "20mm";
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
      <div style="margin-bottom: 30px; padding: 15px; background: #f8f9fa; border-radius: 5px;">
  <h2 style="font-size: 13pt; margin: 0 0 10px 0;">Datos Generales</h2>
  <div style="display: flex; flex-wrap: wrap; gap: 10px;">
    <div style="flex: 1 1 45%; font-size: 11pt; margin: 5px 0;">
      <strong>Nombre:</strong> ${data.paciente.nombre_completo}
    </div>
    <div style="flex: 1 1 45%; font-size: 11pt; margin: 5px 0;">
      <strong>Edad:</strong> ${data.paciente.edad} años
    </div>
    <div style="flex: 1 1 45%; font-size: 11pt; margin: 5px 0;">
      <strong>Sexo:</strong> ${data.paciente.tbl_sexo.descripcion}
    </div>
    <div style="flex: 1 1 45%; font-size: 11pt; margin: 5px 0;">
      <strong>Teléfono:</strong> ${data.paciente.telefono}
    </div>
    <div style="flex: 1 1 45%; font-size: 11pt; margin: 5px 0;">
      <strong>Dirección:</strong> ${data.paciente.direccion}
    </div>
    <div style="flex: 1 1 45%; font-size: 11pt; margin: 5px 0;">
      <strong>Correo Electrónico:</strong> ${data.paciente.correo_electronico}
    </div>
    <div style="flex: 1 1 45%; font-size: 11pt; margin: 5px 0;">
      <strong>Estado Civil:</strong> ${data.paciente.tbl_estado_civil.descripcion}
    </div>
    <div style="flex: 1 1 45%; font-size: 11pt; margin: 5px 0;">
      <strong>Ocupación:</strong> ${data.paciente.tbl_ocupacion.descripcion}
    </div>
  </div>
</div>

      <!-- Historia Familiar Patológica -->
      <h2 style="font-size: 13pt; margin-bottom: 10px;">Historia Familiar Patológica</h2>
      <table style="width: 100%; margin-bottom: 25px; border-collapse: collapse;">
        <thead>
          <tr style="background: #f8f9fa;">
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Patología</th>
            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Parentesco</th>
          </tr>
        </thead>
        <tbody>
          ${
            data.patologiasFamiliares.length > 0
              ? data.patologiasFamiliares
                  .map(
                    (pato) => `
                    <tr>
                      <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">${pato.patologia.descripcion || "No disponible"}</td>
                      <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">${pato.parentesco || "No disponible"}</td>
                    </tr>
                  `
                  )
                  .join("")
              : `<tr><td colspan="2" style="text-align: center; padding: 12px;">No hay datos disponibles</td></tr>`
          }
        </tbody>
      </table>

      <!-- Historia Personal Patológica -->
      <h2 style="font-size: 13pt; margin-bottom: 10px;">Historia Personal Patológica</h2>
      ${
        data.patologiasPersonales.length > 0
          ? data.patologiasPersonales
              .map(
                (patologia) => `
                <div style="margin-bottom: 10px;">
                  <p style="font-size: 11pt; margin: 5px 0;">Patología: ${patologia.tbl_patologia.descripcion || "No disponible"}</p>
                  <p style="font-size: 11pt; margin: 5px 0;">Medicamentos: ${patologia.medicamentos || "Ninguno"}</p>
                  <p style="font-size: 11pt; margin: 5px 0;">Dosis: ${patologia.dosis || "No disponible"}</p>
                  <p style="font-size: 11pt; margin: 5px 0;">Horario: ${patologia.horario || "No disponible"}</p>
                </div>
              `
              )
              .join("")
          : `<p style="text-align: center;">No hay datos disponibles</p>`
      }

      <!-- Antecedentes -->
      <h2 style="font-size: 13pt; margin-bottom: 10px;">Antecedentes</h2>
      ${
        data.antecedentes.length > 0
          ? data.antecedentes
              .map(
                (antecedente) => `
                <p style="font-size: 11pt; margin: 5px 0;">Nombre: ${antecedente.tbl_descripcion_antecedente.descripcion || "No disponible"}</p>
              `
              )
              .join("")
          : `<p style="text-align: center;">No hay datos disponibles</p>`
      }

      <!-- Hábitos Tóxicos -->
      <h2 style="font-size: 13pt; margin-bottom: 10px;">Hábitos Tóxicos</h2>
      ${
        data.habitosToxicos.length > 0
          ? data.habitosToxicos
              .map(
                (habito) => `
                <p style="font-size: 11pt; margin: 5px 0;">Nombre: ${habito.tbl_descripcion_habito.descripcion || "No disponible"}</p>
              `
              )
              .join("")
          : `<p style="text-align: center;">No hay datos disponibles</p>`
      }

      <!-- Historia Ginecobstétrica -->
      ${
        data.paciente.tbl_sexo.descripcion !== "Masculino"
          ? `
          <h2 style="font-size: 13pt; margin-bottom: 10px;">Historia Ginecobstétrica</h2>
          ${
            data.historiaGineco.length > 0
              ? data.historiaGineco
                  .map(
                    (historia) => `
                    <p style="font-size: 11pt; margin: 5px 0;">Nombre: ${historia.tbl_descripcion_ginecoobstretica.descripcion || "No disponible"}</p>
                  `
                  )
                  .join("")
              : `<p style="text-align: center;">No hay datos disponibles</p>`
          }
        `
          : ""
      }
    </div>
  `;

  try {
    // Convertir a imagen
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      width: 794,
      height: 1123,
      windowWidth: 794,
      windowHeight: 1123,
      backgroundColor: "#ffffff",
    });

    // Generar PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    pdf.addImage(canvas, "JPEG", 0, 0, 210, 297);
    pdf.save(`Reporte-${data.paciente.nombre_completo}.pdf`);
  } catch (error) {
    console.error("Error generando PDF:", error);
  } finally {
    document.body.removeChild(container);
  }
};