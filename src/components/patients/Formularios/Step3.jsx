import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

const Step3 = ({ formData, setFormData }) => {
  const [antecedentes, setAntecedentes] = useState([]);
  const [selectedAntecedente, setSelectedAntecedente] = useState(null);
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    const fetchAntecedentes = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/obtener/antecedentes/antecedente`);
        console.log("antecendentesobtenidos: ", res)
        setAntecedentes(
          res.data.map((a) => ({
            value: a.id_descripcion_antecedente,
            label: a.descripcion,
          }))
        );
      } catch (error) {
        console.error("Error al cargar antecedentes:", error);
      }
    };

    fetchAntecedentes();
  }, []);

  const handleAddAntecedente = () => {
    if (!selectedAntecedente || !descripcion.trim()) return;

    const nuevo = {
      id_descripcion_antecedente: selectedAntecedente.value,
      antecedente: selectedAntecedente.label,
      descripcion,
    };
    console.log("Nuevo antecedente:", nuevo);
    setFormData((prev) => ({
      ...prev,
      antecedentesHospitalarios: [...prev.antecedentesHospitalarios, nuevo],
    }));

    setSelectedAntecedente(null);
    setDescripcion("");
  };

  const handleRemoveAntecedente = (idx) => {
    setFormData((prev) => ({
      ...prev,
      antecedentesHospitalarios: prev.antecedentesHospitalarios.filter((_, index) => index !== idx),
    }));
  };

  // Filtrar antecedentes para que no se puedan volver a agregar
  const filteredAntecedentes = antecedentes.filter(
    (a) =>
      !formData.antecedentesHospitalarios.some(
        (item) => item.id_descripcion_antecedente === a.value
      )
  );

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="form-heading mb-4">Antecedentes Hospitalarios</h4>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group local-forms">
              <label>
                Antecedente <span className="login-danger">*</span>
              </label>
              <Select
                value={selectedAntecedente}
                onChange={setSelectedAntecedente}
                options={filteredAntecedentes} // Usar la lista filtrada
                components={{ IndicatorSeparator: () => null }}
                className="form-form-control"
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
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describa el antecedente"
              />
            </div>
          </div>
          <div className="col-12">
            <button className="btn btn-primary" onClick={handleAddAntecedente}>
              Agregar Antecedente
            </button>
          </div>
          <div className="col-12 mt-3">
            <h5>Antecedentes Agregados:</h5>
            <ul className="list-group">
              {formData.antecedentesHospitalarios.map((item, idx) => (
                <li
                  key={idx}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{item.antecedente}</strong>: {item.descripcion}
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveAntecedente(idx)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3;