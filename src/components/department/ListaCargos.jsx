/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Header';
import Sidebar from '../Sidebar';
import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';

const ListaCargos = () => {
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [cargos, setCargos] = useState([]);
  const [cargo, setCargo] = useState({});
  const { handleSubmit, reset, setValue, control } = useForm({});
  const [mode, setMode] = useState("");


  // Funciones del Modal
  const showRoleModal = () => setIsRoleModalVisible(true);
  const handleRoleCancel = () => {
    reset();
    setIsRoleModalVisible(false);
  };

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
  // Obtener lista de cargos
  const obtenerCargos = async () => {
    try {
    const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/obtener/cargos`);
      setCargos(response.data);
    } catch (error) {
      console.error("Error al obtener los cargos:", error);
    }
  };

  // Crear o Editar Cargo
  const onSubmit = async (data) => {
    try {
      if (mode === 'crear') {
        const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/crear/cargo`, data);
        if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Cargo creado exitosamente',
            showConfirmButton: false,
            timer: 1500
          });
          reset();
          obtenerCargos();
          handleRoleCancel();
        }
      } else if (mode === "editar") {
        const response = await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/actualizar/cargo/${cargo.id_cargo}`, data);
        if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Cargo editado exitosamente',
            confirmButtonText: 'Aceptar'
          });
          obtenerCargos();
          handleRoleCancel();
        }
      }
      obtenerCargos();
      handleRoleCancel();
    } catch (error) {
      console.error("Error al guardar el cargo:", error);
    }
  };

  // Editar Cargo
  const handleEditCargo = (record) => {
    setCargo(record);
    setMode('editar');
    setValue('id_cargo', record.id_cargo);
    setValue('descripcion', record.descripcion);
    showRoleModal();
  };

  // Eliminar Cargo
  const eliminarCargo = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/eliminar/cargo/${id}`);
      if (response.status === 200) {
        Swal.fire('¡Cargo eliminado exitosamente!', '', 'success');
        obtenerCargos();
      }
    } catch (error) {
      console.error("Error al eliminar el cargo:", error);
    }
  };

  useEffect(() => {
    obtenerCargos();
  }, []);

  // Columnas de la Tabla
  const cargosColumns = [
    {
      title: 'Cargo',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: '',
      key: 'actions',
      render: (text, record) => (
        <div className="dropdown dropdown-action">
          <Link to="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown">
            <i className="fas fa-ellipsis-v" />
          </Link>
          <div className="dropdown-menu dropdown-menu-start">
            <button className="dropdown-item" onClick={() => handleEditCargo(record)}>
              <i className="far fa-edit me-2" /> Editar
            </button>
            <button className="dropdown-item" onClick={() => eliminarCargo(record.id_cargo)}>
              <i className="fa fa-trash-alt m-r-5"></i> Eliminar
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Header />
      <Sidebar id='menu-item6' id1='menu-items6' activeClassName='lista-cargos' />
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
                    <FeatherIcon icon="chevron-right" />
                  </li>
                  <li className="breadcrumb-item active">Cargos</li>
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
                        <h3>Cargos</h3>
                      </div>
                      <div className="col-auto text-end">
                        <Button
                          type="primary"
                          onClick={() => {
                            showRoleModal();
                            setMode('crear');
                          }}className="btn-primary"
                        >
                          Crear Cargo
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Table
                    columns={cargosColumns}
                    dataSource={cargos}
                    rowKey="id_cargo"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Crear/Editar Cargo */}
      <Modal
        title={mode === 'editar' ? 'Editar Cargo' : 'Crear Cargo'}
        visible={isRoleModalVisible}
        onCancel={handleRoleCancel}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {mode === 'editar' && (
            <Form.Item label="ID Cargo">
              <Controller 
              name="id_cargo" 
              control={control} 
              render={({ field }) => <Input {...field} 
              disabled />} />
            </Form.Item>
          )}
          <Form.Item label="Nombre del Cargo" rules={[{ required: true }]}>
            <Controller 
            name="descripcion" 
            control={control} 
            render={({ field }) => <Input {...field} />} />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            {mode === 'editar' ? 'Guardar Cambios' : 'Crear'}
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default ListaCargos;
