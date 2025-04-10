import React, { useState, useEffect } from "react";
import Select from "react-select";
import Header from "../../Header";
import Sidebar from "../../Sidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import axios from "axios";

const FormularioPaciente = () => {
  const [step, setStep] = useState(1);

  // Paso 1: Datos personales
  const [nombre, setNombre] = useState("");
  const [sexo, setSexo] = useState(null);
  const [fechaNacimiento, setFechaNacimiento] = useState(null);
  const [identidad, setIdentidad] = useState("");
  const [telefono, setTelefono] = useState("");

  // Paso 2: Patologías
  const [patologias, setPatologias] = useState([]);
  const [selectedPatologia, setSelectedPatologia] = useState(null);
  const [tipoPatologia, setTipoPatologia] = useState("familiar");
  const [parentesco, setParentesco] = useState(null);
  const [medicamentos, setMedicamentos] = useState("");
  const [dosis, setDosis] = useState("");
  const [horario, setHorario] = useState("");
  const [addedPatologias, setAddedPatologias] = useState([]);

  // Paso 3: Antecedentes
  const [antecedentes, setAntecedentes] = useState([]);
  const [selectedAntecedente, setSelectedAntecedente] = useState(null);
  const [antecedenteDescription, setAntecedenteDescription] = useState("");
  const [addedAntecedentes, setAddedAntecedentes] = useState([]);

  // Paso 4: Hábitos Tóxicos
  const [habitos, setHabitos] = useState([]);
  const [selectedHT, setSelectedHT] = useState(null);
  const [addedHT, setAddedHT] = useState([]);

  // Paso 5: Historia Ginecobstétrica
  const [historias, setHistorias] = useState([]);
  const [selectedHistoria, setSelectedHistoria] = useState(null);
  const [historiaValue, setHistoriaValue] = useState('');
  const [addedHistorias, setAddedHistorias] = useState([]);

  const sexoOptions = [
    { value: 1, label: "Masculino" },
    { value: 2, label: "Femenino" },
  ];

  const parentescoOptions = [
    { value: 1, label: "Madre" },
    { value: 2, label: "Padre" },
    { value: 3, label: "Hermano" },
    { value: 4, label: "Abuelo Paterno" },
    { value: 5, label: "Abuelo Materno" },
    { value: 6, label: "Abuela Paterna" },
    { value: 7, label: "Abuela Materna" },
    { value: 8, label: "Tío" },
    { value: 9, label: "Tía" },
  ];

  const isFemale = sexo?.label?.toLowerCase() === "femenino";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patRes, antRes, habRes] = await Promise.all([
          axios.get(
            `${
              import.meta.env.VITE_REACT_APP_API_URL
            }/obtener/patologias/patologias`
          ),
          axios.get(
            `${
              import.meta.env.VITE_REACT_APP_API_URL
            }/obtener/antecedentes/antecedente`
          ),
          axios.get(
            `${import.meta.env.VITE_REACT_APP_API_URL}/obtener/habitos/habitos`
          ),
        ]);

        setPatologias(
          patRes.data.map((p) => ({
            value: p.id_patologia,
            label: p.descripcion,
          }))
        );
        setAntecedentes(
          antRes.data.map((a) => ({
            value: a.id_descripcion_antecedente,
            label: a.descripcion,
          }))
        );
        setHabitos(
          habRes.data.map((h) => ({
            value: h.id_descripcion_habitos,
            label: h.descripcion,
          }))
        );
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddPatologia = () => {
    if (selectedPatologia) {
      if (tipoPatologia === "familiar" && parentesco) {
        setAddedPatologias([
          ...addedPatologias,
          {
            id_patologia: selectedPatologia.value,
            patologia: selectedPatologia.label,
            tipo: "Familiar",
            parentesco: parentesco.label,
          },
        ]);
      } else if (
        tipoPatologia === "personal" &&
        medicamentos &&
        dosis &&
        horario
      ) {
        setAddedPatologias([
          ...addedPatologias,
          {
            id_patologia: selectedPatologia.value,
            patologia: selectedPatologia.label,
            tipo: "Personal",
            medicamentos,
            dosis,
            horario,
          },
        ]);
      }
      setSelectedPatologia(null);
      setParentesco(null);
      setMedicamentos("");
      setDosis("");
      setHorario("");
    }
  };

  const handleAddAntecedente = () => {
    if (selectedAntecedente && antecedenteDescription) {
      setAddedAntecedentes([
        ...addedAntecedentes,
        {
          antecedente: selectedAntecedente.label,
          descripcion: antecedenteDescription,
          id_descripcion_antecedente: selectedAntecedente.value,
        },
      ]);
      setSelectedAntecedente(null);
      setAntecedenteDescription("");
    }
  };

  const handleAddHT = () => {
    if (
      selectedHT &&
      !addedHT.some((item) => item.value === selectedHT.value)
    ) {
      setAddedHT([...addedHT, selectedHT]);
      setSelectedHT(null);
    }
  };

  const handleAddHistoria = () => {
    if (selectedHistoria && historiaValue) {
      setAddedHistorias([...addedHistorias, {
        id_descripcion_ginecoobstetrica: selectedHistoria.value,
        descripcion: selectedHistoria.label,
        valor: historiaValue
      }]);
      setSelectedHistoria(null);
      setHistoriaValue('');
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!nombre || !sexo || !fechaNacimiento || !identidad || !telefono) {
        Swal.fire({
          icon: "warning",
          title: "Campos incompletos",
          text: "Completa todos los campos antes de continuar.",
        });
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        nombre,
        sexo: sexo?.label,
        fechaNacimiento,
        identidad,
        telefono,
        patologias: addedPatologias,
        antecedentes: addedAntecedentes,
        habitos: addedHT,
        historiasGinecobstetricas: addedHistorias,
      };

      await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/crear/paciente`, payload);

      Swal.fire({ icon: 'success', title: 'Registro exitoso', text: 'El paciente ha sido registrado correctamente.' });
      setStep(1);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error al guardar', text: 'Ocurrió un error al enviar la información.' });
      console.error(error);
    }
  };

  const handlePrev = () => setStep((prev) => prev - 1);

  return (
    <>
      <Header />
      <Sidebar
        id="menu-item2"
        id1="menu-items2"
        activeClassName="add-patient"
      />
      <div className="page-wrapper">
        <div className="content">
          <h2>Paso {step}</h2>

          {step === 1 && (
            <>
              <div className="card">
                <div className="card-body">
                  <h4 className="form-heading">Datos Personales</h4>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group local-forms">
                        <label>
                          Nombre <span className="login-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          placeholder="Ingrese el nombre completo"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group local-forms">
                        <label>
                          Sexo <span className="login-danger">*</span>
                        </label>
                        <Select
                          value={sexo}
                          onChange={(option) => setSexo(option)}
                          options={sexoOptions}
                          components={{ IndicatorSeparator: () => null }}
                          styles={{
                            control: (baseStyles, state) => ({
                              ...baseStyles,
                              borderColor: state.isFocused
                                ? "none"
                                : "2px solid rgba(46, 55, 164, 0.1)",
                              boxShadow: state.isFocused
                                ? "0 0 0 1px #41c1ef"
                                : "none",
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
                    <div className="col-md-6">
                      <div className="form-group local-forms">
                        <label>
                          Fecha de Nacimiento{" "}
                          <span className="login-danger">*</span>
                        </label>
                        <DatePicker
                          selected={fechaNacimiento}
                          onChange={(date) => setFechaNacimiento(date)}
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          placeholderText="Seleccione la fecha"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group local-forms">
                        <label>
                          Identidad <span className="login-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={identidad}
                          onChange={(e) => setIdentidad(e.target.value)}
                          placeholder="Ingrese el número de identidad"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group local-forms">
                        <label>
                          Teléfono <span className="login-danger">*</span>
                        </label>
                        <input
                          type="tel"
                          className="form-control"
                          value={telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                          placeholder="Ingrese el número de teléfono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="card">
              <div className="card-body">
                <h4 className="form-heading">Patologías</h4>
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group local-forms">
                      <label>Tipo de Patología</label>
                      <select
                        className="form-control"
                        value={tipoPatologia}
                        onChange={(e) => setTipoPatologia(e.target.value)}
                      >
                        <option value="familiar">Familiar</option>
                        <option value="personal">Personal</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group local-forms">
                      <label>Patología</label>
                      <Select
                        value={selectedPatologia}
                        onChange={setSelectedPatologia}
                        options={patologias}
                        components={{ IndicatorSeparator: () => null }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: "10px",
                            minHeight: "45px",
                          }),
                        }}
                      />
                    </div>
                  </div>

                  {tipoPatologia === "familiar" && (
                    <div className="col-md-4">
                      <div className="form-group local-forms">
                        <label>Parentesco</label>
                        <Select
                          value={parentesco}
                          onChange={setParentesco}
                          options={parentescoOptions}
                          components={{ IndicatorSeparator: () => null }}
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderRadius: "10px",
                              minHeight: "45px",
                            }),
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {tipoPatologia === "personal" && (
                    <>
                      <div className="col-md-4">
                        <div className="form-group local-forms">
                          <label>Medicamentos</label>
                          <input
                            type="text"
                            className="form-control"
                            value={medicamentos}
                            onChange={(e) => setMedicamentos(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group local-forms">
                          <label>Dosis</label>
                          <input
                            type="text"
                            className="form-control"
                            value={dosis}
                            onChange={(e) => setDosis(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group local-forms">
                          <label>Horario</label>
                          <input
                            type="text"
                            className="form-control"
                            value={horario}
                            onChange={(e) => setHorario(e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="col-12">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleAddPatologia}
                    >
                      Agregar Patología
                    </button>
                  </div>

                  <div className="col-12 mt-3">
                    <h5>Patologías Agregadas:</h5>
                    <ul className="list-group">
                      {addedPatologias.map((item, idx) => (
                        <li
                          key={idx}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div>
                            {item.patologia} ({item.tipo}){" "}
                            {item.parentesco &&
                              `- Parentesco: ${item.parentesco}`}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card">
              <div className="card-body">
                <h4 className="form-heading">Antecedentes Hospitalarios</h4>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group local-forms">
                      <label>
                        Antecedente <span className="login-danger">*</span>
                      </label>
                      <Select
                        value={selectedAntecedente}
                        onChange={setSelectedAntecedente}
                        options={antecedentes}
                        components={{ IndicatorSeparator: () => null }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: "10px",
                            minHeight: "45px",
                          }),
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group local-forms">
                      <label>
                        Descripción <span className="login-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={antecedenteDescription}
                        onChange={(e) =>
                          setAntecedenteDescription(e.target.value)
                        }
                        placeholder="Describa el antecedente"
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <button
                      className="btn btn-primary"
                      onClick={handleAddAntecedente}
                    >
                      Agregar Antecedente
                    </button>
                  </div>
                  <div className="col-12 mt-3">
                    <h5>Antecedentes Agregados:</h5>
                    <ul className="list-group">
                      {addedAntecedentes.map((item, idx) => (
                        <li
                          key={idx}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div>{item.antecedente}</div>
                          <span className="badge bg-white rounded-pill me-2">
                            {item.descripcion}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="card">
              <div className="card-body">
                <h4 className="form-heading">Hábitos Tóxicos</h4>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group local-forms">
                      <label>
                        Hábito tóxico <span className="login-danger">*</span>
                      </label>
                      <Select
                        value={selectedHT}
                        onChange={setSelectedHT}
                        options={habitos}
                        components={{ IndicatorSeparator: () => null }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: "10px",
                            minHeight: "45px",
                          }),
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group local-forms">
                      <button
                        type="button"
                        className="btn btn-primary submit-form mt-4"
                        onClick={handleAddHT}
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                  <div className="col-12 mt-3">
                    <h5>Hábitos Agregados:</h5>
                    <ul className="list-group">
                      {addedHT.map((item) => (
                        <li
                          key={item.value}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && isFemale && (
            <div className="card">
              <div className="card-body">
                <h4 className="form-heading">Historia Ginecobstétrica</h4>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Historia</label>
                      <Select
                        value={selectedHistoria}
                        onChange={setSelectedHistoria}
                        options={historias}
                        components={{ IndicatorSeparator: () => null }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: "10px",
                            minHeight: "45px",
                          }),
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group local-forms">
                      <label>
                        Valor <span className="login-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Ingrese el valor..."
                        value={historiaValue}
                        onChange={(e) => setHistoriaValue(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div className="form-group local-forms">
                      <button
                        type="button"
                        className="btn btn-primary submit-form mt-4"
                        onClick={handleAddHistoria}
                      >
                        Agregar
                      </button>
                    </div>
                  </div>

                  <div className="col-12 mt-3">
                    <h5>Historias Ginecobstétricas Agregadas:</h5>
                    <ul className="list-group">
                      {addedHistorias.map((item, idx) => (
                        <li
                          key={idx}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          {item.descripcion}
                          <span className="badge bg-white rounded-pill me-2">
                            {item.valor}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

            {/* Paso 6: Confirmación */}
        {step === 6 && (
          <div className="card">
            <div className="card-body">
              <h4 className="form-heading">Confirmar Datos</h4>
              <p><strong>Nombre:</strong> {nombre}</p>
              <p><strong>Sexo:</strong> {sexo?.label}</p>
              <p><strong>Fecha de Nacimiento:</strong> {fechaNacimiento?.toLocaleDateString()}</p>
              <p><strong>Identidad:</strong> {identidad}</p>
              <p><strong>Teléfono:</strong> {telefono}</p>
              <p><strong>Patologías:</strong> {addedPatologias.length}</p>
              <p><strong>Antecedentes:</strong> {addedAntecedentes.length}</p>
              <p><strong>Hábitos Tóxicos:</strong> {addedHT.length}</p>
              {isFemale && <p><strong>Historias Ginecobstétricas:</strong> {addedHistorias.length}</p>}
              <div className="text-end mt-4">
                <button className="btn btn-success" onClick={handleSubmit}>Confirmar y Enviar</button>
              </div>
            </div>
          </div>
        )}

          <div className="mt-4 d-flex justify-content-between">
            {step > 1 && (
              <button className="btn btn-secondary" onClick={handlePrev}>
                Anterior
              </button>
            )}
            {step < 6 && (
              <button className="btn btn-primary" onClick={handleNext}>
                Siguiente
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FormularioPaciente;
