/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { removeComillas } from "../../helpers";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";

const ComoSeEntero = () => {
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState(null);

  const OPCIONES = [
    {
      value: 'Redes Sociales',
      label: 'Redes Sociales',
    },
    {
      value: 'Por un Familiar',
      label: 'Por un Familiar',
    },
    {
      value: 'Recomendación',
      label: 'Recomendación',
    },
    {
      value: 'Publicidad',
      label: 'Publicidad',
    },
    {
      value: 'Otros',
      label: 'Otros',
    },
  ];

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
  
  const handleSave = async () => {
    try {
      // Obtener los datos del localStorage
      const address = localStorage.getItem('address');
      const birthDate = localStorage.getItem('birthDate');
      const age = localStorage.getItem('age');
      const email = localStorage.getItem('email');
      const name = localStorage.getItem('name');
      const identidad = localStorage.getItem('identidad');
      const phone = localStorage.getItem('phone');
      const selectedCivilStatus = JSON.parse(localStorage.getItem('selectedCivilStatus'));
      const selectedDocumentType = JSON.parse(localStorage.getItem('selectedDocumentType'));
      const selectedGender = JSON.parse(localStorage.getItem('selectedGender'));
      const selectedNationality = JSON.parse(localStorage.getItem('selectedNationality'));
      const selectedOccupation = JSON.parse(localStorage.getItem('selectedOccupation'));
      const addedPatologias = localStorage.getItem('addedPatologias') ? JSON.parse(localStorage.getItem('addedPatologias')) : [];
      const addedAntecedentes = localStorage.getItem('addedAntecedentes') ? JSON.parse(localStorage.getItem('addedAntecedentes')) : [];
      const addedHTLS = localStorage.getItem('addedHT') ? JSON.parse(localStorage.getItem('addedHT')) : [];

      // Transformacion de arreglos de LS para enviar al backend los valores esperados y almacenarlos correctamente
      const addedHT = addedHTLS.map(habito => ({
        id_descripcion_habitos: habito.value,
        label: habito.label,
      }));

      const data = {
        nombre_completo: removeComillas(name),
        edad: Number(removeComillas(age)),
        numero_identidad: removeComillas(identidad),
        age: Number(removeComillas(age)),
        nacionalidad: selectedNationality.label,
        telefono: Number(removeComillas(phone)),
        id_documento: selectedDocumentType.value,
        correo_electronico: removeComillas(email),
        direccion: removeComillas(address),
        id_estado_civil: selectedCivilStatus.value,
        id_sexo: selectedGender.value,
        id_ocupacion: selectedOccupation.value,
        patologiasFamiliares: addedPatologias.filter(item => item.tipo === "Familiar"),
        patologiasPersonales: addedPatologias.filter(item => item.tipo === "Personal"),
        antecedentesHospitalarios: addedAntecedentes,
        habitosToxicos: addedHT,
        como_se_entero: selectedOption.value,
      }

      // console.log(data);

      // Llamada al backend para crear expediente
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/crear/expediente`, data);

      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: '¡Expediente Completado con Éxito!',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          // Eliminar toda la informacion de localStorage para que este limpio al agregar un nuevo paciente.
          localStorage.removeItem('address');
          localStorage.removeItem('birthDate');
          localStorage.removeItem('age');
          localStorage.removeItem('email');
          localStorage.removeItem('name');
          localStorage.removeItem('identidad');
          localStorage.removeItem('phone');
          localStorage.removeItem('selectedCivilStatus');
          localStorage.removeItem('selectedDocumentType');
          localStorage.removeItem('selectedGender');
          localStorage.removeItem('selectedNationality');
          localStorage.removeItem('selectedOccupation');
          localStorage.removeItem('addedPatologias');
          localStorage.removeItem('addedAntecedentes');
          localStorage.removeItem('addedHT');
          localStorage.removeItem('historiasGinecobstetricas');

          navigate('/PacienteLista');
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: error.response.data.error,
        text: `Hubo un error al guardar los datos. Intenta nuevamente. ${error.response.data.details}`,
      });
    }
  }

  return (
    <div>
      <Header />
      <Sidebar
        id="menu-item2"
        id1="menu-items2"
        activeClassName="add-patient"
      />
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="#">Pacientes</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right">
                      <FeatherIcon icon="chevron-right" />
                    </i>
                  </li>
                  <li className="breadcrumb-item active">¿Como se entero?</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form>
                    <div className="row">
                      <div className="col-12">
                        <div className="form-heading">
                          <h4>¿Como se entero de la clinica?</h4>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>
                            Seleccione una opción <span className="login-danger">*</span>
                          </label>
                          <Select
                            value={selectedOption}
                            onChange={setSelectedOption}
                            options={OPCIONES}
                            id="search-commodity"
                            components={{
                              IndicatorSeparator: () => null,
                            }}
                            styles={{
                              control: (baseStyles, state) => ({
                                ...baseStyles,
                                borderColor: state.isFocused
                                  ? "none"
                                  : "2px solid rgba(46, 55, 164, 0.1);",
                                boxShadow: state.isFocused
                                  ? "0 0 0 1px #41c1ef"
                                  : "none",
                                "&:hover": {
                                  borderColor: state.isFocused
                                    ? "none"
                                    : "2px solid rgba(46, 55, 164, 0.1)",
                                },
                                borderRadius: "10px",
                                fontSize: "14px",
                                minHeight: "45px",
                              }),
                              dropdownIndicator: (base, state) => ({
                                ...base,
                                transform: state.selectProps.menuIsOpen
                                  ? "rotate(-180deg)"
                                  : "rotate(0)",
                                transition: "250ms",
                                width: "35px",
                                height: "35px",
                              }),
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="doctor-submit text-end">
                          <button
                            type="button"
                            className="btn btn-primary cancel-form me-2"
                            onClick={handleSave}
                          >
                            <Link className="nav-link" to='#'>
                              Guardar
                            </Link>
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary cancel-form"
                          >
                            <Link className="nav-link" to="/antecedentes">
                              Anterior
                            </Link>
                          </button>
                        </div>
                      </div>
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

export default ComoSeEntero;