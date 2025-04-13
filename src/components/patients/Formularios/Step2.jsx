import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

const Step2 = ({ formData, setFormData }) => {
  const [patologias, setPatologias] = useState([]);
  const [selectedPatologia, setSelectedPatologia] = useState(null);
  const [tipoPatologia, setTipoPatologia] = useState("familiar");
  const [parentesco, setParentesco] = useState(null);
  const [medicamentos, setMedicamentos] = useState("");
  const [dosis, setDosis] = useState("");
  const [horario, setHorario] = useState("");

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

  useEffect(() => {
    const fetchPatologias = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/obtener/patologias/patologias`);
        const options = res.data.map((p) => ({
          value: p.id_patologia,
          label: p.descripcion,
        }));
        setPatologias(options);
      } catch (error) {
        console.error("Error al obtener patologías:", error);
      }
    };
    fetchPatologias();
  }, []);

  const handleAddPatologia = () => {
    if (!selectedPatologia) return;

    const nuevaPatologia = {
      id_patologia: selectedPatologia.value,
      patologia: selectedPatologia.label,
      tipo: tipoPatologia,
    };

    if (tipoPatologia === "familiar" && parentesco) {
      nuevaPatologia.parentesco = parentesco.label;
      setFormData((prev) => ({
        ...prev,
        patologiasFamiliares: [...prev.patologiasFamiliares, nuevaPatologia],
      }));
    } else if (tipoPatologia === "personal" && medicamentos && dosis && horario) {
      nuevaPatologia.medicamentos = medicamentos;
      nuevaPatologia.dosis = dosis;
      nuevaPatologia.horario = horario;
      setFormData((prev) => ({
        ...prev,
        patologiasPersonales: [...prev.patologiasPersonales, nuevaPatologia],
      }));
    }

    setSelectedPatologia(null);
    setParentesco(null);
    setMedicamentos("");
    setDosis("");
    setHorario("");
  };

  const handleRemovePatologia = (tipo, idx) => {
    if (tipo === "familiar") {
      setFormData((prev) => ({
        ...prev,
        patologiasFamiliares: prev.patologiasFamiliares.filter((_, index) => index !== idx),
      }));
    } else if (tipo === "personal") {
      setFormData((prev) => ({
        ...prev,
        patologiasPersonales: prev.patologiasPersonales.filter((_, index) => index !== idx),
      }));
    }
  };

  // Filtrar patologías para que no se puedan volver a agregar
  const filteredPatologias = patologias.filter(
    (p) =>
      ![...formData.patologiasFamiliares, ...formData.patologiasPersonales].some(
        (item) => item.id_patologia === p.value
      )
  );

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="form-heading mb-4">Patologías</h4>
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
                options={filteredPatologias} // Usar la lista filtrada
                components={{ IndicatorSeparator: () => null }}
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
                    type="time"
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
              {formData.patologiasFamiliares.map((item, idx) => (
                <li
                  key={`familiar-${idx}`}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    {item.patologia} (Familiar) - Parentesco: {item.parentesco}
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemovePatologia("familiar", idx)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
              {formData.patologiasPersonales.map((item, idx) => (
                <li
                  key={`personal-${idx}`}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    {item.patologia} (Personal) - Medicamentos: {item.medicamentos}, Dosis: {item.dosis}, Horario: {item.horario}
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemovePatologia("personal", idx)}
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

export default Step2;