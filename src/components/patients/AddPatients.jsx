import React, { useState, useEffect } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { DatePicker } from "antd";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import Select from "react-select";
import { Link, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import axios from "axios";
import moment from 'moment';
import { ViewAgendaOutlined } from "@mui/icons-material";

const AddPatients = () => {
  const navigate = useNavigate();

  const getLocalStorage = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  };

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  const [name, setName] = useState(getLocalStorage("name", ""));
  const [identidad, setIdentidad] = useState(getLocalStorage("identidad", ""));
  const [phone, setPhone] = useState(getLocalStorage("phone", ""));
  const [age, setAge] = useState(getLocalStorage("age", ""));
  const [email, setEmail] = useState(getLocalStorage("email", ""));
  const [address, setAddress] = useState(getLocalStorage("address", ""));
  const [birthDate, setBirthDate] = useState(getLocalStorage("birthDate", ""));
  const [selectedNationality, setSelectedNationality] = useState(getLocalStorage("selectedNationality", null));
  const [selectedDocumentType, setSelectedDocumentType] = useState(getLocalStorage("selectedDocumentType", null));
  const [selectedGender, setSelectedGender] = useState(getLocalStorage("selectedGender", null));
  const [selectedCivilStatus, setSelectedCivilStatus] = useState(getLocalStorage("selectedCivilStatus", null));
  const [selectedOccupation, setSelectedOccupation] = useState(getLocalStorage("selectedOccupation", null));

  const [occupationOptions, setOccupationOptions] = useState([]);
  const [civilStatusOptions, setCivilStatusOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);

  const nationalities = [
    { value: 1, label: "Seleccione su país" },
    { value: 2, label: "Hondureña" },
    { value: 3, label: "Extranjero" },
  ];

  const documentTypes = [
    { value: 2, label: "Identidad" },
    { value: 3, label: "Pasaporte" },
    { value: 4, label: "Licencia" },
  ];

  const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const handleChange = (key, setter) => (value) => {
    setter(value);
    saveToLocalStorage(key, value);
  };

  const onDateChange = (date, dateString) => {
    setBirthDate(dateString);
    saveToLocalStorage("birthDate", dateString);
  };

  const fetchData = async () => {
    try {
      const [occupationResponse, civilStatusResponse, genderResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/obtener/ocupaciones/ocupacion`),
        axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/obtener/estadoCivil/estadosCivil`),
        axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/obtener/sexo/sexos`),
      ]);

      setOccupationOptions(occupationResponse.data.map((item) => ({
        value: item.id_ocupacion,
        label: item.descripcion,
      })));

      setCivilStatusOptions(civilStatusResponse.data.map((item) => ({
        value: item.id_estado_civil,
        label: item.descripcion,
      })));

      setGenderOptions(genderResponse.data.map((item) => ({
        value: item.id_sexo,
        label: item.descripcion,
      })));
    } catch (error) {
      console.error("Error al cargar las opciones:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      borderColor: state.isFocused ? "none" : "2px solid rgba(46, 55, 164, 0.1);",
      boxShadow: state.isFocused ? "0 0 0 1px #41c1ef" : "none",
      borderRadius: "10px",
      fontSize: "14px",
      minHeight: "45px",
    }),
  };

  function validarForm() {
    if ([name, phone, email, age, address, birthDate, selectedCivilStatus, selectedDocumentType, selectedGender, selectedNationality].includes('')) {
      Swal.fire({
        icon: "error",
        title: "Campos obligatorios",
        text: 'Hay campos vacios obligatorios',
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Regresar',
        focusCancel: true,
        timer: 2000,
      });
      return;
    }
    navigate('/patologias-familiares');
  }

  function cancelarForm() {
    Swal.fire({
      icon: "warning",
      title: "¿Estas Seguro?",
      text: 'Si cancelas, perderas la información agregada hasta el momento',
      confirmButtonText: 'Si, Cancelar',
      showCancelButton: true,
      cancelButtonText: 'Regresar',
      focusCancel: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Si confirma de cancelar, se elimina las variables de localstorage almacenadas.
        localStorage.removeItem('name');
        localStorage.removeItem('phone');
        localStorage.removeItem('email');
        localStorage.removeItem('age');
        localStorage.removeItem('address');
        localStorage.removeItem('birthDate');
        localStorage.removeItem('selectedNationality');
        localStorage.removeItem('selectedDocumentType');
        localStorage.removeItem('selectedGender');
        localStorage.removeItem('selectedCivilStatus');
        localStorage.removeItem('selectedOccupation');
        navigate('/PacienteLista');
      }
    });
  }

  return (
    <div>
      <Header />
      <Sidebar id="menu-item2" id1="menu-items2" activeClassName="add-patient" />
      <div className="page-wrapper">
        <div className="content">
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
                  <li className="breadcrumb-item active">Agregar Paciente</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form>
                    <div className="row">
                      <div className="col-12">
                        <div className="form-heading">
                          <h4>Datos Generales del Paciente</h4>
                        </div>
                      </div>

                      <div className="form-group col-6 col-sm-6 local-forms">
                        <label>
                          Nombre Completo<span className="login-danger">*</span>
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            saveToLocalStorage("name", e.target.value);
                          }}
                        />
                      </div>
                      <div className="form-group col-6 col-sm-6 local-forms">
                        <label>
                          Identidad<span className="login-danger">*</span>
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          value={identidad}
                          onChange={(e) => {
                            setIdentidad(e.target.value);
                            saveToLocalStorage("identidad", e.target.value);
                          }}
                        />
                      </div>

                      {/* Nationality Select */}
                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>
                            Nacionalidad<span className="login-danger">*</span>
                          </label>
                          <Select
                            value={selectedNationality}
                            onChange={handleChange("selectedNationality", setSelectedNationality)}
                            options={nationalities}
                            components={{ IndicatorSeparator: () => null }}
                            styles={selectStyles}
                          />
                        </div>
                      </div>

                      {/* Document Type Select */}
                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>
                            Tipo Documento <span className="login-danger">*</span>
                          </label>
                          <Select
                            value={selectedDocumentType}
                            onChange={handleChange("selectedDocumentType", setSelectedDocumentType)}
                            options={documentTypes}
                            components={{ IndicatorSeparator: () => null }}
                            styles={selectStyles}
                          />
                        </div>
                      </div>

                      {/* Birth Date Picker */}
                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms cal-icon">
                          <label>
                            Fecha Nacimiento <span className="login-danger">*</span>
                          </label>
                          <DatePicker
                            className="form-control datetimepicker"
                            onChange={onDateChange}
                            value={birthDate ? moment(birthDate) : null}
                            suffixIcon={null}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>
                            Edad
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            value={age}
                            onChange={(e) => {
                              setAge(e.target.value);
                              saveToLocalStorage("age", e.target.value);
                            }}
                          />
                        </div>
                      </div>

                      {/* Gender Select */}
                      <div className="col-12 col-md-6 col-xl-2">
                        <div className="form-group local-forms">
                          <label>
                            Sexo <span className="login-danger">*</span>
                          </label>
                          <Select
                            value={selectedGender}
                            onChange={handleChange("selectedGender", setSelectedGender)}
                            options={genderOptions}
                            components={{ IndicatorSeparator: () => null }}
                            styles={selectStyles}
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="col-12 col-md-6 col-xl-2">
                        <div className="form-group local-forms">
                          <label>
                            Telefono <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            value={phone}  // Se enlaza el valor con el estado `phone`
                            onChange={(e) => {
                              setPhone(e.target.value);  // Actualiza el estado con el nuevo valor
                              saveToLocalStorage("phone", e.target.value);  // Guarda en localStorage
                            }}
                          />

                        </div>
                      </div>

                      {/* Email */}
                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>
                            Correo Electronico <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              saveToLocalStorage("email", e.target.value);
                            }}
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div className="col-12 col-sm-12">
                        <div className="form-group local-forms">
                          <label>
                            Dirección <span className="login-danger">*</span>
                          </label>
                          <textarea
                            className="form-control"
                            value={address}  // Se enlaza el valor con el estado `address`
                            onChange={(e) => {
                              setAddress(e.target.value);  // Actualiza el estado con el nuevo valor
                              saveToLocalStorage("address", e.target.value);  // Guarda en localStorage
                            }}
                            placeholder=""
                          ></textarea>

                        </div>
                      </div>

                      {/* Occupation Select */}
                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>
                            Ocupación<span className="login-danger">*</span>
                          </label>
                          <Select
                            value={selectedOccupation}
                            onChange={handleChange('selectedOccupation', setSelectedOccupation)}
                            options={occupationOptions}
                            components={{ IndicatorSeparator: () => null }}
                            styles={selectStyles}
                          />
                        </div>
                      </div>

                      {/* Civil Status Select */}
                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>
                            Estado Civil<span className="login-danger">*</span>
                          </label>
                          <Select
                            value={selectedCivilStatus}
                            onChange={handleChange("selectedCivilStatus", setSelectedCivilStatus)}
                            options={civilStatusOptions}
                            components={{ IndicatorSeparator: () => null }}
                            styles={selectStyles}
                          />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="col-12">
                        <div className="doctor-submit text-end">
                          <button
                            type="button"
                            className="btn btn-primary cancel-form"
                            onClick={validarForm}
                          >
                            Siguiente
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary cancel-form"
                            onClick={cancelarForm}
                          >
                            Cancelar
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

export default AddPatients;
