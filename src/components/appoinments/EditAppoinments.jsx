import React, { useState, useEffect } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { DatePicker } from "antd";
import FeatherIcon from "feather-icons-react";
import Select from "react-select";
import { TextField } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from 'axios';
import moment from 'moment';  // Importar moment.js

const EditAppoinments = () => {
  const [startTime, setStartTime] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [numeroIdentidad, setNumeroIdentidad] = useState("");
  const [motivoConsulta, setMotivoConsulta] = useState("");
  const [doctores, setDoctores] = useState([]);
  const [fecha, setFecha] = useState(moment());
  const [citaId, setCitaId] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams(); // Obtener el id de la cita desde la URL
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    getDoctores();
    const fetchData = async () => {
      try {
        const responseCita = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/obtener/cita/${id}`);
        const cita = responseCita.data;

        setNombre(cita.paciente.nombre_completo);
        setTelefono(cita.paciente.telefono);
        setNumeroIdentidad(cita.paciente.numero_identidad);
        setMotivoConsulta(cita.motivo_cita);

        // Asegurarse de que fecha sea un objeto moment
        console.log(cita);
        // setFecha(moment(new Date()));
        setStartTime(moment(cita.hora, "HH:mm").format("HH:mm"));

        setFecha(cita.fecha.split('T')[0]);
        setSelectedOption({
          value: cita.usuario.id_usuario,
          label: cita.usuario.nombre_de_usuario,
        });
      } catch (error) {
        console.error('Error al cargar la cita:', error);
        Swal.fire('Error', 'No se pudo cargar la cita', 'error');
      }
    };

    fetchData();
  }, [id]);

  async function getDoctores() {
    // Usuarios con rol 1 (doctores)
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/obtener/rol/1`;

    try {
      const { data } = await axios(url);

      const doctoresTransformed = data.map(doc => ({
        value: doc.id_usuario.toString(),
        label: doc.nombre_de_usuario,
      }));

      setDoctores(doctoresTransformed);
    } catch (error) {
      console.log(error);
    }

  }

  const handleSave = async () => {
    const selectedDate = new Date(fecha);
    const currentDate = new Date();
    selectedDate.setHours(selectedDate.getHours() + 6, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate < currentDate) {
      Swal.fire("Error", 'La fecha de la nueva cita no puede ser menor a la actual. Verifique', "error");
      return;
    }

    try {
      const updatedCita = {
        fecha: fecha,
        hora: startTime,
        motivo_cita: motivoConsulta,
      };

      // console.log(updatedCita);

      await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/actualizar/cita/${id}`, updatedCita);

      Swal.fire("Éxito", "Cita actualizada y reprogramada correctamente", "success");
      navigate("/CitasLista");
    } catch (error) {
      console.error("Error al guardar la cita:", error);
      Swal.fire("Error", "Hubo un problema al actualizar la cita", "error");
    }
  };


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
                  <li className="breadcrumb-item active">Editar Cita</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    <div className="row">
                      <div className="col-12">
                        <div className="form-heading">
                          <h4>Datos del paciente</h4>
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>Nombre <span className="login-danger">*</span></label>
                          <input
                            className="form-control"
                            type="text"
                            value={nombre}
                            readOnly
                            disabled
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
                            readOnly
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>Número de identidad <span className="login-danger">*</span></label>
                          <input
                            className="form-control"
                            type="text"
                            value={numeroIdentidad}
                            readOnly
                            disabled
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
                          <TextField
                            type="date"
                            className="form-control datetimepicker"
                            onChange={e => setFecha(e.target.value)}
                            value={fecha}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>Hora: <span className="login-danger">*</span></label>
                          <TextField
                            className="form-control"
                            type="time"
                            value={startTime}
                            onChange={(event) => setStartTime(event.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-4">
                      </div>

                      <div className="col-12 col-md-6 col-xl-6">
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
                        onClick={handleSave}
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
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
      </div>
    </div>
  );
};

export default EditAppoinments;


