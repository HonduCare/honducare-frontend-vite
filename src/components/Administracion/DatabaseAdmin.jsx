import Header from "../Header"
import Sidebar from "../Sidebar"

import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
export const DatabaseAdmin = () => {
  return (
    <>
        <Header></Header>
        <Sidebar></Sidebar>

          <section className="page-wrapper">
                <div className="content">
                  <div className="page-header">
                    <div className="row">
                      <div className="col-sm-12">
                        <ul className="breadcrumb">
                          <li className="breadcrumb-item">
                            <Link to="#">Base de Datos</Link>
                          </li>
                          <li className="breadcrumb-item">
                            <i className="feather-chevron-right">
                              <FeatherIcon icon="chevron-right" />
                            </i>
                          </li>
                          <li className="breadcrumb-item active">Crear y restarar backups</li>
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
                                <h3 className="mb-4">
                                  Administrar base de datos
                                </h3>
                                <div className="row p-4 pt-0">
                                 
                                </div>
                               
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
    </>
  )
}
