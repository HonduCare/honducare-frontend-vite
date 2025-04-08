import { useState, useEffect } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/pages/login";
// import config from "config";
import Addblog from "./components/pages/Blog/Addblog";
import Editblog from "./components/pages/Blog/Editblog";
import BlogView from "./components/pages/Blog/BlogView";
import Blogdetails from "./components/pages/Blog/Blogdetails";
//For Settings...
// import Settings from "./components/settings/Settings";
//Assest
//Doctor
import RolesPermisos from "./components/Administracion/Roles-Permisos";
import AddDoctor from "./components/Administracion/AddDoctor";
import EditDoctor from "./components/Administracion/EditDoctor";
import Bitacora from "./components/Administracion/Bitacora";
import DoctorProfile from "./components/Administracion/DoctorProfile";
//Patients...
import PatientsList from "./components/patients/PatientsList";
import AddPatients from "./components/patients/AddPatients";
import EditPatients from "./components/patients/EditPatients";
import PatientsProfile from "./components/patients/PatientsProfile";
import PatologiasPersonales from "./components/patients/PatologiasPersonales";
import PatologiasFamiliares from "./components/patients/PatologiasFamiliares";
import Antecedentes from "./components/patients/Antecedentes";
import HabitosToxicos from "./components/patients/HabitosToxicos";
import HistoriaGinecobstetrica from "./components/patients/HistoriaGinecobstetrica";
import Citaslist from "./components/appoinments/AppoinmentList";
import AddAppoinments from "./components/appoinments/AddAppoinments";
import EditAppoinments from "./components/appoinments/EditAppoinments";
import ListaAntecedentes from "./components/department/ListaAntecedentes";
import ListaEstadoCivil from "./components/department/ListaEstadoCivil";
import ListaHG from "./components/department/ListaHG";
import ListaHT from "./components/department/ListaHT";
import ListaOcupaciones from "./components/department/ListaOcupaciones";
import ListaPatologias from "./components/department/ListaPatologias";
import ListaCargos from "./components/department/ListaCargos";
import ListaEstados from "./components/department/ListaEstados";
import ListaSexos from "./components/department/ListaSexos";
import ListaDocumento from "./components/department/ListaDocumento";

//DoctorSchedule
import ScheduleList from "./components/Consulta/ScheduleList";
import Preclinica from "./components/Consulta/Preclinica";
import Expediente from "./components/Consulta/Expediente";
import AddSchedule from "./components/Consulta/AddSchedule";
import EditSchedule from "./components/Consulta/EditSchedule";
import ExamenFisico from "./components/Consulta/ExamenFisico";
import Diagnostico from "./components/Consulta/Diagnostico";

//Departments

import ForgotPassword from "./components/pages/login/ForgotPassword";
import ResetPassword from "./components/pages/login/ResetPasswordConfirm";
import Signup from "./components/pages/login/Signup";
import ExpensesReport from "./components/ExpenseReport/Expenses/ExpensesReport";
import PreclinicaReport from "./components/ExpenseReport/Expenses/PreclinicaReport";
import DiagnosticReport from "./components/ExpenseReport/Expenses/DiagnosticoReport";
import AddExpenses from "./components/ExpenseReport/Expenses/AddExpenses";
import Invoice_Report from "./components/ExpenseReport/Invoice-report/Invoice_Report";
import UiKit from "./components/Ui_Elements/UiKit";
import Typography from "./components/Ui_Elements/Typography";
import Tab from "./components/Ui_Elements/Tab";
import Register from "./components/pages/login/Register";
import LockScreen from "./components/pages/login/LockScreen";
import ChangePassword from "./components/pages/login/ChangePassword";
import Error from "./components/pages/login/Error";
import ServerError from "./components/pages/login/ServerError";
import Calender from "./components/appoinments/Calender";
import Profile from "./components/pages/login/Profile";
import EditProfile from "./components/pages/login/EditProfile";
import BlankPage from "./components/pages/login/BlankPage";
import Doctor_Dashboard from "./components/Dashboard/Doctor_Dashboard/Doctor_Dashboard";
import Bienvenida from "./components/Dashboard/Admin_Dashboard/Bienvenida";
import Patient_Dashboard from "./components/Dashboard/Patient_Dashboard/Patient_Dashboard";
import Doctor_Settings from "./components/Dashboard/Doctor_Dashboard/Doctor_Settings";
import Patient_Settings from "./components/patients/Patient_Settings";
import Edit_Expenses from "./components/ExpenseReport/Expenses/Edit_Expenses";
import GalleryImage from "./components/pages/Gallery/Gallery";
import UsuarioLista from "./components/Administracion/UsuarioList";
import AddUser from "./components/Administracion/AddUser";
import EditUsuario from "./components/Administracion/EditUsario";
import Estadisticas from "./components/Dashboard/Estadisticas/Admin_Dashboard";
import ListaEspecialidades from "./components/department/ListaEspecialidades";
import ConsultaExpediente from "./components/Consulta/ConsultaExpediente";
import ComoSeEntero from "./components/patients/ComoSeEntero";
import ConsultaItinerario from "./components/patients/ConsultaItinerario";

//COMPONENTE DE PERMISOS
import { AdministrarPermisos } from "./components/Administracion/AdministrarPermisos";

//Accounts
const Approuter = () => {
  const BASENAME = '/';

  const [usuarioLogged, setUsuarioLogged] = useState({
    id_rol: '5',
  });

  async function getInfo() {
    const usuario = JSON.parse(localStorage.getItem('user'));
    setUsuarioLogged(usuario ? usuario : { id_rol: '5' });
  }

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/lockscreen" element={<LockScreen />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/error" element={<Error />} />
          <Route path="/server-error" element={<ServerError />} />
          <Route path="/blankpage" element={<BlankPage />} />
          <Route path="/gallery" element={<GalleryImage />} />
          {/* Blog */}
          <Route path="/blog" element={<Blogdetails />} />
          <Route path="/addblog" element={<Addblog />} />
          <Route path="/editblog" element={<Editblog />} />
          <Route path="/blogview" element={<BlogView />} />
          {/* Settings */}
          {/* Assests */}
          {/* Doctor  */}
          <Route path="/RolesPermisos" element={<RolesPermisos />} />
          <Route path="/Bitacora" element={<Bitacora />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/editdoctor" element={<EditDoctor />} />
          <Route path="/doctorprofile" element={<DoctorProfile />} />
          <Route path="/doctor-setting" element={<Doctor_Settings />} />
          {/* Patients */}
          <Route path="/PacienteLista" element={<PatientsList />} />
          <Route path="/AgregarPaciente" element={<AddPatients />} />
          <Route path="/editPaciente/:id" element={<EditPatients />} />
          <Route path="/patientsprofile" element={<PatientsProfile />} />
          <Route path="/patient-settings" element={<Patient_Settings />} />
          <Route path="/patologias-personales" element={<PatologiasPersonales />} />
          <Route path="/patologias-familiares" element={<PatologiasFamiliares />} />
          <Route path="/antecedentes" element={<Antecedentes />} />
          <Route path="/habitos-toxicos" element={<HabitosToxicos />} />
          <Route path="/historia-ginecobstetrica" element={<HistoriaGinecobstetrica />} />
          <Route path="/lista-antecedentes" element={<ListaAntecedentes />} />
          <Route path="/lista-estadocivil" element={<ListaEstadoCivil />} />
          <Route path="/lista-hg" element={<ListaHG />} />
          <Route path="/lista-ht" element={<ListaHT />} />
          <Route path="/lista-ocupaciones" element={<ListaOcupaciones />} />
          <Route path="/lista-patologias" element={<ListaPatologias />} />
          <Route path="/lista-cargos" element={<ListaCargos />} />
          <Route path="/lista-estados" element={<ListaEstados />} />
          <Route path="/lista-sexo" element={<ListaSexos />} />
          <Route path="/lista-td" element={<ListaDocumento />} />


          {/* Rutas para el usuario con rol de DOCTOR */}
          {usuarioLogged.id_rol == 1 ? (
            <Route>
              <Route path="/ConsultaLista" element={<ScheduleList />} />
              <Route path="/PreclinicaLista" element={<Preclinica />} />
              <Route path="/CitasLista" element={<Citaslist />} />
              <Route path={'/Calendario'} element={<Calender />} />
              <Route path="/AgregarCita" element={<AddAppoinments />} />
              <Route path="/AgregarConsulta" element={<AddSchedule />} />
              <Route path="/perfil" element={<DoctorProfile />} />
              <Route path="/consulta-expediente" element={<ConsultaExpediente />} />
            </Route>
          ) : null}


          {/* Rutas para el usuario con rol de RECEPCIONISTA */}
          {usuarioLogged.id_rol == 2 ? (
            <Route>
              <Route path="/CitasLista" element={<Citaslist />} />
              <Route path={'/Calendario'} element={<Calender />} />
              <Route path="/AgregarCita" element={<AddAppoinments />} />
              <Route path="/ConsultaLista" element={<ScheduleList />} />
              <Route path="/PreclinicaLista" element={<Preclinica />} />
              <Route path="/consulta-itinerario" element={<ConsultaItinerario />} />
              <Route path="/consulta-expediente" element={<ConsultaExpediente />} />
            </Route>
          ) : null}

          {/* Rutas para el usuario con rol de ADMINISTRADOR */}
          {usuarioLogged.id_rol == 3 ? (
            <Route>
              <Route path="/UsuarioLista" element={<UsuarioLista />} />
              <Route path="/EditUsuario/:id" element={<EditUsuario />} />
              <Route path="/AgregarUsuario" element={<AddUser />} />
              <Route path="/AgregarCita" element={<AddAppoinments />} />
              <Route path="/CitasLista" element={<Citaslist />} />
              <Route path={'/Calendario'} element={<Calender />} />
              <Route path="/ConsultaLista" element={<ScheduleList />} />
              <Route path="/PreclinicaLista" element={<Preclinica />} />
              <Route path="/especialidades" element={<ListaEspecialidades />} />
              <Route path="/como-se-entero" element={<ComoSeEntero />} />
              <Route path="/consulta-itinerario" element={<ConsultaItinerario />} />
              <Route path="/consulta-expediente" element={<ConsultaExpediente />} />
              <Route path="/permisos-roles" element={<AdministrarPermisos/>} />
            </Route>
          ) : null}


          {/* Rutas para el usuario con rol de GERENCIA */}
          {usuarioLogged.id_rol == 4 ? (
            <Route>
              <Route path="/AgregarCita" element={<AddAppoinments />} />
              <Route path="/CitasLista" element={<Citaslist />} />
              <Route path="/ConsultaLista" element={<ScheduleList />} />
              <Route path="/PreclinicaLista" element={<Preclinica />} />
              <Route path="/PacienteLista" element={<PatientsList />} />
              <Route path="/AgregarConsulta" element={<AddSchedule />} />
              <Route path="/consulta-expediente" element={<ConsultaExpediente />} />
            </Route>
          ) : null}

          {/* Rutas para el usuario con rol de PACIENTE */}
          {usuarioLogged.id_rol == 5 ? (
            <Route>
              <Route path="/PacienteLista" element={<PatientsList />} />
            </Route>
          ) : null}

          <Route path="/EditCita" element={<EditAppoinments />} />
          {/* DoctorSchedule */}
          <Route path="/editschedule" element={<EditSchedule />} />
          <Route path="/examenfisico/:id_cita/:id_paciente" element={<ExamenFisico />} />
          <Route path="/expediente/:id" element={<Expediente />} />
          <Route path="/diagnostico/:id_paciente/:id_cita" element={<Diagnostico />} />

          <Route path="/como-se-entero" element={<ComoSeEntero />} />


          {/* Department */}
          {/* Staff */}
          {/* Accounts */}
          {/* /* Payroll */}
          {/* Email */}
          {/* Activity */}
          {/* ExpenseReport */}
          <Route path="/expense-Report/:id" element={<ExpensesReport />} />
          <Route path="/preclinica-report" element={<PreclinicaReport />} />
          <Route path="/diagnostico-report" element={<DiagnosticReport />} />
          <Route path="/add-expense" element={<AddExpenses />} />
          <Route path="/invoice-report" element={<Invoice_Report />} />
          <Route path="/edit-expenses" element={<Edit_Expenses />} />
          {/* Chat */}
          {/* Call */}
          {/* Invoice */}
          {/* ui-elements */}
          <Route path="/ui-kit" element={<UiKit />} />
          <Route path="/typography" element={<Typography />} />
          <Route path="/tab" element={<Tab />} />
          {/* Forms */}
          {/* Tables */}
          {/* Calender */}

          {/* Dashboard */}
          <Route path="/Bienvenida" element={<Bienvenida />} />
          <Route path="/doctor-dashboard" element={<Doctor_Dashboard />} />
          <Route path="/patient-dashboard" element={<Patient_Dashboard />} />
          {/* Esstadisticas */}
          <Route path="/Estadisticas" element={<Estadisticas />} />
          <Route path="/EditCita/:id" element={<EditAppoinments />} />

          <Route path="*" element={<Bienvenida />} />

        </Routes>
      </BrowserRouter>
      <div className="sidebar-overlay"></div>
    </>
  );
};

export default Approuter;
