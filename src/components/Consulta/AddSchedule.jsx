/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import Header from '../Header';
import Sidebar from '../Sidebar';
import { DatePicker } from 'antd';
import { TextField } from '@mui/material';
import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const AddSchedule = () => {
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const onChange = (date, dateString) => {
    // console.log(date, dateString);
  };
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([
    { value: 1, label: "Select Department" },
    { value: 2, label: "Cardiology" },
    { value: 3, label: "Uriology" },
    { value: 4, label: "Radiology" },
  ]);
  const handleSave = () => {
    Swal.fire({
      icon: "success",
      title: "¡Consulta agregada con éxito!",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      navigate("/ConsultaLista");
    });
  };

  return (
    <div>
      <Header />
      <Sidebar id='menu-item5' id1='menu-items5' activeClassName='add-shedule' />
      <>
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="schedule.html">Consulta </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right">
                        <FeatherIcon icon="chevron-right" />
                      </i>
                    </li>
                    <li className="breadcrumb-item active">Agregar Consulta</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <form>
                      <div className="row">
                        <div className="col-12">
                          <div className="form-heading">
                            <h4>Agregar Nueva Consulta</h4>
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Nombre Paciente <span className="login-danger">*</span>
                            </label>
                            <input className="form-control" type="text" />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="form-group local-forms">
                            <label>
                              Especialidad <span className="login-danger">*</span>
                            </label>
                            <Select
                              defaultValue={selectedOption}
                              onChange={setSelectedOption}
                              options={options}
                              menuPortalTarget={document.body}
                              styles={{
                                menuPortal: base => ({ ...base, zIndex: 9999 }),
                                control: (baseStyles, state) => ({
                                  ...baseStyles,
                                  borderColor: state.isFocused ? 'none' : '2px solid rgba(46, 55, 164, 0.1);',
                                  boxShadow: state.isFocused ? '0 0 0 1px #2e37a4' : 'none',
                                  '&:hover': {
                                    borderColor: state.isFocused ? 'none' : '2px solid rgba(46, 55, 164, 0.1)',
                                  },
                                  borderRadius: '10px',
                                  fontSize: "14px",
                                  minHeight: "45px",
                                }),
                                dropdownIndicator: (base, state) => ({
                                  ...base,
                                  transform: state.selectProps.menuIsOpen ? 'rotate(-180deg)' : 'rotate(0)',
                                  transition: '250ms',
                                  width: '35px',
                                  height: '35px',
                                }),
                              }}
                              id="search-commodity"
                              components={{
                                IndicatorSeparator: () => null
                              }}
                            />
                            {/* <select className="form-control select">
                        <option>Choose Department</option>
                        <option>Cardiology</option>
                        <option>Urology</option>
                        <option>Radiology</option>
                      </select> */}
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms cal-icon">
                            <label>
                              Día de cita <span className="login-danger">*</span>
                            </label>
                            <DatePicker className="form-control datetimepicker" onChange={onChange}
                              suffixIcon={null}
                            />
                            {/* <input
                        className="form-control datetimepicker"
                        type="text"
                      /> */}
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              From <span className="login-danger">*</span>
                            </label>

                            <div className="">
                              {/* <input
                          type="text"
                          className="form-control"
                          id="datetimepicker3"
                        />  */}
                              <TextField
                                className="form-control"
                                id="outlined-controlled"
                                type="time"
                                value={startTime}
                                onChange={(event) => {
                                  setStartTime(event.target.value);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group local-forms">
                            <label>
                              To <span className="login-danger">*</span>
                            </label>

                            <div className="">
                              <TextField
                                className="form-control"
                                id="outlined-controlled"
                                type="time"
                                value={endTime}
                                onChange={(event) => {
                                  setEndTime(event.target.value);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-12">
                          <div className="form-group local-forms">
                            <label>
                              Notes <span className="login-danger">*</span>
                            </label>
                            <textarea
                              className="form-control"
                              rows={3}
                              cols={30}
                              defaultValue={""}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                          <div className="form-group select-gender">
                            <label className="gen-label">
                              Status <span className="login-danger">*</span>
                            </label>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  name="gender"
                                  className="form-check-input"
                                />
                                Active
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input
                                  type="radio"
                                  name="gender"
                                  className="form-check-input"
                                />
                                In Active
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="doctor-submit text-end">
                            <Link to="/AgregarConsulta" >
                              <button
                                type="button"
                                className="btn btn-primary submit-form me-2"
                                onClick={handleSave}
                              >
                                Guardar
                              </button>
                            </Link>
                            <button
                              type="submit"
                              className="btn btn-primary cancel-form"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  )
}

export default AddSchedule;
