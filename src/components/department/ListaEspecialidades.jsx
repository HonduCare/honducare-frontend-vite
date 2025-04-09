import { useState, useEffect, useContext } from "react";
import { UserContext } from "../Helpers/userContext";
import { Link } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { Table, Button, Modal, Form, Input } from "antd";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import createAuthHeaders from "../../helpers/createAuthHeaders";

function ListaEspecialidades() {
  const { usuarioLogged } = useContext(UserContext);
  const [especialidades, setEspecialidades] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [idEspecialidad, setIdEspecialidad] = useState("");

  const { handleSubmit, setValue, control } = useForm({});

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  async function getEspecialidades() {
    const config = await createAuthHeaders();

    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/especialidad`;

    try {
      const { data } = await axios(url, config);
      console.log(data);
      setEspecialidades(data.especialidades);
    } catch (error) {
      console.log(error);
    }
  }

  async function onSubmit(data) {
    const config = await createAuthHeaders();

    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/especialidad`;

    try {
      if (idEspecialidad) {
        await axios.put(url + `/${idEspecialidad}`, data, config);

        // console.log(dataAxios);
        setIdEspecialidad("");
        setShowModal(false);
        getEspecialidades();
        return;
      }

      await axios.post(url, data, config);
      setShowModal(false);
      getEspecialidades();
    } catch (error) {
      setIdEspecialidad("");
      setShowModal(false);
      console.log(error);
    }
  }

  const especialidadesColumns = [
    {
      title: "Especialidad",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => {
        const hasUpdatePermission = usuarioLogged?.rol?.permisos.some(
          (permiso) => permiso.nombre === "actualizar"
        );

        // Si no tiene permiso "actualizar", no mostrar nada
        if (!hasUpdatePermission) {
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
                    onClick={() => {
                      setShowModal(true);
                      setIdEspecialidad(record.id_especialidad);
                      setValue("nombre", record.nombre);
                    }}
                  >
                    <i className="far fa-edit me-2" />
                    Editar
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getEspecialidades();
  }, []);

  return (
    <>
      <Header />
      <Sidebar
        id="menu-item6"
        id1="menu-items6"
        activeClassName="especialidades"
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
                  <li className="breadcrumb-item active">Especialidades</li>
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
                        <h3>Especialidades</h3>
                      </div>
                      <div className="col-auto text-end">
                        {usuarioLogged?.rol?.permisos.some(
                          (permiso) => permiso.nombre === "registrar"
                        ) && (
                          <Button
                            type="primary"
                            onClick={() => {
                              setShowModal(true);
                            }}
                            className="btn-primary"
                          >
                            Crear Especialidad
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <Table
                    columns={especialidadesColumns}
                    dataSource={especialidades}
                    rowKey="especialidad"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={idEspecialidad ? "Editar Especialidad" : "Crear Especialidad"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="Nombre de la especialidad"
            rules={[
              {
                required: true,
                message: "Por favor ingrese el nombre del sexo",
              },
            ]}
          >
            <Controller
              name="nombre"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input {...field} placeholder="Especialidad" />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {idEspecialidad ? "Editar" : "Crear"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ListaEspecialidades;
