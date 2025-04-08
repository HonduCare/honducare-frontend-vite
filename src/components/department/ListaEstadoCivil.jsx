import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../Helpers/userContext";
import { Table, Button, Modal, Form, Input } from "antd";
import { Link } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Swal from "sweetalert2";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";

const ListaEstadoCivil = () => {
  const { usuarioLogged } = useContext(UserContext);
  const { reset, control, handleSubmit, setValue } = useForm();
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [estadoCivil, setEstadoCivil] = useState([]);
  const [estado, setEstado] = useState({});
  const [mode, setMode] = useState("");
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  const showRoleModal = () => {
    setIsRoleModalVisible(true);
  };

  const handleRoleCancel = () => {
    reset();
    setIsRoleModalVisible(false);
  };

  // Obtener lista de estados civiles
  const obtenerEstadoC = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/obtener/estadoCivil/estadosCivil`
      );
      setEstadoCivil(response.data);
    } catch (error) {
      console.error("Error al obtener los estados civiles:", error);
    }
  };

  // Crear o editar Estado Civil
  const onSubmit = async (data) => {
    try {
      if (mode === "crear") {
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_API_URL}/crear/estadoCivil`,
          data
        );
        if (response.status === 200) {
          handleSave();
          obtenerEstadoC();
          handleRoleCancel();
        }
      } else if (mode === "editar") {
        const response = await axios.put(
          `${import.meta.env.VITE_REACT_APP_API_URL}/actualizar/estadoCivil/${
            estado.id_estado_civil
          }`,
          data
        );
        if (response.status === 200) {
          Swal.fire({
            title: "Estado Civil editado exitosamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
          obtenerEstadoC();
          handleRoleCancel();
        }
      }
    } catch (error) {
      console.error("Error al guardar el estado civil:", error);
    }
  };

  // Eliminar Estado Civil
  const eliminarEstadoC = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_APP_API_URL}/eliminar/estadoCivil/${id}`
      );
      if (response.status === 200) {
        Swal.fire({
          title: "Estado Civil eliminado exitosamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        obtenerEstadoC();
      }
    } catch (error) {
      console.error("Error al eliminar el estado civil:", error);
    }
  };

  // Editar Estado Civil
  const handleEditEstado = (data) => {
    setEstado(data);
    setMode("editar");
    setValue("id_estado_civil", data?.id_estado_civil);
    setValue("descripcion", data?.descripcion);
    showRoleModal();
  };

  const handleSave = () => {
    Swal.fire({
      icon: "success",
      title: "¡Estado Civil Agregado con Éxito!",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  useEffect(() => {
    obtenerEstadoC();
  }, []);

  const EstadosColumns = [
    {
      title: "Estado Civil",
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
                    onClick={() => eliminarEstadoC(record.id_estado_civil)}
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
        activeClassName="lista-estadocivil"
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
                  <li className="breadcrumb-item active">Estado Civil</li>
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
                        <h3>Estado Civil</h3>
                      </div>
                      <div className="col-auto">
                        {usuarioLogged?.rol?.permisos.some(
                          (permiso) => permiso.nombre === "registrar"
                        ) && (
                          <Button
                            type="primary"
                            onClick={() => {
                              setMode("crear");
                              showRoleModal();
                            }}
                            className="btn-primary"
                          >
                            Crear Estado Civil
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <Table
                    columns={EstadosColumns}
                    dataSource={estadoCivil}
                    rowKey="id_estado_civil"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={mode === "editar" ? "Editar Estado Civil" : "Crear Estado Civil"}
        open={isRoleModalVisible}
        onCancel={handleRoleCancel}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {mode === "editar" && (
            <Form.Item label="ID Estado Civil">
              <Controller
                name="id_estado_civil"
                control={control}
                render={({ field }) => <Input {...field} disabled />}
              />
            </Form.Item>
          )}
          <Form.Item label="Descripción">
            <Controller
              name="descripcion"
              control={control}
              rules={{ required: true }}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ListaEstadoCivil;
