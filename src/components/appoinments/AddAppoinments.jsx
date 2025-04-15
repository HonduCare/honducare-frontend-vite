/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import FeatherIcon from "feather-icons-react";
import Select from "react-select";
import { TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button } from "antd";
import Step1 from "../patients/Formularios/Step1";
import Swal from "sweetalert2";
import axios from "axios";
import createAuthHeaders from "../../helpers/createAuthHeaders";

const AddAppoinments = () => {
  const navigate = useNavigate();
  const [startTime, setStartTime] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [numeroIdentidad, setNumeroIdentidad] = useState("");
  const [motivoConsulta, setMotivoConsulta] = useState("");
  const [fecha, setFecha] = useState(null);
  const [disabedNombreTelefono, setDisabedNombreTelefono] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [pacienteSelect, setPacienteSelect] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [nuevoPacienteData, setNuevoPacienteData] = useState({
    nombre_completo: "",
    numero_identidad: numeroIdentidad,
    correo_electronico: "",
    telefono: "",
    id_sexo: null,
    fecha_nacimiento: "",
    edad: "",
    nacionalidad: null,
    id_documento: { value: 2, label: "Identidad" },
    id_ocupacion: null,
    id_estado_civil: null,
    direccion: "",
  });

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  // Validar si todos los campos están llenos
  useEffect(() => {
    if (
      numeroIdentidad &&
      nombre &&
      telefono &&
      motivoConsulta &&
      fecha &&
      startTime &&
      selectedOption
    ) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [
    numeroIdentidad,
    nombre,
    telefono,
    motivoConsulta,
    fecha,
    startTime,
    selectedOption,
  ]);

  // Buscar paciente por número de identidad
  const searchPaciente = () => {
    if (numeroIdentidad.length < 7) return;

    // Buscar en el hook de pacientes
    const pacienteEncontrado = pacientes.find(
      (paciente) => paciente.numero_identidad === numeroIdentidad
    );
    setPacienteSelect(pacienteEncontrado);

    if (pacienteEncontrado) {
      setNombre(pacienteEncontrado.nombre_completo || "");
      setTelefono(pacienteEncontrado.telefono || "");
      setDisabedNombreTelefono(true);
    } else {
      setNombre("");
      setTelefono("");
      setDisabedNombreTelefono(false); // ya no se usará
      setShowModal(true); // nuevo estado para mostrar modal
    }
  };

  const handleGuardarNuevoPaciente = async () => {
    const body = {
      nombre_completo: nuevoPacienteData.nombre_completo,
      numero_identidad: nuevoPacienteData.numero_identidad,
      correo_electronico: nuevoPacienteData.correo_electronico,
      telefono: nuevoPacienteData.telefono,
      id_sexo: nuevoPacienteData.id_sexo?.value,
      fecha_nacimiento: nuevoPacienteData.fecha_nacimiento,
      edad: nuevoPacienteData.edad,
      nacionalidad: nuevoPacienteData.nacionalidad?.value,
      id_documento: 2,
      id_ocupacion: nuevoPacienteData.id_ocupacion?.value,
      id_estado_civil: nuevoPacienteData.id_estado_civil?.value,
      direccion: nuevoPacienteData.direccion,
      patologiasFamiliares: [],
      patologiasPersonales: [],
      antecedentesHospitalarios: [],
      habitosToxicos: [],
      ginecobstetrica: [],
      como_se_entero: ""
    };

    try {
      const config = await createAuthHeaders();

      Swal.fire({
        title: "Registrar Paciente?",
        text: "Esta seguro de registar este nuevo paciente",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si"
      }).then(async (result) => {
        const { data } = await axios.post(
          `${API_URL}/crear/expediente`,
          body,
          config
        );
        setPacienteSelect(data);
        setNombre(data.nombre_completo);
        setTelefono(data.telefono);
        if (result.isConfirmed) {
          Swal.fire({
            title: "Registro Completo",
            text: "Se ha registrado al nuevo paciente",
            icon: "success"
          });

          await obtenerPacientes();
          setNuevoPacienteData({
            nombre_completo: "",
            numero_identidad: numeroIdentidad,
            correo_electronico: "",
            telefono: "",
            id_sexo: null,
            fecha_nacimiento: "",
            edad: "",
            nacionalidad: null,
            id_documento: { value: 2, label: "Identidad" },
            id_ocupacion: null,
            id_estado_civil: null,
            direccion: "",
          })
        }
      });
   

      setShowModal(false);
    } catch (error) {
      console.error("Error al guardar paciente:", error);
      Swal.fire("Error", "No se pudo guardar el paciente", "error");
    }
  };

  const createCita = async () => {
    try {
      const config = await createAuthHeaders();
      const url = `${API_URL}/crear/cita`;

      const body = {
        id_paciente: pacienteSelect?.id_paciente,
        id_estado_cita: 1,
        fecha: fecha,
        hora: startTime,
        motivo_cita: motivoConsulta,
        nombre: nombre,
        telefono: telefono,
        numero_identidad: numeroIdentidad,
        id_usuario: parseInt(selectedOption?.value),
      };
      console.log("Nueva cita: ", body)
      await axios.post(url, body, config);

      Swal.fire({
        icon: "success",
        title: "¡Cita agregada con éxito!",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/CitasLista");
      });
    } catch (error) {
      console.error("Error al crear la cita:", error);
      Swal.fire({
        icon: "error",
        title: "Error al crear cita",
        text: error.response?.data?.mensaje || "Error desconocido",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${API_URL}/obtener/rol/1`;
        const { data } = await axios.get(url);

        const doctoresTransformed = data.map((doc) => ({
          value: doc.id_usuario.toString(),
          label: doc.nombre_especialidad,
        }));

        setDoctores(doctoresTransformed);
      } catch (error) {
        console.error("Error al cargar doctores:", error);
      }
    };

 
    obtenerPacientes();
    fetchData();
  }, []);

  const obtenerPacientes = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/pacientes/`);
      setPacientes(data);
    } catch (error) {
      console.error("Error al obtener los pacientes:", error);
    }
  };


  return (
    <div>
      <Header />
      <Sidebar
        id="menu-item4"
        id1="menu-items4"
        activeClassName="add-appoinment"
      />
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="#">Agendar cita</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <FeatherIcon icon="chevron-right" />
                  </li>
                  <li className="breadcrumb-item active">Nueva Cita</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      createCita();
                    }}
                  >
                    <div className="row">
                      <div className="col-12">
                        <div className="form-heading">
                          <h4>Datos del paciente</h4>
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>
                            Número de identidad{" "}
                            <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            value={numeroIdentidad}
                            onChange={(e) => setNumeroIdentidad(e.target.value)}
                            onBlur={searchPaciente}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>
                            Nombre <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            value={nombre}
                            disabled={disabedNombreTelefono}
                            onChange={(e) => setNombre(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>
                            Teléfono <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            value={telefono}
                            disabled={disabedNombreTelefono}
                            onChange={(e) => setTelefono(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-heading">
                          <h4>Detalles de cita</h4>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>
                            Día <span className="login-danger">*</span>
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            onChange={(e) => setFecha(e.target.value)}
                            value={fecha}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>
                            Hora <span className="login-danger">*</span>
                          </label>
                          <TextField
                            className="form-control"
                            type="time"
                            value={startTime}
                            onChange={(event) =>
                              setStartTime(event.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>Doctor</label>
                          <Select
                            options={doctores}
                            onChange={setSelectedOption}
                            value={selectedOption}
                          />
                        </div>
                      </div>

                      <div className="col-10 col-sm-10">
                        <div className="form-group local-forms">
                          <label>
                            Motivo de Consulta{" "}
                            <span className="login-danger">*</span>
                          </label>
                          <textarea
                            className="form-control"
                            rows={3}
                            value={motivoConsulta}
                            onChange={(e) => setMotivoConsulta(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="doctor-submit text-end">
                      <button
                        type="submit"
                        className="btn btn-primary submit-form me-2"
                        disabled={isButtonDisabled}
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary cancel-form"
                        onClick={() => navigate("/CitasLista")}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          title="Registrar nuevo paciente"
          open={showModal}
          onCancel={() => setShowModal(false)}
          footer={[
            <Button key="cancelar" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>,
            <Button
              key="guardar"
              type="primary"
              onClick={handleGuardarNuevoPaciente}
            >
              Guardar
            </Button>,
          ]}
          width={900}
        >
          <Step1
            formData={nuevoPacienteData}
            setFormData={setNuevoPacienteData}
            edit={false}
          />
        </Modal>
      </div>
    </div>
  );
};

export default AddAppoinments;
