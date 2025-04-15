// src/components/Steps/Step4.jsx

import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

const Step4 = ({ formData, setFormData }) => {
  const [habitos, setHabitos] = useState([]);
  const [selectedHT, setSelectedHT] = useState(null);

  useEffect(() => {
    const fetchHabitos = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/obtener/habitos/habitos`);
        setHabitos(
          res.data.map((h) => ({
            value: h.id_descripcion_habitos,
            label: h.descripcion,
          }))
        );
      } catch (error) {
        console.error("Error al cargar hábitos tóxicos:", error);
      }
    };

    fetchHabitos();
  }, []);

  const handleAddHT = () => {
    if (
      selectedHT &&
      !formData.habitosToxicos.some((item) => item.id_descripcion_habitos === selectedHT.value)
    ) {
      setFormData((prev) => ({
        ...prev,
        habitosToxicos: [
          ...prev.habitosToxicos,
          {
            id_descripcion_habitos: selectedHT.value,
            descripcion: selectedHT.label,
          },
        ],
      }));
      setSelectedHT(null);
    }
  };

  const handleRemoveHT = (idx) => {
    setFormData((prev) => ({
      ...prev,
      habitosToxicos: prev.habitosToxicos.filter((_, index) => index !== idx),
    }));
  };

  // Filtrar hábitos para que no se puedan volver a agregar
  const filteredHabitos = habitos.filter(
    (h) =>
      !formData.habitosToxicos.some(
        (item) => item.id_descripcion_habitos === h.value
      )
  );

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="form-heading mb-4">Hábitos Tóxicos</h4>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group local-forms">
              <label>
                Hábito Tóxico <span className="login-danger">*</span>
              </label>
              <Select
                value={selectedHT}
                onChange={setSelectedHT}
                options={filteredHabitos} // Usar la lista filtrada
                components={{ IndicatorSeparator: () => null }}
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="form-group local-forms">
              <button
                type="button"
                className="btn btn-primary submit-form"
                onClick={handleAddHT}
              >
                Agregar
              </button>
            </div>
          </div>
          <div className="col-12 mt-3">
            <h5>Hábitos Agregados:</h5>
            <ul className="list-group">
              {formData.habitosToxicos.map((item, idx) => (
                <li
                  key={idx}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {item.descripcion}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveHT(idx)}
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

export default Step4;