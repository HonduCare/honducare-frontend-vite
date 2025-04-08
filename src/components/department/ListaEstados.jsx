import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../Helpers/userContext";
import { Table, Button, Modal, Form, Input } from "antd";
import { Link } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import Swal from "sweetalert2";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";

const ListaEstados = () => {
  const { usuarioLogged } = useContext(UserContext);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [estados, setEstados] = useState([]);
  const [estado, setEstado] = useState({});
  const [mode, setMode] = useState("");
  const { handleSubmit, reset, setValue, control } = useForm({});
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL; // Obtiene la URL base desde el .env

  const showRoleModal = () => {
    setIsRoleModalVisible(true);
  };

  const handleRoleCancel = () => {
    reset();
    setIsRoleModalVisible(false);
  };

  // Obtener los estados desde el servidor
  const obtenerEstado = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/obtener/estadoCita/estados`
      );
      setEstados(response.data);
    } catch (error) {
      console.error("Error al obtener los estados:", error);
    }
  };

  // Manejar la creación y edición de estados
  const onSubmit = async (data) => {
    try {
      if (mode === "crear") {
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_API_URL}/crear/estadoCita`,
          data
        );
        if (response.status === 200) {
          Swal.fire("¡Estado agregado con éxito!", "", "success");
          obtenerEstado();
          handleRoleCancel();
        }
      } else if (mode === "editar") {
        const response = await axios.put(
          `${import.meta.env.VITE_REACT_APP_API_URL}/actualizar/estadoCita/${
            estado.id_estado_cita
          }`,
          data
        );
        if (response.status === 200) {
          Swal.fire("Estado editado exitosamente", "", "success");
          obtenerEstado();
          handleRoleCancel();
        }
      }
    } catch (error) {
      console.error("Error al procesar el estado:", error);
    }
  };

  // Manejar la eliminación de un estado
  const eliminarEstado = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_APP_API_URL}/eliminar/estadoCita/${id}`
      );
      if (response.status === 200) {
        Swal.fire("Estado eliminado exitosamente", "", "success");
        obtenerEstado();
      }
    } catch (error) {
      console.error("Error al eliminar el estado:", error);
    }
  };

  // Manejar la edición de un estado
  const handleEditEstado = (data) => {
    setEstado(data);
    setMode("editar");
    setValue("id_estado_cita", data.id_estado_cita);
    setValue("descripcion", data.descripcion);
    showRoleModal();
  };

  useEffect(() => {
    obtenerEstado();
  }, []);

  const estadosColumns = [
    {
      title: "Estado",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "",
      key: "actions",
      render: (text, record) => {
        const hasUpdatePermission = usuarioLogged?.rol?.permisos.some(
          (permiso) => permiso.nombre === "actualizar"
        );
        const hasDeletePermission = usuarioLogged?.rol?.permisos.some(
          (permiso) => permiso.nombre === "eliminar"
        );

        // Si no tiene permisos adicionales, no mostrar nada
        if (!hasUpdatePermission && !hasDeletePermission) {
          return null;
        }

        return (
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
                {/* Mostrar opción "Editar" si tiene permiso "actualizar" */}
                {hasUpdatePermission && (
                  <button
                    className="dropdown-item"
                    onClick={() => handleEditEstado(record)}
                  >
                    <i className="far fa-edit me-2" />
                    Editar
                  </button>
                )}
                {/* Mostrar opción "Eliminar" si tiene permiso "eliminar" */}
                {hasDeletePermission && (
                  <button
                    className="dropdown-item"
                    onClick={() => eliminarEstado(record.id_estado_cita)}
                  >
                    <i className="fa fa-trash-alt m-r-5"></i> Eliminar
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Header />
      <Sidebar
        id="menu-item6"
        id1="menu-items6"
        activeClassName="lista-estados"
      />
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
                  <li className="breadcrumb-item active">Estados</li>
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
                        <h3>Estados de Cita</h3>
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
                            Crear Estado
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <Table
                    columns={estadosColumns}
                    dataSource={estados}
                    rowKey="id_estado"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={mode === "editar" ? "Editar Estado" : "Crear Estado"}
        open={isRoleModalVisible}
        onCancel={handleRoleCancel}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {mode === "editar" && (
            <Form.Item label="ID Estado">
              <Controller
                name="id_estado_cita"
                control={control}
                render={({ field }) => <Input {...field} disabled />}
              />
            </Form.Item>
          )}
          <Form.Item
            label="Descripcion"
            rules={[{ required: true, message: "Ingrese el Estado" }]}
          >
            <Controller
              name="descripcion"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {mode === "editar" ? "Guardar Cambios" : "Crear"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ListaEstados;
