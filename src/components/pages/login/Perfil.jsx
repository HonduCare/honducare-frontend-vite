import { useContext, useState } from "react";
import { UserContext } from "../../Helpers/userContext";
import axios from "axios";
import createAuthHeaders from "../../../helpers/createAuthHeaders";
import Header from "../../Header";
import Sidebar from "../../Sidebar";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { Modal, Input, Button, Form } from "antd";
import Swal from "sweetalert2";
import {
  getAuth,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

export const Perfil = () => {
  const { usuarioLogged, reloadUser } = useContext(UserContext);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [form] = Form.useForm();
  console.log("usuario logueado; ", usuarioLogged);

  const handleUpdateInfo = (values) => {
    try {
      const urlAPI = `${
        import.meta.env.VITE_REACT_APP_API_URL
      }/actualizar-usuario/${usuarioLogged.id_usuario}`;
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas guardar los cambios en tu dirección?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, guardar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const token = await createAuthHeaders();
          await axios.put(
            urlAPI,
            {
              direccion1: values.direccion1,
              id_usuario: usuarioLogged.id_usuario,
            },
            token
          );
          const dataUser = JSON.parse(localStorage.getItem("user"));
          dataUser.direccion1 = values.direccion1;
          localStorage.setItem("user",JSON.stringify(dataUser));
          reloadUser();
          Swal.fire(
            "¡Guardado!",
            "Tu dirección ha sido actualizada.",
            "success"
          );
          
          setIsInfoModalVisible(false);
        }
      });
    } catch (error) {
      console.error("Error al actualizar la direccion del usuario: ", error);
    }
  };

  const handleReauthenticateAndChangePassword = (values) => {
    Swal.fire({
      title: "Reautenticación requerida",
      text: "Por favor, ingresa tu contraseña actual para continuar.",
      input: "password",
      inputPlaceholder: "Contraseña actual",
      showCancelButton: true,
      confirmButtonText: "Reautenticar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const auth = getAuth();
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(
          user.email,
          result.value
        );

        reauthenticateWithCredential(user, credential)
          .then(() => {
            updatePassword(user, values.newPassword)
              .then(() => {
                Swal.fire(
                  "¡Actualizado!",
                  "Tu contraseña ha sido actualizada.",
                  "success"
                );
                setIsPasswordModalVisible(false);
              })
              .catch((error) => {
                Swal.fire(
                  "Error",
                  "No se pudo actualizar la contraseña: " + error.message,
                  "error"
                );
              });
          })
          .catch((error) => {
            Swal.fire(
              "Error",
              "Reautenticación fallida: " + error.message,
              "error"
            );
          });
      }
    });
  };

  return (
    <>
      <Header />
      <Sidebar />
      <section className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="#">Perfil</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right">
                      <FeatherIcon icon="chevron-right" />
                    </i>
                  </li>
                  <li className="breadcrumb-item active">Perfil de usuarios</li>
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
                        <h3 className="text-center mb-4">
                          Información del usuario
                        </h3>
                        <div className="row p-4 pt-0">
                          <div className="d-flex justify-content-center align-items-center mb-4">
                            <i className="fas fa-user-circle fa-5x text-primary"></i>
                          </div>
                          <div className="col-md-6 col-12">
                            <p>
                              <strong>Nombre:</strong>{" "}
                              {usuarioLogged?.nombre_de_usuario ||
                                "No disponible"}
                            </p>
                            <p>
                              <strong>Correo Electrónico:</strong>{" "}
                              {usuarioLogged?.correo_electronico ||
                                "No disponible"}
                            </p>
                            <p>
                              <strong>Número de Identidad:</strong>{" "}
                              {usuarioLogged?.numero_identidad ||
                                "No disponible"}
                            </p>
                          </div>
                          <div className="col-md-6 col-12">
                            <p>
                              <strong>Dirección:</strong>{" "}
                              {usuarioLogged?.direccion1 || "No disponible"}
                            </p>
                            <p>
                              <strong>Rol Asignado:</strong>{" "}
                              {usuarioLogged?.rol?.rol || "No disponible"}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="primary"
                          className="me-2"
                          onClick={() => setIsInfoModalVisible(true)}
                        >
                          Actualizar Dirección
                        </Button>
                        <Button
                          type="default"
                          onClick={() => setIsPasswordModalVisible(true)}
                        >
                          Cambiar Contraseña
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal para actualizar dirección */}
      <Modal
        title="Actualizar Dirección"
        open={isInfoModalVisible}
        onCancel={() => setIsInfoModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateInfo}
          initialValues={{
            direccion1: usuarioLogged?.direccion1 || "",
          }}
        >
          <Form.Item
            label="Dirección"
            name="direccion1"
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu dirección",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Guardar Cambios
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal para cambiar contraseña */}
      <Modal
        title="Cambiar Contraseña"
        open={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleReauthenticateAndChangePassword}
        >
          <Form.Item
            label="Nueva Contraseña"
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu nueva contraseña",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirmar Contraseña"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Por favor confirma tu nueva contraseña",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cambiar Contraseña
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
