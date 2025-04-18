// src/components/Steps/Step6.jsx

import React from "react";
import Select from "react-select";

const Step6 = ({ formData, setFormData, onSubmit }) => {
  const {
    nombre_completo,
    numero_identidad,
    telefono,
    correo_electronico,
    direccion,
    fecha_nacimiento,
    edad,
    id_sexo,
    nacionalidad,
    id_estado_civil,
    id_documento,
    id_ocupacion,
    patologiasFamiliares,
    patologiasPersonales,
    antecedentesHospitalarios,
    habitosToxicos,
    ginecobstetrica,
    como_se_entero,
  } = formData;

  console.log(formData)

  const OPCIONES = [
    { value: "Redes Sociales", label: "Redes Sociales" },
    { value: "Por un Familiar", label: "Por un Familiar" },
    { value: "Recomendación", label: "Recomendación" },
    { value: "Publicidad", label: "Publicidad" },
    { value: "Otros", label: "Otros" },
  ];

  const handleChange = (key, value) => {
    if (typeof setFormData === "function") {
      setFormData((prev) => ({ ...prev, [key]: value }));
    } else {
      console.error("setFormData no es una función válida.");
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-4">
          <label>
            <strong>¿Cómo se enteró?</strong>
          </label>
          <Select
            value={como_se_entero}
            onChange={(option) => handleChange("como_se_entero", option)}
            options={OPCIONES}
            placeholder="Seleccione una opción"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "10px",
                minHeight: "45px",
              }),
            }}
          />
        </div>
        <hr />
        {como_se_entero &&
          como_se_entero.value && ( // Mostrar solo si como_se_entero tiene un valor
            <>
              <h4 className="form-heading mb-4">Confirmar Datos</h4>
              <p>
                <strong>Nombre Completo:</strong> {nombre_completo}
              </p>
              <p>
                <strong>Identidad:</strong> {numero_identidad}
              </p>
              <p>
                <strong>Teléfono:</strong> {telefono}
              </p>
              <p>
                <strong>Correo Electrónico:</strong> {correo_electronico}
              </p>
              <p>
                <strong>Dirección:</strong> {direccion}
              </p>
              <p>
                <strong>Fecha de Nacimiento:</strong> {fecha_nacimiento}
              </p>
              <p>
                <strong>Edad:</strong> {edad}
              </p>
              <p>
                <strong>Sexo:</strong> {id_sexo?.label}
              </p>
              <p>
                <strong>Nacionalidad:</strong> {nacionalidad?.label}
              </p>
              <p>
                <strong>Estado Civil:</strong> {id_estado_civil?.label}
              </p>
              <p>
                <strong>Tipo de Documento:</strong> {id_documento?.value}
              </p>
              <p>
                <strong>Ocupación:</strong> {id_ocupacion?.label}
              </p>

              <hr />
              <p>
                <strong>Patologías Familiares:</strong>
              </p>
              {patologiasFamiliares.length > 0 ? ( 
                <ul>
                  {patologiasFamiliares.map((item, index) => (
                    <li key={index}>
                      {item.patologia} - {item.parentesco}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay patologías familiares registradas.</p>
              )}

              <p>
                <strong>Patologías Personales:</strong>
              </p>
              {patologiasPersonales.length > 0 ? (
                <ul>
                  {patologiasPersonales.map((item, index) => (
                    <li key={index}>
                      {item.patologia} - Medicamentos: {item.medicamentos},
                      Dosis: {item.dosis}, Horario: {item.horario}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay patologías personales registradas.</p>
              )}

              <p>
                <strong>Antecedentes Hospitalarios:</strong>
              </p>
              {antecedentesHospitalarios.length > 0 ? (
                <ul>
                  {antecedentesHospitalarios.map((item, index) => (
                    <li key={index}>
                      {item.antecedente} - {item.descripcion}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay antecedentes hospitalarios registrados.</p>
              )}

              <p>
                <strong>Hábitos Tóxicos:</strong>
              </p>
              {habitosToxicos.length > 0 ? (
                <ul>
                  {habitosToxicos.map((item, index) => (
                    <li key={index}>{item.descripcion}</li>
                  ))}
                </ul>
              ) : (
                <p>No hay hábitos tóxicos registrados.</p>
              )}

              {id_sexo?.label?.toLowerCase() === "femenino" && (
                <>
                  <p>
                    <strong>Historia Ginecobstétrica:</strong>
                  </p>
                  {ginecobstetrica.length > 0 ? (
                    <ul>
                      {ginecobstetrica.map((item, index) => (
                        <li key={index}>
                          {item.descripcion} - Valor: {item.valor}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No hay datos ginecobstétricos registrados.</p>
                  )}
                </>
              )}

              <div className="mb-4">
                <label className="mb-3">
                  <strong>¿Cómo se enteró?</strong>
                </label>
                <p>{como_se_entero.value}</p>
              </div>
              <hr />

              <div className="text-end mt-4">
                <button className="btn btn-success" onClick={onSubmit}>
                  Confirmar y Enviar
                </button>
              </div>
            </>
          )}
      </div>
    </div>
  );
};

export default Step6;
