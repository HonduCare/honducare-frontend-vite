import React, { useState, useEffect } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { DatePicker } from "antd";
import FeatherIcon from "feather-icons-react";
import Select from "react-select";
import { TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from 'axios';
import createAuthHeaders from "../../helpers/createAuthHeaders";

const AddAppoinments = () => {
  const navigate = useNavigate();

  const [startTime, setStartTime] = useState("");
  const [doctores, setDoctores] = useState([]);
  const [selectedOption, setSelectedOption] = useState({
    value: '1',
    label: '',
  });
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [numeroIdentidad, setNumeroIdentidad] = useState("");
  const [motivoConsulta, setMotivoConsulta] = useState("");
  const [especialidadDoctor, setEspecialidadDoctor] = useState('');
  const [fecha, setFecha] = useState(null);
  const [disabedNombreTelefono, setDisabedNombreTelefono] = useState(true);

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  async function searchPaciente() {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/pacientes/${numeroIdentidad}?filter=identidad`;

    if (numeroIdentidad.length < 7) return;

    try {
      const { data } = await axios(url);

      if (data.length == 0) {
        setNombre('');
        setTelefono('');
        setDisabedNombreTelefono(false);
      }

      if (data.nombre_completo) {
        setNombre(data.nombre_completo);
        setTelefono(data.telefono);
        setDisabedNombreTelefono(true);
        return data;
      }
    } catch (error) {
      setDisabedNombreTelefono(false);
      console.log(error);
    }

  }

  async function crearPaciente() {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/pacientes`;

    const config = createAuthHeaders();

    try {
      const { data } = await axios.post(url, {
        nombre,
        identidad: numeroIdentidad,
        telefono,
      }, config);

      return data;
    } catch (error) {
      console.error('Error al crear paciente:', error);
    }
  }

  const createCita = async () => {
    let paciente;

    // Si nombre y telefono están deshabilitados, busca al paciente
    if (disabedNombreTelefono) {
      paciente = await searchPaciente();
    } else {
      // Si no, crea el paciente
      paciente = await crearPaciente();
    }

    const config = createAuthHeaders();

    try {
      const url = `${import.meta.env.VITE_REACT_APP_API_URL}/crear/cita`;
      const fechaUTC = new Date(fecha);

      const body = {
        id_paciente: paciente.id_paciente,
        id_estado_cita: 1,
        fecha: `${fechaUTC.getFullYear()}-${fechaUTC.getMonth() + 1
          }-${fechaUTC.getDate().toString().length === 1
            ? `0${fechaUTC.getDate()}`
            : fechaUTC.getDate()
          }`,
        hora: startTime,
        motivo_cita: motivoConsulta,
        nombre: nombre,
        telefono: telefono,
        numero_identidad: numeroIdentidad,
        id_usuario: selectedOption?.value,
      };

      console.log('Datos enviados:', body);

      const { data } = await axios.post(url, body, config);
      console.log(data);

      Swal.fire({
        icon: 'success',
        title: '¡Cita agregada con éxito!',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate('/CitasLista');
      });
    } catch (error) {
      console.error('Error al crear la cita:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al crear cita',
        text: error.response?.data?.mensaje
          ? error.response.data.mensaje
          : error.response?.data?.message || 'Error desconocido',
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${import.meta.env.VITE_REACT_APP_API_URL}/obtener/rol/1`;
        const { data } = await axios.get(url);

        const doctoresTransformed = data.map((doc) => ({
          value: doc.id_usuario.toString(),
          label: doc.nombre_especialidad,
        }));

        setDoctores(doctoresTransformed);

      } catch (error) {
        console.error('Error al cargar doctores:', error);
      }
    };

    fetchData();
  }, []);


  return (
    <div>
      <Header />
      <Sidebar id="menu-item4" id1="menu-items4" activeClassName="add-appoinment" />
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
                  <form onSubmit={(e) => { e.preventDefault(); createCita(); }}>
                    <div className="row">
                      <div className="col-12">
                        <div className="form-heading">
                          <h4>Datos del paciente</h4>
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>Número de identidad <span className="login-danger">*</span></label>
                          <input
                            className="form-control"
                            type="text"
                            value={numeroIdentidad}
                            onChange={(e) => setNumeroIdentidad(e.target.value)}
                            onInput={() => {
                              setTimeout(() => {
                                searchPaciente();
                              }, 1000);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>Nombre <span className="login-danger">*</span></label>
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
                          <label>Teléfono <span className="login-danger">*</span></label>
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
                        <div className="form-group local-forms cal-icon">
                          <label>Día <span className="login-danger">*</span></label>
                          <DatePicker
                            className="form-control datetimepicker"
                            onChange={setFecha}
                            value={fecha}
                            suffixIcon={null}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>Hora <span className="login-danger">*</span></label>
                          <TextField
                            className="form-control"
                            type="time"
                            value={startTime}
                            onChange={(event) => setStartTime(event.target.value)}
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
                        {/* {especialidadDoctor ? (
                          <p style={{ marginTop: '-20px' }}>Especialidad: <span className="fw-bold">{especialidadDoctor}</span></p>
                        ) : null} */}
                      </div>

                      <div className="col-10 col-sm-10">
                        <div className="form-group local-forms">
                          <label>Motivo de Consulta <span className="login-danger">*</span></label>
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
                        type="button"
                        className="btn btn-primary submit-form me-2"
                        onClick={createCita}
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary cancel-form"
                        onClick={() => navigate('/CitasLista')}
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
      </div>
    </div>
  );
};

export default AddAppoinments;
