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

const ListaSexos = () => {
  const { usuarioLogged } = useContext(UserContext);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [sexos, setSexos] = useState([]);
  const [sexo, setSexo] = useState({});
  const { handleSubmit, reset, setValue, control } = useForm({});
  const [mode, setMode] = useState("");
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL; // Obtiene la URL base desde el .env

  const showRoleModal = () => {
    setIsRoleModalVisible(true);
  };

  const handleRoleCancel = () => {
    setValue("id_sexo", "");
    setValue("descripcion", "");
    setIsRoleModalVisible(false);
  };

  const obtenerSexos = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/obtener/sexo/sexos`
      );
      setSexos(response.data);
    } catch (error) {
      console.error("Error al obtener los sexos:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (mode === "crear") {
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_API_URL}/crear/sexo`,
          data
        );
        if (response.status === 200) {
          reset();
          handleSave();
          obtenerSexos();
          handleRoleCancel();
        }
      } else if (mode === "editar") {
        const response = await axios.put(
          `${import.meta.env.VITE_REACT_APP_API_URL}/actualizar/sexo/${
            sexo.id_sexo
          }`,
          data
        );
        if (response.status === 200) {
          Swal.fire({
            title: "Sexo editado exitosamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
          obtenerSexos();
          handleRoleCancel();
        }
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  const handleEditSexo = (data) => {
    setSexo(data);
    setMode("editar");
    setValue("id_sexo", data?.id_sexo);
    setValue("descripcion", data?.descripcion);
    showRoleModal();
  };

  const eliminarSexo = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_APP_API_URL}/eliminar/sexo/${id}`
      );
      if (response.status === 200) {
        Swal.fire({
          title: "Sexo eliminado exitosamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        obtenerSexos();
      }
    } catch (error) {
      console.error("Error al eliminar el sexo:", error);
    }
  };

  useEffect(() => {
    obtenerSexos();
  }, []);

  const sexosColumns = [
    {
      title: "Sexo",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => {
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
                    onClick={() => handleEditSexo(record)}
                  >
                    <i className="far fa-edit me-2" />
                    Editar
                  </button>
                )}
                {/* Mostrar opción "Eliminar" si tiene permiso "eliminar" */}
                {hasDeletePermission && (
                  <button
                    className="dropdown-item"
                    onClick={() => eliminarSexo(record.id_sexo)}
                  >
                    <i className="fa fa-trash-alt m-r-5" />
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  const handleSave = () => {
    Swal.fire({
      icon: "success",
      title: "¡Sexo Agregado con Exito!",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      setIsRoleModalVisible(false);
    });
  };

  return (
    <>
      <Header />
      <Sidebar id="menu-item6" id1="menu-items6" activeClassName="lista-sexo" />
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
                  <li className="breadcrumb-item active">Sexo</li>
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
                        <h3>Sexo</h3>
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
                            Crear Sexo
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <Table
                    columns={sexosColumns}
                    dataSource={sexos}
                    rowKey="id_sexo"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={mode === "editar" ? "Editar Sexo" : "Crear Sexo"}
        open={isRoleModalVisible}
        onCancel={handleRoleCancel}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {mode === "editar" && (
            <Form.Item label="Id sexo">
              <Controller
                name="id_sexo"
                control={control}
                render={({ field }) => <Input {...field} disabled />}
              />
            </Form.Item>
          )}
          <Form.Item
            label="Nombre del sexo"
            rules={[
              {
                required: true,
                message: "Por favor ingrese el nombre del sexo",
              },
            ]}
          >
            <Controller
              name="descripcion"
              control={control}
              rules={{ required: true }}
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

export default ListaSexos;
