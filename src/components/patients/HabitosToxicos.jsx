
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios"; // Importar Axios
import Header from "../Header";
import Sidebar from "../Sidebar";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";

const HabitosToxicos = () => {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  const [selectedHT, setSelectedHT] = useState(null);
  const [addedHT, setAddedHT] = useState([]); // Estado para los hábitos tóxicos agregados
  const [habitos, setHabitos] = useState([]); // Estado para los hábitos tóxicos obtenidos

  // Función para cargar los hábitos tóxicos desde la API
  const fetchHabitosToxicos = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/obtener/habitos/habitos`);

      const habitosData = response.data.map((item) => ({
        value: item.id_descripcion_habitos, // Ajusta según el campo de tu API
        label: item.descripcion,
      }));
      setHabitos(habitosData);
    } catch (error) {
      console.error("Error al cargar los hábitos tóxicos:", error);
    }
  };

  // Cargar los hábitos agregados desde localStorage al cargar el componente
  useEffect(() => {
    const savedHabitos = JSON.parse(localStorage.getItem("addedHT"));
    if (savedHabitos) {
      setAddedHT(savedHabitos);
    }
    fetchHabitosToxicos();
  }, []);

  // Guardar los hábitos tóxicos en localStorage cuando cambian
  useEffect(() => {
    if (addedHT) {
      localStorage.setItem("addedHT", JSON.stringify(addedHT));
    }
  }, [addedHT]);

  // Manejar selección de hábito tóxico
  const handleHTChange = (selectedOption) => {
    setSelectedHT(selectedOption);
  };

  // Agregar hábito tóxico
  const handleAddHT = () => {
    if (selectedHT && !addedHT.some((item) => item.value === selectedHT.value)) {
      const updatedHT = [...addedHT, selectedHT];
      setAddedHT(updatedHT);
      console.log('Nuevo habito:', updatedHT);
      setSelectedHT(null);
    }
  };

  // Eliminar hábito tóxico
  const handleDeleteHT = (value) => {
    const updatedHT = addedHT.filter((item) => item.value !== value);
    setAddedHT(updatedHT);
  };

  function isMale() {
    const sexo = localStorage.getItem('selectedGender') ? JSON.parse(localStorage.getItem('selectedGender')) : { value: 1, label: 'Masculino' };

    if (sexo.label.toLowerCase() == 'masculino') return true;

    return false;

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
                  <li className="breadcrumb-item active">Agregar Habitos Tóxicos</li>
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
                          <h4>Hábitos Tóxicos</h4>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-4">
                        <div className="form-group local-forms">
                          <label>
                            Hábito tóxico <span className="login-danger">*</span>
                          </label>
                          <Select
                            value={selectedHT}
                            onChange={handleHTChange}
                            options={habitos} // Utilizar los datos cargados desde la API
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
                      <div className="col-12 col-md-6 col-xl-2">
                        <div className="form-group local-forms">
                          <button
                            type="button"
                            className="btn btn-primary submit-form me-2"
                            onClick={handleAddHT}
                          >
                            Agregar
                          </button>
                        </div>
                      </div>
                      <div className="col-12 mt-3">
                        <h5>Hábitos Agregados:</h5>
                        {addedHT ? (
                          <ul className="list-group">
                            {addedHT.map((item) => (
                              <li
                                key={item.value}
                                className="list-group-item d-flex justify-content-between align-items-center"
                              >
                                {item.label}
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDeleteHT(item.value)}
                                >
                                  Eliminar
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No se han agregado hábitos tóxicos.</p>
                        )}
                      </div>
                      <div className="col-12">
                        <div className="doctor-submit text-end">
                          <button
                            type="button"
                            className="btn btn-primary cancel-form me-2"
                          >
                            <Link className="nav-link" to={!isMale() ? '/historia-ginecobstetrica' : '/como-se-entero'}>
                              Siguiente
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

export default HabitosToxicos;

