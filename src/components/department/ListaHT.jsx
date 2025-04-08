import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../Helpers/userContext";
import { Table, Button, Modal, Form, Input } from "antd";
import { Link } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Swal from "sweetalert2";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";

const ListaHT = () => {
  const { usuarioLogged } = useContext(UserContext);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [habitosT, setHabitosT] = useState([]);
  const [habito, setHabito] = useState({});
  const { handleSubmit, reset, setValue, control } = useForm({});
  const [mode, setMode] = useState("");
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  const showRoleModal = () => {
    setIsRoleModalVisible(true);
  };

  const handleRoleCancel = () => {
    setValue("id_descripcion_habitos", "");
    setValue("descripcion", "");
    setIsRoleModalVisible(false);
  };

  // Obtener lista de hábitos tóxicos
  const obtenerHT = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/obtener/habitos/habitos`
      );
      setHabitosT(response.data);
      console.log("Lista  dehabitos toxicos: ", response.data);
    } catch (error) {
      console.error("Error al obtener los hábitos tóxicos:", error);
    }
  };

  // Crear o editar hábito tóxico
  const onSubmit = async (data) => {
    try {
      if (mode === "crear") {
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_API_URL}/crear/habitos`,
          data
        );
        if (response.status === 200) {
          reset();
          handleSave();
          obtenerHT();
        }
      } else if (mode === "editar") {
        const response = await axios.put(
          `${import.meta.env.VITE_REACT_APP_API_URL}/actualizar/habitos/${
            habito.id_descripcion_habitos
          }`,
          data
        );
        if (response.status === 200) {
          Swal.fire({
            title: "Hábito tóxico editado exitosamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
          obtenerHT();
          handleRoleCancel();
        }
      }
    } catch (error) {
      console.error("Error al guardar el hábito tóxico:", error);
    }
  };

  // Editar hábito tóxico
  const handleEditHT = (data) => {
    setHabito(data);
    setMode("editar");
    setValue("id_descripcion_habitos", data?.id_descripcion_habitos);
    setValue("descripcion", data?.descripcion);
    showRoleModal();
  };

  // Eliminar hábito tóxico
  const eliminarHT = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_APP_API_URL}/eliminar/habitos/${id}`
      );
      if (response.status === 200) {
        Swal.fire({
          title: "Hábito tóxico eliminado exitosamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        obtenerHT();
      }
    } catch (error) {
      console.error("Error al eliminar el hábito tóxico:", error);
    }
  };

  useEffect(() => {
    obtenerHT();
  }, []);

  // Columnas de la tabla
  const htColumns = [
    {
      title: "Hábito Tóxico",
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
                    onClick={() => handleEditHT(record)}
                  >
                    <i className="far fa-edit me-2" />
                    Editar
                  </button>
                )}
                {/* Mostrar opción "Eliminar" si tiene permiso "eliminar" */}
                {hasDeletePermission && (
                  <button
                    className="dropdown-item"
                    onClick={() => eliminarHT(record.id_descripcion_habitos)}
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

  const handleSave = () => {
    Swal.fire({
      icon: "success",
      title: "¡Hábito Tóxico Agregado con Éxito!",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      setIsRoleModalVisible(false);
    });
  };

  return (
    <>
      <Header />
      <Sidebar id="menu-item6" id1="menu-items6" activeClassName="lista-ht" />
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="#">Mantenimiento</Link>
                  </li>
                  <li className="breadcrumb-item active">Hábitos Tóxicos</li>
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
                        <h3>Hábitos Tóxicos</h3>
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
                            Crear Hábito Tóxico
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <Table
                    columns={htColumns}
                    dataSource={habitosT}
                    rowKey="id_descripcion_habitos"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Crear/Editar Ocupación */}
      <Modal
        title={
          mode === "editar" ? "Editar habito toxico" : "Crear habito toxico"
        }
        open={isRoleModalVisible}
        onCancel={handleRoleCancel}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {mode === "editar" && (
            <Form.Item label="ID Habito toxico">
              <Controller
                name="id_descripcion_habitos"
                control={control}
                render={({ field }) => <Input {...field} disabled />}
              />
            </Form.Item>
          )}
          <Form.Item
            label="Nombre del Habito toxico"
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

export default ListaHT;
