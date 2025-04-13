import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const FormularioPaciente = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [pacientes, setPacientes] = useState([]);

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
    const fetchPacientes = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/pacientes`
        );
        setPacientes(res.data);
      } catch (err) {
        console.error("Error al obtener pacientes:", err);
      }
    };
    fetchPacientes();
  }, []);

  const handleNext = () => {
    if (step === 1) {
      const {
        nombre_completo,
        numero_identidad,
        telefono,
        correo_electronico,
        direccion,
        fecha_nacimiento,
        id_sexo,
        nacionalidad,
        id_estado_civil,
        id_documento,
        id_ocupacion,
      } = formData;
     // console.log("Datos del paciente:", formData);

      if (
        !nombre_completo ||
        !numero_identidad ||
        !telefono ||
        !correo_electronico ||
        !direccion ||
        !fecha_nacimiento ||
        !id_sexo ||
        !nacionalidad ||
        !id_estado_civil ||
        !id_documento ||
        !id_ocupacion
      ) {
        Swal.fire({
          icon: "warning",
          title: "Campos incompletos",
          text: "Por favor complete todos los campos obligatorios.",
        });
        return;
      }

      const existsIdentidad = pacientes.find(
        (p) => p.numero_identidad === numero_identidad
      );
      const existsTelefono = pacientes.find((p) => p.telefono === telefono);
      const existsCorreo = pacientes.find(
        (p) => p.correo_electronico === correo_electronico
      );

      if (existsIdentidad) {
        Swal.fire({
          icon: "error",
          title: "Identidad duplicada",
          text: `La identidad ya está registrada para ${existsIdentidad.nombre_completo}`,
        });
        return;
      }

      if (existsTelefono) {
        Swal.fire({
          icon: "error",
          title: "Teléfono duplicado",
          text: `El teléfono ya está registrado para ${existsTelefono.nombre_completo}`,
        });
        return;
      }

      if (existsCorreo) {
        Swal.fire({
          icon: "error",
          title: "Correo duplicado",
          text: `El correo ya está registrado para ${existsCorreo.nombre_completo}`,
        });
        return;
      }
    }
    console.log("Paso siguiente:", step, formData);
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
   // console.log("Datos crudos:", formData);
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
        id_documento: formData.id_documento?.value,
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

    //  console.log("Datos a enviar:", payload);

      await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/crear/expediente`, payload);

      Swal.fire({
        icon: "success",
        title: "Expediente creado",
        text: "El expediente ha sido guardado correctamente.",
      });

      
      setFormData((prev) => ({
        ...prev,
        patologiasFamiliares: [],
        patologiasPersonales: [],
        antecedentesHospitalarios: [],
        habitosToxicos: [],
        ginecobstetrica: [],
      }));
      navigate("/PacienteLista");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: "Ocurrió un problema al enviar el expediente.",
      });
      console.error("Error al enviar:", error);
    }
  };

  return (
    <>
      <Header />
      <Sidebar
        id="menu-item2"
        id1="menu-items2"
        activeClassName="add-patient"
      />
      <div className="page-wrapper">
        <div className="content">
          <h2 className="mb-4">Paso {step}</h2>

          {step === 1 && (
            <Step1 formData={formData} setFormData={setFormData} edit={false} />
          )}
          {step === 2 && (
            <Step2
              formData={formData}
              setFormData={setFormData}
              onPrev={handlePrev}
            />
          )}
          {step === 3 && (
            <Step3
              formData={formData}
              setFormData={setFormData}
              onPrev={handlePrev}
            />
          )}
          {step === 4 && (
            <Step4
              formData={formData}
              setFormData={setFormData}
              onPrev={handlePrev}
            />
          )}
          {step === 5 &&
            formData.id_sexo?.label?.toLowerCase() === "femenino" && (
              <Step5
                formData={formData}
                setFormData={setFormData}
                onPrev={handlePrev}
              />
            )}
          {step === 5 &&
            formData.id_sexo?.label?.toLowerCase() !== "femenino" && (
              <Step6
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onPrev={handlePrev}
              />
            )}
          {step === 6 &&
            formData.id_sexo?.label?.toLowerCase() === "femenino" && (
              <Step6
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onPrev={handlePrev}
              />
            )}
          <div className="mt-4 d-flex justify-content-between pb-5">
            {step > 1 && step <= 6 && (
              <button className="btn btn-secondary" onClick={handlePrev}>
                Anterior
              </button>
            )}
            {step < 6 &&
              !(
                step === 5 &&
                formData.id_sexo.label.toLowerCase() !== "femenino"
              ) && (
                <button className="btn btn-primary" onClick={handleNext}>
                  Siguiente
                </button>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FormularioPaciente;
