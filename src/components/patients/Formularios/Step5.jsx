import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

const Step5 = ({ formData, setFormData }) => {
  const [historias, setHistorias] = useState([]);
  const [selectedHistoria, setSelectedHistoria] = useState(null);
  const [historiaValue, setHistoriaValue] = useState("");

  useEffect(() => {
    const fetchHistorias = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/obtener/historiaGinecoobstetrica/descripciones`);
        setHistorias(
          res.data.map((item) => ({
            value: item.id_descripcion_ginecoobstetrica,
            label: item.descripcion,
          }))
        );
      } catch (error) {
        console.error("Error al cargar historias ginecobstétricas:", error);
      }
    };
    fetchHistorias();
  }, []);

  const handleAddHistoria = () => {
    if (selectedHistoria && historiaValue.trim()) {
      // Evitar duplicados
      const alreadyExists = formData.ginecobstetrica.some(
        (item) => item.id_descripcion_ginecoobstetrica === selectedHistoria.value
      );
      if (alreadyExists) {
        alert("Esta historia ya ha sido agregada.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        ginecobstetrica: [
          ...prev.ginecobstetrica,
          {
            id_descripcion_ginecoobstetrica: selectedHistoria.value,
            descripcion: selectedHistoria.label,
            cantidad: parseInt(historiaValue),
          },
        ],
      }));
      setSelectedHistoria(null);
      setHistoriaValue("");
    }
  };

  const handleRemoveHistoria = (id) => {
    setFormData((prev) => ({
      ...prev,
      ginecobstetrica: prev.ginecobstetrica.filter(
        (item) => item.id_descripcion_ginecoobstetrica !== id
      ),
    }));
  };

  // Filtrar historias para que no se puedan volver a agregar
  const filteredHistorias = historias.filter(
    (historia) =>
      !formData.ginecobstetrica.some(
        (item) => item.id_descripcion_ginecoobstetrica === historia.value
      )
  );

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="form-heading mb-4">Historia Ginecobstétrica</h4>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Historia</label>
              <Select
                value={selectedHistoria}
                onChange={setSelectedHistoria}
                options={filteredHistorias} // Usar la lista filtrada
                components={{ IndicatorSeparator: () => null }}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group local-forms">
              <label>
                Cantidad <span className="login-danger">*</span>
              </label>
              <input
                className="form-control"
                type="number"
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
            <h5>Historias Agregadas:</h5>
            <ul className="list-group">
              {formData.ginecobstetrica.map((item, idx) => (
                <li
                  key={idx}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    {item.descripcion} - Cantidad: {item.cantidad}
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveHistoria(item.id_descripcion_ginecoobstetrica)}
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

export default Step5;