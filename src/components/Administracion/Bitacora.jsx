import { useState, useEffect } from 'react';
import { Table } from "antd";
import { onShowSizeChange, itemRender } from '../Pagination';
import { Link } from 'react-router-dom';
import Header from '../Header';
import Sidebar from '../Sidebar';
//import { searchnormal, plusicon, refreshicon, pdficon, pdficon2, pdficon3, pdficon4 } from '../imagepath';
import axios from 'axios';
import { formatearFecha } from '../../helpers';


const BitacoraList = () => {

  const [bitacoras, setBitacoras] = useState([]);

  const columns = [
    {
      title: "ID - Nombre",
      dataIndex: "Usuario",
      render: (text, record) => (
        <p>{record.id_usuario} - {record.usuario.nombre_de_usuario}</p>
      )
    },
    {
      title: "Rol",
      dataIndex: "rol",
      render: (text, record) => (
        <p>{record.usuario.rol.rol}</p>
      )
    },
    {
      title: "Acción realizada",
      dataIndex: "accion",
      render: (text, record) => (
        <p>{record.operacion}</p>
      )
    },
    {
      title: "Fecha",
      sorter: (a, b) => a.fecha.length - b.fecha.length,
      dataIndex: "Fecha",
      render: (text, record) => (
        <p>{formatearFecha(record.fecha)}</p>
      )
    },
    {
      title: "",
      dataIndex: "FIELD8",
      render: () => (
        <>
        </>
      ),
    },
  ];

  async function getBitacora() {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/bitacora`;

    try {
      const { data } = await axios(url);
      console.log(data);
      setBitacoras(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getBitacora();
  }, [])



  return (
    <div>
      <Header />
      <Sidebar id='menu-item1' id1='menu-items1' activeClassName='Bitacora' />
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="#">Bitácora</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right">

                    </i>
                  </li>
                  <li className="breadcrumb-item active">Lista de Bitácoras</li>
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
                        <div className="doctor-table-blk mb-4 mt-2">
                          <h3>Acciones Realizadas por los usuarios</h3>
                         {/* <div className="doctor-search-blk">
                            <div className="top-nav-search table-search-blk">
                              <form>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Buscar aquí"
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
                                to="/add-bitacora"
                                className="btn btn-primary add-pluss ms-2"
                              >
                                <img src={plusicon} alt="#" />
                              </Link>
                              <Link
                                to="#"
                                className="btn btn-primary doctor-refresh ms-2"
                              >
                                <img src={refreshicon} alt="#" />
                              </Link>
                            </div>
                          </div>*/}
                        </div>
                      </div>
                     {/* <div className="col-auto text-end float-end ms-auto download-grp">
                        <Link to="#" className=" me-2">
                          <img src={pdficon} alt="#" />
                        </Link>
                        <Link to="#" className=" me-2">
                          <img src={pdficon2} alt="#" />
                        </Link>
                        <Link to="#" className=" me-2">
                          <img src={pdficon3} alt="#" />
                        </Link>
                        <Link to="#">
                          <img src={pdficon4} alt="" />
                        </Link>
                      </div>*/}
                    </div>
                  </div>
                  {/* /Table Header */}
                  <div className="table-responsive">
                    <Table
                      pagination={{
                        total: bitacoras.length,
                        showTotal: (total, range) =>
                          `Mostrando ${range[0]} a ${range[1]} de ${total} entradas`,
                        onShowSizeChange: onShowSizeChange,
                        itemRender: itemRender,
                      }}
                      columns={columns}
                      dataSource={bitacoras}

                      rowKey={(record) => record.id_bitacora}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BitacoraList;


