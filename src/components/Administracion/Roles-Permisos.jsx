
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select } from 'antd';
import { Link } from 'react-router-dom';
import Header from '../Header';
import Swal from 'sweetalert2';
import Sidebar from '../Sidebar';
import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';

const { Option } = Select;

const RolesPermisos = () => {
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [roles, setRoles] = useState([]);
  const [rol, setRol] = useState({});
  const { handleSubmit, reset, setValue, control } = useForm();
  const [mode, setMode] = useState(""); // Estado para almacenar los permisos

  const showRoleModal = () => {
    setIsRoleModalVisible(true);
  };

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  const handleRoleCancel = () => {
    setValue('id_rol', '');
    setValue('rol', '');
    setValue('descripcion', '');
    setIsRoleModalVisible(false);
  };

  const obtenerRol = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/obtener/rol`);
      setRoles(response.data);
    } catch (error) {
      console.error("Error al obtener los roles:", error);
    }
  };

  const handleEditRol = (data) => {
    setRol(data);
    setMode("editar");
    setValue('id_rol', data?.id_rol);
    setValue('rol', data?.rol);
    setValue('descripcion', data?.descripcion);
    showRoleModal();
  };

  const onSubmit = async (data) => {
    try {
      if (mode === 'crear') {
        const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/crear/rol`, data);
        if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: '¡Rol Agregado con Exito!',
            showConfirmButton: false,
            timer: 1500
          });
          reset();
          obtenerRol();
          handleRoleCancel();
        }
      } else if (mode === 'editar') {
        const response = await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/actualizar/roles/${rol.id_rol}`, data);
        if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Rol editado exitosamente',
            confirmButtonText: 'Aceptar'
          });
          obtenerRol();
          handleRoleCancel();
        }
      }
    } catch (error) {
      console.error("Error al procesar el Rol:", error);
    }
  };

  const eliminarRol= async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/eliminar/roles/${id}`);
      if (response.status === 200) {
        Swal.fire({
          title: 'Rol eliminado exitosamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        obtenerRol();
      }
    } catch (error) {
      console.error("Error al eliminar el rol:", error);
    }
  };

  useEffect(() => {
    obtenerRol();
  }, []);

  const rolesColumns = [
    
    {
      title: 'Rol',
      dataIndex: 'rol',
      key: 'rol',
    },
    {
      title: 'Descripcion',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: '',
      key: 'actions',
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
              <button
                className="dropdown-item"
                onClick={() => handleEditRol(record)}
              >
                <i className="far fa-edit me-2" />
                Editar
              </button>
              <button
                className="dropdown-item"
                onClick={() => eliminarRol(record.id_rol)}
              >
                <i className="fa fa-trash-alt m-r-5"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      ),
    },
  ];
  


  return (
    <>
      <Header />
      <Sidebar id='menu-item1' id1='menu-items1' activeClassName='RolesPermisos'/>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="#">Administración</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right">
                      <FeatherIcon icon="chevron-right" />
                    </i>
                  </li>
                  <li className="breadcrumb-item active">Módulo de Administración</li>
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
                        <h3>Roles</h3>
                      </div>
                      <div className="col-auto text-end">
                        <Button type="primary" onClick={() => {showRoleModal(); setMode("crear");}} className="btn-primary">
                          Crear Rol
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Table
                    columns={rolesColumns}
                    dataSource={roles}
                    rowKey="id_rol"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Modal para crear o editar Rol */}
      <Modal
        title={mode === "editar" ? "Editar Rol" : "Crear Rol"}
        visible={isRoleModalVisible}
        onCancel={handleRoleCancel}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {mode === 'editar' && (
            <Form.Item label="ID Rol">
              <Controller
                name="id_rol"
                control={control}
                render={({ field }) => <Input {...field} disabled />}
              />
            </Form.Item>
          )}
          <Form.Item label="Nombre del Rol" rules={[{ required: true }]}>
            <Controller
              name="rol"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>
          <Form.Item label="Descripcion del Rol" rules={[{ required: true }]}>
            <Controller
              name="descripcion"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Enviar</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RolesPermisos;



