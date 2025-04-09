import React, { useState, useEffect } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import Select from "react-select";
import { Link } from 'react-router-dom';
import axios from "axios";

const PatologiasFamiliares = () => {
  const [selectedPatologia, setSelectedPatologia] = useState(null);
  const [selectedParentesco, setSelectedParentesco] = useState(null);
  const [medicamentos, setMedicamentos] = useState("");
  const [dosis, setDosis] = useState("");
  const [horario, setHorario] = useState("");
  const [selectedTipoPatologia, setSelectedTipoPatologia] = useState("familiar");
  const [parentesco] = useState([
    { value: 1, label: "Madre" },
    { value: 2, label: "Padre" },
    { value: 3, label: "Hermano" },
    { value: 4, label: "Abuelo Paterno" },
    { value: 5, label: "Abuelo Materno" },
    { value: 6, label: "Abuela Paterna" },
    { value: 7, label: "Abuela Materna" },
    { value: 8, label: "Tío" },
    { value: 9, label: "Tía" },
  ]);
  const [addedPatologias, setAddedPatologias] = useState([]);
  const [patologias, setPatologias] = useState([]);

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    // Cargar datos desde el localStorage al montar el componente
    const storedPatologias = JSON.parse(localStorage.getItem("addedPatologias")) || [];
    setAddedPatologias(storedPatologias);

    // Obtener patologías desde la API
    const fetchPatologias = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/obtener/patologias/patologias`);
        console.log(response.data);
        const patologiasData = response.data.map(patologia => ({
          id: patologia.id_patologia,  // Asegúrate de que el id sea accesible
          label: patologia.descripcion
        }));
        setPatologias(patologiasData);
      } catch (error) {
        console.error("Error fetching patologías:", error);
      }
    };

    fetchPatologias();
  }, []);

  useEffect(() => {
    // Guardar las patologías agregadas en el localStorage cuando se actualicen
    localStorage.setItem("addedPatologias", JSON.stringify(addedPatologias));
  }, [addedPatologias]);

  const handlePatologiaChange = (selectedOption) => {
    setSelectedPatologia(selectedOption);
  };


  const handleParentescoChange = (selectedOption) => {
    setSelectedParentesco(selectedOption);
  };

  const handleTipoPatologiaChange = (event) => {
    setSelectedTipoPatologia(event.target.value);
  };

  const handleMedicamentosChange = (e) => {
    setMedicamentos(e.target.value);
  };

  const handleDosisChange = (e) => {
    setDosis(e.target.value);
  };

  const handleHorarioChange = (e) => {
    setHorario(e.target.value);
  };

  //Eliminar patologia
  const handleDeletePatologia = (index) => {
    setAddedPatologias((prevPatologias) =>
      prevPatologias.filter((_, i) => i !== index)
    );
  };
  

  const handleAddPatologias = () => {
    if (selectedPatologia) {
      if (selectedTipoPatologia === "familiar" && selectedParentesco) {
        setAddedPatologias([
          ...addedPatologias,
          {
            id_patologia: selectedPatologia.id,
            patologia: selectedPatologia.label,
            tipo: "Familiar",
            parentesco: selectedParentesco.label
          },
        ]);
      } else if (selectedTipoPatologia === "personal" && medicamentos && dosis && horario) {
        setAddedPatologias([
          ...addedPatologias,
          {
            id_patologia: selectedPatologia.id,
            patologia: selectedPatologia.label,
            tipo: "Personal",
            medicamentos,
            dosis,
            horario
          },
        ]);
      }
      setSelectedPatologia(null);
      setSelectedParentesco(null);
      setMedicamentos("");
      setDosis("");
      setHorario("");
    }
  };


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
                          <h4>Patologías Familiares</h4>
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>
                            Tipo de Patología <span className="login-danger">*</span>
                          </label>
                          <select
                            value={selectedTipoPatologia}
                            onChange={handleTipoPatologiaChange}
                            className="form-control"
                          >
                            <option value="familiar">Familiar</option>
                            <option value="personal">Personal</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>
                            Patología <span className="login-danger">*</span>
                          </label>
                          <Select
                            value={selectedPatologia}
                            onChange={handlePatologiaChange}
                            options={patologias}
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

                      {selectedTipoPatologia === "familiar" && (
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Parentesco <span className="login-danger">*</span>
                            </label>
                            <Select
                              value={selectedParentesco}
                              onChange={handleParentescoChange}
                              options={parentesco}
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
                      )}

                      {selectedTipoPatologia === "personal" && (
                        <>
                          <div className="col-12 col-md-6 col-xl-4">
                            <div className="form-group local-forms">
                              <label>
                                Medicamentos <span className="login-danger">*</span>
                              </label>
                              <input
                                type="text"
                                value={medicamentos}
                                onChange={handleMedicamentosChange}
                                className="form-control"
                                placeholder="Escribir medicamentos"
                              />
                            </div>
                          </div>
                          <div className="col-12 col-md-6 col-xl-4">
                            <div className="form-group local-forms">
                              <label>
                                Dosis <span className="login-danger">*</span>
                              </label>
                              <input
                                type="text"
                                value={dosis}
                                onChange={handleDosisChange}
                                className="form-control"
                                placeholder="Escribir dosis"
                              />
                            </div>
                          </div>
                          <div className="col-12 col-md-6 col-xl-4">
                            <div className="form-group local-forms">
                              <label>
                                Horario <span className="login-danger">*</span>
                              </label>
                              <input
                                type="text"
                                value={horario}
                                onChange={handleHorarioChange}
                                className="form-control"
                                placeholder="Escribir horario"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <div className="col-12">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleAddPatologias}
                        >
                          Agregar Patología
                        </button>
                      </div>
                    </div>
                  </form>
                  <div className="row mt-4">
                    <div className="col-12">
                      <h5>Patologías Agregadas:</h5>
                      {addedPatologias && addedPatologias.length > 0 ? (
                        <ul className="list-group">
                          {addedPatologias.map((patologia, index) => (
                            <li
                              key={index}
                              className="list-group-item d-flex justify-content-between align-items-center"
                            >
                              <div>
                                {patologia.patologia} ({patologia.tipo}){" "}
                                {patologia.parentesco && `- Parentesco: ${patologia.parentesco}`}
                              </div>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeletePatologia(index)}
                              >
                                Eliminar
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No se han agregado patologías.</p>
                      )}
                    </div>

                    <div className="col-12">
                      <div className="doctor-submit text-end">
                        <button
                          type="button"
                          className="btn btn-primary cancel-form me-2"
                        >
                          <Link className="nav-link" to="/antecedentes">
                            Siguiente
                          </Link>
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary cancel-form"
                        >
                          <Link className="nav-link" to="/AgregarPaciente">
                            Anterior
                          </Link>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatologiasFamiliares;


