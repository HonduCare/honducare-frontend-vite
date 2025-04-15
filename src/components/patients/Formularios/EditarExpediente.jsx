import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Para obtener el ID del expediente desde la URL
import Header from "../../Header";
import Sidebar from "../../Sidebar";
import Swal from "sweetalert2";
import axios from "axios";

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";

const EditarExpediente = () => {
  const navigate = useNavigate(); 
  const { id } = useParams(); 
  const [formData, setFormData] = useState({
    nombre_completo: "",
    numero_identidad: "",
    telefono: "",
    correo_electronico: "",
    direccion: "",
    fecha_nacimiento: "",
    edad: null,
    id_sexo: null,
    nacionalidad: null,
    id_estado_civil: null,
    id_documento: null,
    id_ocupacion: null,
    patologiasFamiliares: [],
    patologiasPersonales: [],
    antecedentesHospitalarios: [],
    habitosToxicos: [],
    ginecobstetrica: [],
    como_se_entero: "",
  });

  useEffect(() => {
    const fetchExpediente = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/obtener/expediente/${id}`);
        const expediente = res.data;
  
        console.log("Datos del expediente:", expediente);
  
        // Mapear los datos del expediente al formato esperado
        const dataFormateada= {
          nombre_completo: expediente.paciente.nombre_completo || "",
          numero_identidad: expediente.paciente.numero_identidad || "",
          telefono: expediente.paciente.telefono || "",
          correo_electronico: expediente.paciente.correo_electronico || "",
          direccion: expediente.paciente.direccion || "",
          fecha_nacimiento: expediente.paciente.fecha_nacimiento || "",
          edad: expediente.paciente.edad || null,
          id_sexo: expediente.paciente.tbl_sexo
            ? { value: expediente.paciente.tbl_sexo.id_sexo, label: expediente.paciente.tbl_sexo.descripcion }
            : null,
          nacionalidad: expediente.paciente.nacionalidad
            ? { value: expediente.paciente.nacionalidad, label: expediente.paciente.nacionalidad }
            : null,
          id_estado_civil: expediente.paciente.tbl_estado_civil
            ? { value: expediente.paciente.tbl_estado_civil.id_estado_civil, label: expediente.paciente.tbl_estado_civil.descripcion }
            : null,
          id_documento: null, // No está presente en los datos proporcionados
          id_ocupacion: expediente.paciente.tbl_ocupacion
            ? { value: expediente.paciente.tbl_ocupacion.id_ocupacion, label: expediente.paciente.tbl_ocupacion.descripcion }
            : null,
          patologiasFamiliares: expediente.patologiasFamiliares.map((item) => ({
            id_patologia: item.patologia.id_patologia,
            patologia: item.patologia.descripcion,
            tipo: "familiar",
            parentesco: item.parentesco,
          })),
          patologiasPersonales: expediente.patologiasPersonales.map((item) => ({
            id_patologia: item.patologia.id_patologia,
            patologia: item.patologia.descripcion,
            tipo: "personal",
            medicamentos: item.medicamentos,
            dosis: item.dosis,
            horario: item.horario,
          })),
          antecedentesHospitalarios: expediente.antecedentes.map((item) => ({
            id_descripcion_antecedente: item.id_descripcion_antecedente,
            antecedente: item.descripcion_antecedente || "N/A",
            descripcion: item.descripcion || "",
          })),
          habitosToxicos: expediente.habitosToxicos.map((item) => ({
            id_descripcion_habitos: item.id_descripcion_habitos,
            descripcion: item.descripcion || "N/A",
          })),
          ginecobstetrica: expediente.historiaGineco.map((item) => ({
            id_descripcion_ginecoobstetrica: item.id_descripcion_ginecoobstetrica,
            descripcion: item.descripcion || "N/A",
            cantidad: item.cantidad 
          })),
          como_se_entero: expediente.paciente.como_se_entero
            ? { value: expediente.paciente.como_se_entero, label: expediente.paciente.como_se_entero }
            : "",
        };
        setFormData(dataFormateada);
        console.log("Data formateada:", dataFormateada);
      } catch (err) {
        console.error("Error al cargar el expediente:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los datos del expediente.",
        });
      }
    };
  
    fetchExpediente();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const payload = {
        nombre_completo: formData.nombre_completo,
        numero_identidad: formData.numero_identidad,
        telefono: formData.telefono,
        correo_electronico: formData.correo_electronico,
        direccion: formData.direccion,
        fecha_nacimiento: formData.fecha_nacimiento,
        edad: formData.edad,
        nacionalidad: formData.nacionalidad?.label,
        id_estado_civil: formData.id_estado_civil?.value,
        id_sexo: formData.id_sexo?.value,
        id_ocupacion: formData.id_ocupacion?.value,
        patologiasFamiliares: formData.patologiasFamiliares,
        patologiasPersonales: formData.patologiasPersonales,
        antecedentesHospitalarios: formData.antecedentesHospitalarios,
        habitosToxicos: formData.habitosToxicos,
        ginecobstetrica: formData.ginecobstetrica,
        como_se_entero: formData.como_se_entero.value,
      };

     // console.log("Datos a enviar:", payload);

      await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/actualizar/expediente/${id}`, payload);

      Swal.fire({
        icon: "success",
        title: "Expediente actualizado",
        text: "El expediente ha sido actualizado correctamente.",
      });
      navigate("/PacienteLista")
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: "Ocurrió un problema al actualizar el expediente.",
      });
      console.error("Error al enviar:", error);
    }
  };

  return (
    <>
      <Header />
      <Sidebar id="menu-item2" id1="menu-items2" activeClassName="edit-patient" />
      <div className="page-wrapper pb-5">
        <div className="content">
          <h2 className="mb-4">Editar Expediente</h2>

          {/* Renderizar todos los pasos en una sola página */}
          <Step1 formData={formData} setFormData={setFormData} edit={true} />
          <Step2 formData={formData} setFormData={setFormData} />
          <Step3 formData={formData} setFormData={setFormData} />
          <Step4 formData={formData} setFormData={setFormData} />
          {formData.id_sexo?.label?.toLowerCase() === "femenino" && (
            <Step5 formData={formData} setFormData={setFormData} />
          )}
          <Step6 formData={formData} setFormData={setFormData} onSubmit={handleSubmit} />
        </div>
      </div>
    </>
  );
};

export default EditarExpediente;