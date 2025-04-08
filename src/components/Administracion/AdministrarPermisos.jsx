import React, { useEffect, useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { Table, Button, Modal, Checkbox, Spin } from "antd";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const AdministrarPermisos = () => {
  const [tableData, setTableData] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const fetchData = async () => {
    try {
      const roles = await axios.get(`${API_URL}/permisos/roles`);
      const permisos = await axios.get(`${API_URL}/permisos`);
      setTableData(roles.data);
      setPermisos(permisos.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "Rol",
      dataIndex: "rol",
      key: "rol",
    },
    {
      title: "Permisos",
      dataIndex: "permisos",
      key: "permisos",
      render: (permisos) =>
        permisos.length > 0
          ? permisos.map((permiso) => permiso.nombre).join(", ")
          : "Sin permisos",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Button style={{ backgroundColor: "#8F5A9C" , color: "#FFFF"}} onClick={() => handleEdit(record)}>
          Actualizar
        </Button>
      ),
    },
  ];

  const handleEdit = (record) => {
    setSelectedRole(record);
    setSelectedPermissions(
      record.permisos.map((permiso) => permiso.id_permiso)
    );
    setModalVisible(true);
  };

  const handlePermissionChange = (checkedValues) => {
    setSelectedPermissions(checkedValues);
  };

  const handleSave = () => {
    Swal.fire({
      title: "Estas seguro de actualizar los permsisos del rol?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Actualizar permisos",
      denyButtonText: `No actualizar`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          await axios.post(`${API_URL}/permisos`, {
            id_rol: parseInt(selectedRole.id_rol),
            permisos: selectedPermissions,
          });
          await fetchData();
        } catch (error) {
          console.error("Error updating permissions:", error);
          Swal.fire(
            "Error!",
            "No se pudieron actualizar los permisos",
            "error"
          );
        } finally {
          setLoading(false);
        }
        Swal.fire("Actualizados!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("No se actualizaron los permsisos", "", "info");
      }
    });
    setModalVisible(false);
  };

  return (
    <>
      <Header />
      <Sidebar
        id="menu-item1"
        id1="menu-items1"
        activeClassName="Permisos-roles"
      />
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="#">Permisos</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">
                    Permisos de los roles existentes
                  </li>
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
                        <div className="doctor-table-blk">
                          <h3>Roles y permisos</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  {loading ? (
                    <div class="d-flex justify-content-center">
                      <div
                        class="spinner-border text-primary"
                        role="status"
                      ></div>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table
                        columns={columns}
                        dataSource={tableData}
                        rowKey="id_rol"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para editar permisos */}
      <Modal
        title={`Editar permisos para el rol: ${selectedRole?.rol}`}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <p>Seleccione los permisos para este rol:</p>
        <Checkbox.Group
          options={permisos.map((permiso) => ({
            label: permiso.nombre,
            value: permiso.id_permiso,
          }))}
          value={selectedPermissions}
          onChange={handlePermissionChange}
        />
      </Modal>
    </>
  );
};
