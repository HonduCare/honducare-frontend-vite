import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../Helpers/userContext";
import { Table, Button, Modal, Form, Input } from "antd";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../Header";
import Sidebar from "../Sidebar";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";

const ListaOcupaciones = () => {
  const { usuarioLogged } = useContext(UserContext);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [ocupaciones, setOcupaciones] = useState([]);
  const [ocupacion, setOcupacion] = useState({});
  const { handleSubmit, reset, setValue, control } = useForm({});
  const [mode, setMode] = useState("");
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  const showRoleModal = () => {
    setIsRoleModalVisible(true);
  };

  const handleRoleCancel = () => {
    setValue("id_ocupacion", "");
    setValue("descripcion", "");
    setIsRoleModalVisible(false);
  };

  // Obtener ocupaciones
  const obtenerOcupaciones = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/obtener/ocupaciones/ocupacion`
      );
      setOcupaciones(response.data);
    } catch (error) {
      console.error("Error al obtener las ocupaciones:", error);
    }
  };

  // Manejo de envío de formulario
  const onSubmit = async (data) => {
    try {
      if (mode === "crear") {
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_API_URL}/crear/ocupaciones/`,
          data
        );
        if (response.status === 200) {
          reset();
          handleSave();
          obtenerOcupaciones();
          handleRoleCancel();
        }
      } else if (mode === "editar") {
        const response = await axios.put(
          `${import.meta.env.VITE_REACT_APP_API_URL}/actualizar/ocupaciones/${
            ocupacion.id_ocupacion
          }`,
          data
        );
        if (response.status === 200) {
          Swal.fire({
            title: "Ocupación editada exitosamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
          obtenerOcupaciones();
          handleRoleCancel();
        }
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  // Manejo de edición de ocupación
  const handleEditOcupacion = (data) => {
    setOcupacion(data);
    setMode("editar");
    setValue("id_ocupacion", data?.id_ocupacion);
    setValue("descripcion", data?.descripcion);
    showRoleModal();
  };

  // Eliminar ocupación
  const eliminarOcupacion = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_APP_API_URL}/eliminar/ocupaciones/${id}`
      );
      if (response.status === 200) {
        Swal.fire({
          title: "Ocupación eliminada exitosamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        obtenerOcupaciones();
      }
    } catch (error) {
      console.error("Error al eliminar la ocupación:", error);
    }
  };

  useEffect(() => {
    obtenerOcupaciones();
  }, []);

  // Columnas de la tabla
  const ocupacionColumns = [
    {
      title: "Ocupación",
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
                    onClick={() => handleEditOcupacion(record)}
                    style={{ padding: "0.25rem 1rem" }}
                  >
                    <i className="far fa-edit me-2" />
                    Editar
                  </button>
                )}
                {/* Mostrar opción "Eliminar" si tiene permiso "eliminar" */}
                {hasDeletePermission && (
                  <button
                    className="dropdown-item"
                    onClick={() => eliminarOcupacion(record.id_ocupacion)}
                    style={{ padding: "0.25rem 1rem" }}
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

  // Manejo de alerta de éxito
  const handleSave = () => {
    Swal.fire({
      icon: "success",
      title: "¡Ocupación Agregada con Éxito!",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      setIsRoleModalVisible(false);
    });
  };

  return (
    <>
      <Header />
      <Sidebar
        id="menu-item6"
        id1="menu-items6"
        activeClassName="lista-ocupaciones"
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
                  <li className="breadcrumb-item active">Ocupaciones</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table show-entire">
                <div className="card-body">
                  <div className="page-table-header mb-2">
                    <div className="row align-items-center">
                      <div className="col">
                        <h3>Ocupaciones</h3>
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
                            Crear Ocupación
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <Table
                    columns={ocupacionColumns}
                    dataSource={ocupaciones}
                    rowKey="id_ocupacion"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Crear/Editar Ocupación */}
      <Modal
        title={mode === "editar" ? "Editar Ocupación" : "Crear Ocupación"}
        open={isRoleModalVisible}
        onCancel={handleRoleCancel}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {mode === "editar" && (
            <Form.Item label="ID Ocupación">
              <Controller
                name="id_ocupacion"
                control={control}
                render={({ field }) => <Input {...field} disabled />}
              />
            </Form.Item>
          )}
          <Form.Item
            label="Nombre de la Ocupación"
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

export default ListaOcupaciones;
