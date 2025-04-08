import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Modal, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { UserContext } from "../Helpers/userContext";
import Swal from "sweetalert2";
import Header from "../Header";
import Sidebar from "../Sidebar";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";

const ListaAntecedentes = () => {
  const { usuarioLogged } = useContext(UserContext);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [antecedentes, setAntecedentes] = useState([]);
  const [antecedente, setAntecedente] = useState({});
  const { handleSubmit, reset, setValue, control } = useForm();
  const [mode, setMode] = useState("");
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const showRoleModal = () => {
    setIsRoleModalVisible(true);
  };

  const handleRoleCancel = () => {
    setValue("id_descripcion_antecedente", "");
    setValue("descripcion", "");
    setIsRoleModalVisible(false);
  };

  const obtenerAntecedente = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/obtener/antecedentes/antecedente`
      );
      setAntecedentes(response.data);
    } catch (error) {
      console.error("Error al obtener los antecedentes:", error);
    }
  };

  const handleEditAntecedente = (data) => {
    setAntecedente(data);
    setMode("editar");
    setValue("id_descripcion_antecedente", data?.id_descripcion_antecedente);
    setValue("descripcion", data?.descripcion);
    showRoleModal();
  };

  const onSubmit = async (data) => {
    try {
      console.log("Datos enviados al servidor:", data);
      if (mode === "crear") {
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_API_URL}/crear/antecedente/`,
          data
        );
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "¡Antecedente Agregado con Exito!",
            showConfirmButton: false,
            timer: 1500,
          });
          reset();
          obtenerAntecedente();
          handleRoleCancel();
        }
      } else if (mode === "editar") {
        const response = await axios.put(
          `${import.meta.env.VITE_REACT_APP_API_URL}/actualizar/antecedentes/${
            antecedente.id_descripcion_antecedente
          }`,
          data
        );
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Antecedente editado exitosamente",
            confirmButtonText: "Aceptar",
          });
          obtenerAntecedente();
          handleRoleCancel();
        }
      }
    } catch (error) {
      console.error("Error al procesar el antecedente:", error);
    }
  };

  const eliminarAntecedente = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_APP_API_URL}/eliminar/antecedentes/${id}`
      );
      if (response.status === 200) {
        Swal.fire({
          title: "Antecedente eliminado exitosamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        obtenerAntecedente();
      }
    } catch (error) {
      console.error("Error al eliminar el antecedente:", error);
    }
  };

  useEffect(() => {
    obtenerAntecedente();
  }, []);

  const antecentesColumns = [
    {
      title: "Antecedente",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <div className="text-start">
          <div className="dropdown dropdown-action">
            <Link
              to="#"
              className="action-icon dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-ellipsis-v" />
            </Link>
            <div className="dropdown-menu dropdown-menu-start">
              {usuarioLogged?.rol?.permisos.some(
                (permiso) => permiso.nombre === "actualizar"
              ) && (
                <button
                  className="dropdown-item"
                  onClick={() => handleEditAntecedente(record)}
                >
                  <i className="far fa-edit me-2" />
                  Editar
                </button>
              )}

              {usuarioLogged?.rol?.permisos.some(
                (permiso) => permiso.nombre === "eliminar"
              ) && (
                <button
                  className="dropdown-item"
                  onClick={() =>
                    eliminarAntecedente(record.id_descripcion_antecedente)
                  }
                >
                  <i className="fa fa-trash-alt m-r-5"></i> Eliminar
                </button>
              )}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Header />
      <Sidebar id="menu-item6" activeClassName="lista-antecedentes" />
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="#">Mantenimiento</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right">
                      <FeatherIcon icon="chevron-right" />
                    </i>
                  </li>
                  <li className="breadcrumb-item active">
                    Antecedentes Hospitalarios
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table">
                <div className="card-body">
                  <div className="page-table-header mb-2">
                    <div className="row align-items-center">
                      <div className="col">
                        <h3>Antecedentes</h3>
                      </div>
                      <div className="col-auto text-end">
                        {usuarioLogged?.rol?.permisos.some(
                          (permiso) => permiso.nombre === "registrar"
                        ) && (
                          <Button
                            type="primary"
                            onClick={() => {
                              showRoleModal();
                              setMode("crear");
                            }}
                            className="btn-primary"
                          >
                            Crear Antecedente
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <Table
                    columns={antecentesColumns}
                    dataSource={antecedentes}
                    rowKey="id_descripcion_antecedente"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para crear o editar Antecedente */}
      <Modal
        title={mode === "editar" ? "Editar Antecedente" : "Crear Antecedente"}
        open={isRoleModalVisible}
        onCancel={handleRoleCancel}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {mode === "editar" && (
            <Form.Item label="ID Antecedente">
              <Controller
                name="id_descripcion_antecedente"
                control={control}
                render={({ field }) => <Input {...field} disabled />}
              />
            </Form.Item>
          )}
          <Form.Item
            label="Nombre del Antecedente"
            rules={[{ required: true }]}
          >
            <Controller
              name="descripcion"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Enviar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ListaAntecedentes;
