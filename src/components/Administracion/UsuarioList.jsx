/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Table } from "antd";
import Header from '../Header';
import Sidebar from '../Sidebar';
import { onShowSizeChange, itemRender } from '../Pagination'
import {
  blogimg10, imagesend, pdficon, pdficon3, pdficon4, plusicon, refreshicon, searchnormal, blogimg12,
  blogimg2, blogimg4, blogimg6, blogimg8
} from '../imagepath';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import FeatherIcon from "feather-icons-react/build/FeatherIcon";


const suariolist = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [usuarioEliminar, setUsuarioEliminar] = useState({});

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // Obtener todos los usuarios del backend
  async function getUsers() {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/obtener/usuario`;
    try {
      const { data } = await axios.get(url);
      setUsuarios(data);
    } catch (error) {
      console.log(error);
    }
  }

  // Buscar el usuario por nombre
  async function onSearchUsuario() {
    if (searchValue === '') {
      setUsuariosFiltrados([]);
      getUsers();
      return;
    }

    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/obtener/buscar-nombre?nombre=${searchValue}`;
    try {
      const { data } = await axios.get(url);
      setUsuariosFiltrados(data);
    } catch (error) {
      console.log(error);
    }
  }

  // Funcion para actualizar los usuarios
  function onRefresh() {
    setUsuarios([]);
    setUsuariosFiltrados([]);
    setSearchValue('');
    getUsers();
  }

  // Funcion para eliminar un usuario
  async function onDeleteUsuario() {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/eliminar-usuario/${usuarioEliminar.id_usuario}`;
    try {
      const { data } = await axios.delete(url);
      Swal.fire({
        icon: "error",
        title: "Usuario eliminado",
        text: `Se elimino el usuario ${usuarioEliminar.nombre_de_usuario} correctamente.`,
        showConfirmButton: true,
        timer: 3000,
        confirmButtonText: 'Aceptar',
      });
      navigate('/Usuariolista');

    } catch (error) {
      console.log(error.response.data);
      Swal.fire({
        icon: "error",
        title: "",
        text: `No se elimino el usuario ${usuarioEliminar.nombre_de_usuario} debido a que tiene transaccciones pendientes por realizar.`,
        showConfirmButton: true,
        timer: 6000,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  // Obtener todos los usuarios al cargar el componente
  useEffect(() => {
    getUsers();
  }, []);

  const columns = [
    {
      title: "Nombre Usuario",
      dataIndex: "nombre",
      sorter: (a, b) => a.nombre.length - b.nombre.length,
      render: (text, record) => (
        <p className="profile-image">
          {record.nombre_de_usuario}
        </p>
      ),
    },
    {
      title: "# Identidad",
      dataIndex: "tipo_doc",
      sorter: (a, b) => a.tipo_doc.length - b.tipo_doc.length,
      render: (text, record) => (
        <h2 className="profile-image">
          {record.numero_identidad}
        </h2>
      ),
    },
    {/*
            title:"Edad",
            dataIndex: "edad",
                sorter: (a, b) => a.edad.length - b.edad.length,
        */},
    {/*
            title:"Sexo",
            dataIndex: "sexo",
                sorter: (a, b) => a.sexo.length - b.sexo.length
        */}, {
      title: "Correo Electronico",
      dataIndex: "correo",
      sorter: (a, b) => a.correo.length - b.correo.length,
      render: (text, record) => (
        <h2 className="profile-image">
          {record.correo_electronico}
        </h2>
      ),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      sorter: (a, b) => a.correo.length - b.correo.length,
      render: (text, record) => (
        <h2 className="profile-image">
          {record.estado.toUpperCase()}
        </h2>
      ),
    },
    {
      title: "",
      dataIndex: "FIELD8",
      render: (text, record) => (
        <>
          <div className="text-end">
            <div className="dropdown dropdown-action">
              <Link
                to="#"
                className="action-icon dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-ellipsis-v" />
              </Link>
              <div className="dropdown-menu dropdown-menu-end">
                <Link className="dropdown-item" to={`/EditUsuario/${record.id_usuario}`}>
                  <i className="far fa-edit me-2" />
                  Editar
                </Link>

                <Link onClick={() => setUsuarioEliminar(record)} className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#delete_patient">
                  <i className="fa fa-trash-alt m-r-5"></i> Eliminar
                </Link>
              </div>
            </div>
          </div>
        </>
      ),
    },

  ]


  return (
    <>
      <Header />
      <Sidebar id='menu-item1' id1='menu-items1' activeClassName='usuario-list' />
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="#">Usuario </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right">
                      <FeatherIcon icon="chevron-right" />
                    </i>
                  </li>
                  <li className="breadcrumb-item active">Lista de usuario</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table show-entire">
                <div className="card-body">
                  {/* Table Header */}
                  <div className="page-table-header mb-2">
                    <div className="row align-items-center">
                      <div className="col">
                        <div className="doctor-table-blk">
                          <h3>Lista de Usuarios</h3>
                          <div className="doctor-search-blk">
                            <div className="top-nav-search table-search-blk">
                              <form>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Buscar usuario por nombre"
                                  value={searchValue}
                                  onChange={e => setSearchValue(e.target.value)}
                                  onInput={e => {
                                    setTimeout(() => {
                                      onSearchUsuario();
                                    }, 2000);
                                  }}
                                />
                                <Link className="btn">
                                  <img
                                    src={searchnormal}
                                    alt="#"
                                  />
                                </Link>
                              </form>
                            </div>
                            <div className="add-group">
                              <Link
                                to="/AgregarUsuario"
                                className="btn btn-primary add-pluss ms-2"
                              >

                                <img src={plusicon} alt="#" />
                              </Link>
                              <button
                                className="btn btn-primary doctor-refresh ms-2"
                                type='button'
                                onClick={onRefresh}
                              >
                                <img src={refreshicon} alt="#" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-auto text-end float-end ms-auto download-grp">
                        <Link to="#" className=" me-2">
                          <img src={pdficon} alt="#" />
                        </Link>
                        <Link to="#" className=" me-2">
                        </Link>
                        <Link to="#" className=" me-2">
                          <img src={pdficon3} alt="#" />
                        </Link>
                        <Link to="#">
                          <img src={pdficon4} alt="#" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/* /Table Header */}
                  <div className="table-responsive doctor-list">
                    <Table
                      pagination={{
                        total: usuarios.length,
                        showTotal: (total, range) =>
                          `Mostrando ${range[0]} a ${range[1]} de ${total} usuarios`,
                        // showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        itemRender: itemRender,
                      }}
                      columns={columns}
                      dataSource={usuariosFiltrados.length > 0 ? usuariosFiltrados : usuarios}
                      // rowSelection={rowSelection}
                      rowKey={(record) => record.id_usuario}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div id="delete_patient" className="modal fade delete-modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <img src={imagesend} alt="#" width={50} height={46} />
              <h3>¿Seguro que quieres eliminarlo?</h3>
              <div className="m-t-20">
                {" "}
                <button type='button' className="btn btn-white me-2" data-bs-dismiss="modal">
                  Cerrar
                </button>
                <button type='button' onClick={onDeleteUsuario} className="btn btn-danger">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  )
}

export default suariolist;
