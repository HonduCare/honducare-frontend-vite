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

const ListaHG = () => {
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [hgList, setHgList] = useState([]);
  const [hgData, setHgData] = useState({});
  const { handleSubmit, reset, setValue, control } = useForm({});
  const [mode, setMode] = useState("");
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL; // Obtiene la URL base desde el .env

  const showRoleModal = () => {
    setIsRoleModalVisible(true);
  };

  const handleRoleCancel = () => {
    setValue('id_descripcion_ginecoobstetrica', '');
    setValue('descripcion', '');
    setIsRoleModalVisible(false);
  };

  const handleEditHG = (data) => {
    setHgData(data);
    setMode("editar");
    setValue('id_descripcion_ginecoobstetrica', data?.id_descripcion_ginecoobstetrica);
    setValue('descripcion', data?.descripcion);
    showRoleModal();
  };

  const obtenerHG = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/obtener/historiaGinecoobstetrica/descripciones`);
      setHgList(response.data);
    } catch (error) {
      console.error("Error al obtener las HG:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      switch (mode) {
        case 'crear':
          {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/crear/historiaGinecoobstetrica`, data);
            if (response.status === 200) {
              reset();
              handleSave();
              obtenerHG();
              handleRoleCancel();
            }
            break;
          }
        case 'editar':
          {
            const response = await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/actualizar/historiaGinecoobstetrica/${hgData.id_descripcion_ginecoobstetrica}`, data);
            if (response.status === 200) {
              Swal.fire({
                title: 'Historia Ginecobstetrica editada exitosamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              obtenerHG();
              handleRoleCancel();
            }
            break;
          }
        default:
          break;
      }
    } catch (error) {
      console.error("Error al manejar la Historia Ginecobstetrica:", error);
    }
  };

  const eliminarHG = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/eliminar/historiaGinecoobstetrica/${id}`);
      if (response.status === 200) {
        Swal.fire({
          title: 'Historia Ginecobstetrica eliminada exitosamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        obtenerHG();
      }
    } catch (error) {
      console.error("Error al eliminar la Historia Ginecobstetrica:", error);
    }
  };

  useEffect(() => {
    obtenerHG();
  }, []);

  const hgColumns = [
    {
      title: 'Historia Ginecobstetrica',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: '',
      key: 'actions',
      render: (text, record) => (
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
              <button className="dropdown-item" onClick={() => handleEditHG(record)}>
                <i className="far fa-edit me-2" />
                Editar
              </button>
              <button className="dropdown-item" onClick={() => eliminarHG(record.id_descripcion_ginecoobstetrica)}>
                <i className="fa fa-trash-alt m-r-5"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleSave = () => {
    Swal.fire({
      icon: 'success',
      title: '¡Historia Ginecobstetrica Agregada con Exito!',
      showConfirmButton: false,
      timer: 1500
    });
  };

  return (
    <>
      <Header />
      <Sidebar id='menu-item6' id1='menu-items6' activeClassName='lista-hg' />
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
                  <li className="breadcrumb-item active">Historia Ginecobstetrica</li>
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
                        <h3>Historia Ginecobstetrica</h3>
                      </div>
                      <div className="col-auto text-end">
                        <Button type="primary" 
                        onClick={() => { 
                        showRoleModal(); 
                        setMode("crear"); 
                        }}className="btn-primary"
                        >
                          Crear Historia Ginecobstetrica
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Table
                    columns={hgColumns}
                    dataSource={hgList}
                    rowKey="id_descripcion_ginecoobstetrica"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={mode === "editar" ? "Editar Historia Ginecobstetrica" : "Crear Historia Ginecobstetrica"}
        visible={isRoleModalVisible}
        onCancel={handleRoleCancel}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {mode === 'editar' && (
            <Form.Item label="ID" rules={[{ required: true }]}>
              <Controller
                name="id_descripcion_ginecoobstetrica"
                control={control}
                render={({ field }) => <Input {...field} disabled />}
              />
            </Form.Item>
          )}
          <Form.Item label="Descripción" rules={[{ required: true }]}>
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

export default ListaHG;
