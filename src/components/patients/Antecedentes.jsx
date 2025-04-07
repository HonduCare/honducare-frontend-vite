import React, { useState, useEffect } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Select from "react-select";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";

import axios from 'axios';

// Componente para Antecedentes
const Antecedentes = () => {
  const [antecedentes, setAntecedentes] = useState([]);  // Estado para los antecedentes
  const [selectedAntecedente, setSelectedAntecedente] = useState(null);
  const [antecedenteDescription, setAntecedenteDescription] = useState("");
  const [addedAntecedentes, setAddedAntecedentes] = useState([]);
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL; // Obtiene la URL base desde el .env
  // Función para obtener los antecedentes desde la API
  const fetchAntecedentes = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/obtener/antecedentes/antecedente`);
      console.log(data);
      // Aquí mapeamos los antecedentes a un formato adecuado para Select
      const formattedData = data.map((item) => ({
        value: item.id_descripcion_antecedente,   // Suponiendo que 'id' es el campo de identificación
        label: item.descripcion // Suponiendo que 'descripcion' es el nombre del antecedente
      }));
      setAntecedentes(formattedData);
    } catch (error) {
      console.error("Error al obtener los antecedentes:", error);
    }
  };

  useEffect(() => {
    fetchAntecedentes(); // Llamada a la API cuando el componente se monta

    // Cargar antecedentes guardados en localStorage si existen
    const storedAntecedentes = JSON.parse(localStorage.getItem("addedAntecedentes"));
    if (storedAntecedentes) {
      setAddedAntecedentes(storedAntecedentes);
    }
  }, []);

  const handleAntecedenteChange = (selectedOption) => {
    setSelectedAntecedente(selectedOption);
  };

  const handleDescriptionChange = (e) => {
    setAntecedenteDescription(e.target.value);
  };

  //Eliminar Antecedente
  const handleDeleteAntecedente = (index) => {
    setAddedAntecedentes((prevAntecedentes) =>
      prevAntecedentes.filter((_, i) => i !== index)
    );
  };

  const handleAddAntecedente = () => {
    console.log(selectedAntecedente);
    if (selectedAntecedente && antecedenteDescription) {
      const newAntecedente = {
        antecedente: selectedAntecedente.label,
        descripcion: antecedenteDescription,
        id_descripcion_antecedente: selectedAntecedente.value,
      };
      const updatedAntecedentes = [...addedAntecedentes, newAntecedente];
      setAddedAntecedentes(updatedAntecedentes);

      // Guardar los antecedentes actualizados en localStorage
      localStorage.setItem("addedAntecedentes", JSON.stringify(updatedAntecedentes));

      // Limpiar los campos después de agregar
      setAntecedenteDescription("");
      setSelectedAntecedente(null);
    }
  };

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
                    <Link to="#">Pacientes </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right">
                      <FeatherIcon icon="chevron-right" />
                    </i>
                  </li>
                  <li className="breadcrumb-item active">Agregar Antecedentes</li>
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
                          <h4>Antecedentes Hospitalarios</h4>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>
                            Antecedente <span className="login-danger">*</span>
                          </label>
                          <Select
                            value={selectedAntecedente}
                            onChange={handleAntecedenteChange}
                            options={antecedentes}
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
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="form-group local-forms">
                          <label>
                            Descripcion <span className="login-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={antecedenteDescription}
                            onChange={handleDescriptionChange}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-2">
                        <button
                          type="button"
                          className="btn btn-primary submit-form me-2"
                          onClick={handleAddAntecedente}
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                    <div className="col-12 mt-3">
                      <h5>Antecedentes Agregados:</h5>
                      {addedAntecedentes && addedAntecedentes.length > 0 ? (
                        <ul className="list-group">
                          {addedAntecedentes.map((item, index) => (
                            <li
                              key={index}
                              className="list-group-item d-flex justify-content-between align-items-center"
                            >
                              <div>{item.antecedente}</div>
                              <div className="d-flex align-items-center">
                                <span className="badge bg-white rounded-pill me-2">
                                  {item.descripcion}
                                </span>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDeleteAntecedente(index)}
                                >
                                  Eliminar
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No se han agregado antecedentes.</p>
                      )}
                    </div>

                    <div className="col-12">
                      <div className="doctor-submit text-end">
                        <button
                          type="button"
                          className="btn btn-primary cancel-form me-2"
                        >
                          <Link className="nav-link" to="/habitos-toxicos">
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

export default Antecedentes;
