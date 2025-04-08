import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Helpers/userContext";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import axios from "axios";
import Header from "../Header";
import Sidebar from "../Sidebar";

const Calender = () => {
  const { usuarioLogged } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // Estado para la cita seleccionada
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL; // Obtiene la URL base desde el .env
  // Función para obtener las citas del día
  const obtenerCitasDelDia = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/obtener/citas`
      );
      const citas = response.data.map((cita) => ({
        title: cita.paciente.nombre_completo,
        date: cita.fecha.split("T")[0],
        start: `${cita.fecha}T${cita.hora}`,
        end: `${cita.fecha}T${cita.hora}`,
        extendedProps: {
          motivo: cita.motivo_cita,
          id: cita.id_cita,
          paciente: cita.paciente,
        },
      }));

      setEvents(citas);
    } catch (error) {
      console.error("Error al obtener las citas:", error);
    }
  };

  // Abrir el modal con los datos de la cita seleccionada
  const handleEventClick = (info) => {
    setSelectedEvent(info.event.extendedProps); // Guardar datos extendidos
    setIsModalOpen(true); // Abrir modal
  };

  // Cerrar el modal
  const closeModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    obtenerCitasDelDia();
  }, []);

  return (
    <>
      <div className="main-wrapper">
        <Header />
        <Sidebar id="menu-item4" id1="menu-items4" activeClassName="calendar" />
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/CitasLista">Lista de citas</Link>
                    </li>
                  </ul>
                  <div className="col-auto text-end float-end ms-auto">
                    {usuarioLogged?.rol?.permisos.some(
                      (permiso) => permiso.nombre === "registrar"
                    ) && (
                      <Link to="/AgregarCita" className="btn btn-primary">
                        <i className="fas fa-plus m-1" /> Agendar Cita
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="card">
                  <div className="card-body">
                    <div id="calendar">
                      <FullCalendar
                        locale={esLocale}
                        plugins={[
                          dayGridPlugin,
                          timeGridPlugin,
                          interactionPlugin,
                        ]}
                        headerToolbar={{
                          left: "prev,next today",
                          center: "title",
                          right: "dayGridMonth,timeGridWeek",
                        }}
                        events={events}
                        eventTextColor="black"
                        eventClick={handleEventClick}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para mostrar los detalles de la cita */}
      {isModalOpen && selectedEvent && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles de la cita</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Paciente:</strong>{" "}
                  {selectedEvent.paciente.nombre_completo}
                </p>
                <p>
                  <strong>Teléfono:</strong> {selectedEvent.paciente.telefono}
                </p>
                <p>
                  <strong>Numero de identificación:</strong>{" "}
                  {selectedEvent.paciente.numero_identidad}
                </p>
                <p>
                  <strong>Motivo:</strong> {selectedEvent.motivo}
                </p>
              </div>
              <div className="modal-footer">
                {usuarioLogged?.rol?.permisos.some(
                  (permiso) => permiso.nombre === "actualizar"
                ) && (
                  <Link
                    to={`/EditCita/${selectedEvent.id}`}
                    className="btn btn-primary"
                  >
                    Editar Cita
                  </Link>
                )}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Calender;
