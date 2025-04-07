import { useState, useEffect } from "react";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import Sidebar from "../../Sidebar";
import Header from "../../Header";
import { morning_img_01 } from "../../imagepath";
import { Link } from "react-router-dom";

const Bienvenida = () => {

  const [usuarioLogged, setUsuarioLogged] = useState({});

  async function getInfo() {
    const usuario = JSON.parse(localStorage.getItem('user'));
    setUsuarioLogged(usuario);
  }

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <>
      <Header />
      <Sidebar
        id="menu-item"
        id1="menu-items"
        activeClassName="admin-dashboard"
      />
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="#">Bienvenida</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <FeatherIcon icon="chevron-right" />
                  </li>
                  <li className="breadcrumb-item active">Bienvenida</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <section className="good-morning-blk">
            <div className="row">
              <div className="col-md-6">
                <div className="morning-user">
                  <h2>
                    Te damos la bienvenida {''}
                    <span>
                      {usuarioLogged.id_rol == 1 ? 'Dr. ' : ''}
                    </span>
                    <span className="font-bold">
                      {usuarioLogged.nombre_de_usuario}
                    </span>
                  </h2>
                  <p>Ten un buen día y una exelente jornada laboral</p>
                </div>
              </div>
              <div className="col-md-6 position-blk">
                <div className="morning-img">
                  <img src={morning_img_01} alt="Morning greeting" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Bienvenida;


