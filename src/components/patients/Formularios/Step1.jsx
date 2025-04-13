import { useEffect, useState } from "react";
import Select from "react-select";
import moment from "moment";
import axios from "axios";

const Step1 = ({ formData, setFormData, edit  }) => {
  const [genderOptions, setGenderOptions] = useState([]);
  const [civilStatusOptions, setCivilStatusOptions] = useState([]);
  const [occupationOptions, setOccupationOptions] = useState([]);

  const nationalities = [
    { value: 2, label: "Hondureña" },
    { value: 3, label: "Extranjero" },
  ];

  const documentTypes = [ 
    { value: 2, label: "Identidad" },
    { value: 3, label: "Pasaporte" },
    { value: 4, label: "Licencia" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ocupRes, civilRes, sexRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_REACT_APP_API_URL}/obtener/ocupaciones/ocupacion`
          ),
          axios.get(
            `${import.meta.env.VITE_REACT_APP_API_URL}/obtener/estadoCivil/estadosCivil`
          ),
          axios.get(
            `${import.meta.env.VITE_REACT_APP_API_URL}/obtener/sexo/sexos`
          ),
        ]);

        setOccupationOptions(
          ocupRes.data.map((item) => ({
            value: item.id_ocupacion,
            label: item.descripcion,
          }))
        );
        setCivilStatusOptions(
          civilRes.data.map((item) => ({
            value: item.id_estado_civil,
            label: item.descripcion,
          }))
        );
        setGenderOptions(
          sexRes.data.map((item) => ({
            value: item.id_sexo,
            label: item.descripcion,
          }))
        );
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "10px",
      minHeight: "45px",
    }),
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h4 className="form-heading mb-4">Datos Personales</h4>
        <div className="row">
          <div className="col-md-6 mb-4">
            <label>Nombre Completo *</label>
            <input
              className="form-control"
              value={formData.nombre_completo}
              onChange={(e) => handleChange("nombre_completo", e.target.value)}
              readOnly={edit} // Campo de solo lectura si edit es true
            />
          </div>

          <div className="col-md-6 mb-4">
            <label>Identidad *</label>
            <input
              className="form-control"
              value={formData.numero_identidad}
              onChange={(e) => {
                const value = e.target.value;
                // Permitir solo números y limitar a 13 caracteres
                if (/^\d*$/.test(value) && value.length <= 13) {
                  handleChange("numero_identidad", value);
                }
              }}
              maxLength={13} // Asegura que no se puedan ingresar más de 13 caracteres desde el teclado
              placeholder="Ingrese su identidad (13 dígitos)"
              readOnly={edit} // Campo de solo lectura si edit es true
            />
          </div>

          <div className="col-md-6 mb-4">
            <label>Correo Electrónico *</label>
            <input
              className="form-control"
              value={formData.correo_electronico}
              onChange={(e) =>
                handleChange("correo_electronico", e.target.value)
              }
            />
          </div>

          <div className="col-md-6 mb-4">
            <label>Teléfono *</label>
            <input
              className="form-control"
              value={formData.telefono}
              onChange={(e) => {
                const value = e.target.value;
                // Permitir solo números y limitar a 8 caracteres
                if (/^\d*$/.test(value) && value.length <= 8) {
                  handleChange("telefono", value);
                }
              }}
              maxLength={8} // Asegura que no se puedan ingresar más de 8 caracteres desde el teclado
              placeholder="Ingrese su número de teléfono (8 dígitos)"
            />
          </div>

          <div className="col-md-6 mb-4">
            <label>Sexo *</label>
            <Select
              value={formData.id_sexo}
              onChange={(value) => handleChange("id_sexo", value)}
              options={genderOptions}
              styles={selectStyles}
            />
          </div>

          <div className="col-md-6 mb-4">
            <label>Fecha de Nacimiento *</label>
            <input
              type="date"
              className="form-control"
              value={formData.fecha_nacimiento || ""}
              onChange={(e) => {
                const birthDate = e.target.value;
                const today = moment();
                const age = birthDate
                  ? today.diff(moment(birthDate, "YYYY-MM-DD"), "years")
                  : null;

                setFormData((prev) => ({
                  ...prev,
                  fecha_nacimiento: birthDate,
                  edad: age,
                }));
              }}
              required
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Edad</label>
            <input
              className="form-control"
              readOnly
              value={formData.edad || ""}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Nacionalidad *</label>
            <Select
              value={formData.nacionalidad}
              onChange={(value) => handleChange("nacionalidad", value)}
              options={nationalities}
              styles={selectStyles}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Tipo de Documento *</label>
            <Select
              value={formData.id_documento}
              onChange={(value) => handleChange("id_documento", value)}
              options={documentTypes}
              styles={selectStyles}
            />
          </div>

          <div className="col-md-6 mb-4">
            <label>Ocupación *</label>
            <Select
              value={formData.id_ocupacion}
              onChange={(value) => handleChange("id_ocupacion", value)}
              options={occupationOptions}
              styles={selectStyles}
            />
          </div>

          <div className="col-md-6 mb-4">
            <label>Estado Civil *</label>
            <Select
              value={formData.id_estado_civil}
              onChange={(value) => handleChange("id_estado_civil", value)}
              options={civilStatusOptions}
              styles={selectStyles}
            />
          </div>

          <div className="col-12 mb-4">
            <label>Dirección *</label>
            <textarea
              className="form-control"
              value={formData.direccion || ""}
              onChange={(e) => handleChange("direccion", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1;