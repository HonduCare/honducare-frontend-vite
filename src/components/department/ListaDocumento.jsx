import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Modal, Form, Input } from "antd";
import { Link } from "react-router-dom";
import UserContext from "../Helpers/userContext";
import Header from "../Header";
import Sidebar from "../Sidebar";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import Swal from "sweetalert2";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";

const ListaDocumento = () => {
  const { usuarioLogged } = useContext(UserContext);
  const { reset, control, handleSubmit, setValue } = useForm();
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [TipoD, setTipoD] = useState([]);
  const [documento, setDocumento] = useState({});
  const [mode, setMode] = useState("");

  const showRoleModal = () => {
    setIsRoleModalVisible(true);
  };

  const handleRoleCancel = () => {
    setValue("id_documento", "");
    setValue("tipo_documento", "");
    setIsRoleModalVisible(false);
  };
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const obtenerTipoD = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/obtener/tipoDocumento/tiposDocumentos`
      );
      setTipoD(response.data);
    } catch (error) {
      console.error("Error al obtener los tipos de documentos:", error);
    }
  };

  const handleEditTipoD = (data) => {
    setDocumento(data);
    setMode("editar");
    setValue("id_documento", data?.id_documento);
    setValue("tipo_documento", data?.tipo_documento);
    showRoleModal();
  };

  const onSubmit = async (data) => {
    try {
      if (mode === "crear") {
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_API_URL}/crear/tipoDocumento`,
          data
        );
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Tipo de documento creado exitosamente",
            showConfirmButton: false,
            timer: 1500,
          });
          reset();
          obtenerTipoD();
          handleRoleCancel();
        }
      } else if (mode === "editar") {
        const response = await axios.put(
          `${import.meta.env.VITE_REACT_APP_API_URL}/actualizar/tipoDocumento/${
            documento.id_documento
          }`,
          data
        );
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Tipo de documento editado exitosamente",
            confirmButtonText: "Aceptar",
          });
          obtenerTipoD();
          handleRoleCancel();
        }
      }
    } catch (error) {
      console.error("Error al crear/editar el tipo de documento:", error);
    }
  };

  const eliminarTipoD = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_APP_API_URL}/eliminar/tipoDocumento/${id}`
      );
      if (response.status === 200) {
        Swal.fire({
          title: "Tipo de documento eliminado exitosamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        obtenerTipoD();
      }
    } catch (error) {
      console.error("Error al eliminar el tipo de documento:", error);
    }
  };

  useEffect(() => {
    obtenerTipoD();
  }, []);

  const TipoDColumns = [
    {
      title: "Tipo de documento",
      dataIndex: "tipo_documento",
      key: "tipo_documento",
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
                    onClick={() => handleEditTipoD(record)}
                  >
                    <i className="far fa-edit me-2" /> Editar
                  </button>
                )}
                {/* Mostrar opción "Eliminar" si tiene permiso "eliminar" */}
                {hasDeletePermission && (
                  <button
                    className="dropdown-item"
                    onClick={() => eliminarTipoD(record.id_documento)}
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
      <Sidebar id="menu-item6" id1="menu-items6" activeClassName="lista-td" />
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
                  <li className="breadcrumb-item active">Tipo de documento</li>
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
                        <h3>Tipo de documento</h3>
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
                            Crear tipo de documento
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <Table
                    columns={TipoDColumns}
                    dataSource={TipoD}
                    rowKey="id_documento"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={
          mode === "editar"
            ? "Editar Tipo de Documento"
            : "Crear Tipo de Documento"
        }
        open={isRoleModalVisible}
        onCancel={handleRoleCancel}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {mode === "editar" && (
            <Form.Item label="Id Documento">
              <Controller
                name="id_documento"
                control={control}
                render={({ field }) => <Input {...field} disabled />}
              />
            </Form.Item>
          )}
          <Form.Item label="Tipo de Documento">
            <Controller
              name="tipo_documento"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {mode === "editar" ? "Actualizar" : "Crear"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ListaDocumento;
