import React, { useState, useEffect } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { DatePicker } from "antd";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import Select from "react-select";
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from "sweetalert2";
import axios from "axios";
import moment from 'moment';
import { ViewAgendaOutlined } from "@mui/icons-material";
import { removeComillas } from "../../helpers";

const AddPatients = () => {
  const navigate = useNavigate();
  const params = useParams();

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
  
  const getLocalStorage = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  };

  const [name, setName] = useState('');
  const [identidad, setIdentidad] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [selectedNationality, setSelectedNationality] = useState({ value: 1, label: '...' });
  const [selectedDocumentType, setSelectedDocumentType] = useState({ value: 1, label: '...' });
  const [selectedGender, setSelectedGender] = useState({ value: 1, label: '...' });
  const [selectedCivilStatus, setSelectedCivilStatus] = useState({ value: 1, label: '...' });
  const [selectedOccupation, setSelectedOccupation] = useState({ value: 1, label: '...' });


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

  async function onSubmit() {
    if ([name, phone, email, age, identidad, address, birthDate, selectedCivilStatus, selectedDocumentType, selectedGender, selectedNationality].includes('')) {
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

    const body = {
      name: name,
      age: Number(age),
      identidad: Number(identidad),
      phone: phone,
      email: email,
      direccion: address,
      id_sexo: selectedGender.value,
      id_estado_civil: selectedCivilStatus.value,
      nacionalidad: selectedNationality.label,
    }

    // console.log(body);

    try {
      const { data } = await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/pacientes/${params.id}`, body);

      console.log(data);

      Swal.fire({
        icon: "success",
        title: data.mensaje,
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate('/PacienteLista');
      });

    } catch (error) {
      console.log(error);
    }

  }

  function cancelarForm() {
    Swal.fire({
      icon: "warning",
      title: "¿Estas Seguro?",
      text: '¿No deseas seguir editando la informacion de esta paciente?',
      confirmButtonText: 'Si, Cancelar',
      showCancelButton: true,
      cancelButtonText: 'Regresar',
      focusCancel: true,
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/PacienteLista');
      }
    });
  }

  async function getInfoPaciente() {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/pacientes/${params.id}`;

    try {
      const { data } = await axios(url);
      console.log(data);
      setName(data.nombre_completo);
      setPhone(data.telefono);
      setIdentidad(data.numero_identidad.toString());
      setEmail(data.correo_electronico);
      setAge(data.edad);
      setAddress(data.direccion ? data.direccion : '');

      setSelectedGender({
        value: data.tbl_sexo.id_sexo,
        label: data.tbl_sexo.descripcion,
      });

      setSelectedCivilStatus({
        value: data.tbl_estado_civil.id_estado_civil,
        label: data.tbl_estado_civil.descripcion,
      });

      setSelectedOccupation({
        value: data.tbl_ocupacion.id_ocupacion,
        label: data.tbl_ocupacion.descripcion,
      });

      setSelectedOccupation({
        value: 2,
        label: data.nacionalidad,
      });

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getInfoPaciente();
  }, []);

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

                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>
                            Nacionalidad<span className="login-danger">*</span>
                          </label>
                          <Select
                            defaultValue={selectedNationality}
                            onChange={setSelectedNationality}
                            options={nationalities}
                            id="search-commodity"
                            components={{
                              IndicatorSeparator: () => null
                            }}
                            styles={{
                              control: (baseStyles, state) => ({
                                ...baseStyles,
                                borderColor: state.isFocused ? 'none' : '2px solid rgba(46, 55, 164, 0.1);',
                                boxShadow: state.isFocused ? '0 0 0 1px #41c1ef' : 'none',
                                '&:hover': {
                                  borderColor: state.isFocused ? 'none' : '2px solid rgba(46, 55, 164, 0.1)',
                                },
                                borderRadius: '10px',
                                fontSize: "14px",
                                minHeight: "45px",
                              }),
                              dropdownIndicator: (base, state) => ({
                                ...base,
                                transform: state.selectProps.menuIsOpen ? 'rotate(-180deg)' : 'rotate(0)',
                                transition: '250ms',
                                width: '35px',
                                height: '35px',
                              }),
                            }}
                          />

                        </div>
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
                            onClick={onSubmit}
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
