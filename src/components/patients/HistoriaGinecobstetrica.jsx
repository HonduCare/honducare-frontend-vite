/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { DatePicker } from "antd";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import Select from "react-select";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';  // Para enviar datos al backend
import { removeComillas } from "../../helpers";

const HistoriaGinecobstetrica = () => {
  const [selectedHistoria, setSelectedHistoria] = useState(null);
  const [historiaValue, setHistoriaValue] = useState("");
  const [historias, setHistorias] = useState([]); // Cambio: ahora es un estado
  const [addedHistorias, setAddedHistorias] = useState([]);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  // Cargar datos del localStorage cuando se monta el componente
  useEffect(() => {
    const storedHistorias = JSON.parse(localStorage.getItem("historiasGinecobstetricas"));
    if (storedHistorias) {
      setAddedHistorias(storedHistorias);
    }
  }, []);

  // Llamada a la API para obtener las descripciones de historias ginecoobstétricas
  useEffect(() => {
    const fetchHistorias = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/obtener/historiaGinecoobstetrica/descripciones`
        );
        if (response.status === 200) {
          // Mapeamos las descripciones para que coincidan con el formato esperado por el componente Select
          const historiasData = response.data.map((historia) => ({
            value: historia.id_descripcion_ginecoobstetrica,
            label: historia.descripcion,
          }));
          setHistorias(historiasData);
        }
      } catch (error) {
        console.error("Error al obtener las historias ginecobstétricas:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar las historias ginecobstétricas.",
        });
      }
    };

    fetchHistorias();
  }, []);

  const handleHistoriaChange = (selectedOption) => {
    setSelectedHistoria(selectedOption);
  };

  const handleValueChange = (e) => {
    setHistoriaValue(e.target.value);
  };

  //Eliminar hitoria
  const handleDeleteHistoria = (index) => {
    setAddedHistorias((prevHistorias) =>
      prevHistorias.filter((_, i) => i !== index)
    );
  };

  const handleAddHistoria = () => {
    if (selectedHistoria && historiaValue) {
      const updatedHistorias = [
        ...addedHistorias,
        {
          id_descripcion_ginecoobstetrica: selectedHistoria.value,
          descripcion: selectedHistoria.label, // Nombre
          valor: historiaValue,
        },
      ];
      setAddedHistorias(updatedHistorias);
      setHistoriaValue("");
      setSelectedHistoria(null);

      localStorage.setItem(
        "historiasGinecobstetricas",
        JSON.stringify(updatedHistorias)
      );
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
                    <Link to="#">Pacientes </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right">
                      <FeatherIcon icon="chevron-right" />
                    </i>
                  </li>
                  <li className="breadcrumb-item active">Agregar Historia</li>
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
                        <h4>Historia Ginecobstétrica</h4>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Historia</label>
                          <Select
                            value={selectedHistoria}
                            onChange={handleHistoriaChange}
                            options={historias}
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
                            Valor <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Ingrese el valor..."
                            value={historiaValue}
                            onChange={handleValueChange}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-2">
                        <div className="form-group local-forms">
                          <button
                            type="button"
                            className="btn btn-primary submit-form me-2"
                            onClick={handleAddHistoria}
                          >
                            Agregar
                          </button>
                        </div>
                      </div>

                      <div className="col-12 mt-3">
                        <h5>Historias Ginecobstétricas Agregadas:</h5>
                        {addedHistorias && addedHistorias.length > 0 ? (
                          <ul className="list-group">
                            {addedHistorias.map((item, index) => (
                              <li
                                key={index}
                                className="list-group-item d-flex justify-content-between align-items-center"
                              >
                                {item.descripcion}
                                <div className="d-flex align-items-center">
                                  <span className="badge bg-white rounded-pill me-2">
                                    {item.valor}
                                  </span>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteHistoria(index)}
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No se han agregado historias ginecobstétricas.</p>
                        )}
                      </div>


                      <div className="col-12">
                        <div className="doctor-submit text-end me-4">
                          <button
                            type="button"
                            className="btn btn-primary submit-form me-3"
                          >
                            <Link to='/como-se-entero'>Siguiente</Link>
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary cancel-form"
                          >
                            <Link className="nav-link" to="/habitos-toxicos">
                              Anterior
                            </Link>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div>
                    {/* <h5>Historias Agregadas</h5>
                    {addedHistorias.map((historia, index) => (
                      <div key={index}>
                        {historia.valor} - {historia.id_descripcion_ginecoobstetrica}
                      </div>
                    ))} */}
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

export default HistoriaGinecobstetrica;

