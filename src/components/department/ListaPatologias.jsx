/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../Helpers/userContext";
import { Table, Button, Modal, Form, Input, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../Header";
import Sidebar from "../Sidebar";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";

const { Option } = Select;

const ListaPatologias = () => {
  const { usuarioLogged } = useContext(UserContext);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [isPermissionModalVisible, setIsPermissionModalVisible] =
    useState(false);
  const [patologias, setPatologias] = useState([]);
  const [patologia, setPatologia] = useState({});
  const { handleSubmit, reset, setValue, control } = useForm({});
  const [mode, setMode] = useState("");
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  const showRoleModal = () => {
    setIsRoleModalVisible(true);
  };

  const handleRoleOk = () => {
    setIsRoleModalVisible(false);
  };

  const handleRoleCancel = () => {
    setValue("id_patologia", "");
    setValue("descripcion", "");
    setIsRoleModalVisible(false);
  };

  const showPermissionModal = () => {
    setIsPermissionModalVisible(true);
  };

  const handlePermissionOk = () => {
    setIsPermissionModalVisible(false);
  };

  const handlePermissionCancel = () => {
    setIsPermissionModalVisible(false);
  };

  const handleEditPatologia = (data) => {
    setPatologia(data);
    setMode("editar");
    console.log(data);
    setValue("id_patologia", data?.id_patologia);
    setValue("descripcion", data?.descripcion);
    showRoleModal();
  };

  const obtenerPatologias = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/obtener/patologias/patologias`
      );

      setPatologias(response.data);
    } catch (error) {
      console.error("Error al obtener las patologia:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log(data, mode);
      if (mode === "crear") {
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_API_URL}/patologias/crear/`,
          data
        );
        if (response.status === 200) {
          reset();
          handleSave();
          obtenerPatologias();
          handleRoleCancel();
        }
      } else if (mode === "editar") {
        const response = await axios.put(
          `${import.meta.env.VITE_REACT_APP_API_URL}/actualizar/patologias/${
            patologia.id_patologia
          }`,
          data
        );
        if (response.status === 200) {
          Swal.fire({
            title: "Patología editada exitosamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
          obtenerPatologias();
          handleRoleCancel();
        }
      }

      // const response = await axios.post('${import.meta.env.VITE_REACT_APP_API_URL}/patologias/crear', data);
      // if (response.status === 200) {
      //   reset()
      //   handleSave()
      //   obtenerPatologias();
      // }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  const eliminarPatologias = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_APP_API_URL}/eliminar/patologias/${id}`
      );
      if (response.status === 200) {
        Swal.fire({
          title: "Patología eliminada exitosamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        obtenerPatologias();
      }
    } catch (error) {
      console.error("Error al eliminar la patologia:", error);
    }
  };

  useEffect(() => {
    obtenerPatologias();
  }, []);

  const patologiaColumns = [
    {
      title: "Patologia",
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
            {" "}
            {/* Cambiado de 'text-end' a 'text-start' */}
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
                    onClick={() => {
                      handleEditPatologia(record);
                    }}
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
                    onClick={() => eliminarPatologias(record.id_patologia)}
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

  const navigate = useNavigate();
  const handleSave = () => {
    Swal.fire({
      icon: "success",
      title: "¡Patología Agregada con Exito!",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      setIsPermissionModalVisible(false);
    });
  };

  return (
    <>
      <Header />
      <Sidebar
        id="menu-item6"
        id1="menu-items6"
        activeClassName="lista-patologias"
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
                  <li className="breadcrumb-item active">Patologias</li>
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
                        <h3>Patologias</h3>
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
                            Crear Patología
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <Table
                    columns={patologiaColumns}
                    dataSource={patologias} // Datos de ejemplo para roles
                    rowKey="patologia"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para crear Rol */}
      <Modal
        title={mode === "editar" ? "Editar Patologia" : "Crear Patologia"}
        open={isRoleModalVisible}
        //onOk={handleSave}
        onCancel={handleRoleCancel}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {mode === "editar" && (
            <Form.Item
              label="Id patologia"
              rules={[
                {
                  required: mode === "editar" ? true : false,
                  message: "Por favor ingrese el id de la patologia",
                },
              ]}
            >
              <Controller
                name="id_patologia"
                control={control}
                render={({ field }) => <Input {...field} disabled />}
              />
            </Form.Item>
          )}
          <Form.Item
            label="Nombre de la patologia"
            rules={[
              {
                required: true,
                message: "Por favor ingrese el nombre de la patologia",
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

export default ListaPatologias;
