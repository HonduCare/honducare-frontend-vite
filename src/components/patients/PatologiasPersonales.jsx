/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { DatePicker} from "antd";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import Select from "react-select";
import { Link } from 'react-router-dom';

const PatologiasPersonales = () => {
  const [selectedPatologia, setSelectedPatologia] = useState(null);
 
  const [patologias, setPatologia] = useState([
    { value: 1, label: "Diabetes" },
    { value: 2, label: "Gastritis" },
    { value: 3, label: "Colitis" },
    { value: 4, label: "Colestero Elevado" },
    { value: 5, label: "Trigliceridos elevados" },
    { value: 6, label: "Acido urico elevado" },
    { value: 7, label: "Enfermedades Respiratorias" },
    { value: 8, label: "Hipertiroidismo" },
    { value: 9, label: "Hipotiroidismo" },
    { value: 10, label: "Hipertensión Arterial" },
    { value: 11, label: "Eventos Cardiovasculares" },
    { value: 12, label: "Depresion" },
    { value: 13, label: "Obesidad" },
    { value: 14, label: "Cancer" },
  ]);
  const [addedPatologias, setAddedPatologias] = useState([]);
  
  const handlePatologiaChange = (selectedOption) => {
    setSelectedPatologia(selectedOption);
  };

  const handleAddPatologias = () => {
    if (selectedPatologia) {
      setAddedPatologias([
        ...addedPatologias,
        { patologia: selectedPatologia.label }
      ]);
      setSelectedPatologia(null);
    }
  };
  const [medicamentoValue, setMedicamentoValue] = useState("");
  const [dosisValue, setDosisValue] = useState("");
  const [horarioValue, setHorarioValue] = useState("");
  const [addedMedicamentos, setAddedMedicamentos] = useState([]);
  const handleMedicamentoChange = (e) => {
    setMedicamentoValue(e.target.value);
  };
  const handleDosisChange = (e) => {
    setDosisValue(e.target.value);
  };
  const handleHorarioChange = (e) => {
    setHorarioValue(e.target.value);
  };

  const handleAddMedicamento = () => {
    if (medicamentoValue && dosisValue && horarioValue) {
      setAddedMedicamentos([
        ...addedMedicamentos,
        { medicamento: medicamentoValue, dosis: dosisValue, horario: horarioValue }
      ]);
      setDosisValue("");
      setMedicamentoValue("");
      setHorarioValue("");
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
      <>
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="#">Pacientes </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active">Editar Paciente</li>
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
                            <h4>Patologias Personales</h4>
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              Patologias <span className="login-danger">*</span>
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
                                  borderColor: state.isFocused ?'none' : '2px solid rgba(46, 55, 164, 0.1);',
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
                        
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <button
                              type="button"
                              className="btn btn-primary submit-form me-2"
                              onClick={handleAddPatologias}
                            >
                              Agregar
                            </button>
                            </div>
                            </div>
                            <div className="col-12 mt-3">
                        <h5>Patologias Agregadas:</h5>
                        <ul className="list-group">
                          {addedPatologias.map((item, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                              {item.patologia}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="col-12 col-md-6 col-xl-6">
                        <li></li>
                        </div>
                        <div className="col-12 col-md-6 col-xl-6">
                        <li></li>
                        </div>
                      <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                          <label>
                              Medicamentos <span className="login-danger">*</span>
                            </label>
                            <input
                            type="text"
                              className="form-control"
                              value={medicamentoValue}
                              onChange={handleMedicamentoChange}
                              rows={3}
                              cols={30}
                              defaultValue={""}
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
                              className="form-control"
                              value={dosisValue}
                              onChange={handleDosisChange}
                              rows={3}
                              cols={30}
                              defaultValue={""}
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
                              className="form-control"
                              value={horarioValue}
                              onChange={handleHorarioChange}
                              rows={3}
                              cols={30}
                              defaultValue={""}
                            />
                            </div>
                            </div>
                            <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <button
                              type="button"
                              className="btn btn-primary submit-form me-2"
                              onClick={handleAddMedicamento}
                            >
                              Agregar
                            </button>
                            </div>
                            </div>
                            <div className="col-12 mt-3">
                        <h5>Medicamentos Agregados:</h5>
                        <ul className="list-group">
                          {addedMedicamentos.map((item, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                              {item.medicamento}
                              <span className="badge bg-white rounded-pill">{item.dosis}</span>
                              <span className="badge bg-white rounded-pill">{item.horario}</span>
                            </li>
                            
                          ))}
                        </ul>
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
                              <Link className="nav-link" to="/patologias-familiares">
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
      </>
    </div>
  );
};

export default PatologiasPersonales;