import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { StrictMode } from 'react';
import { UserProvider } from './components/Helpers/userContext.jsx';

// Enrutador personalizado
import Approuter from "./approuter.jsx"

// Bootstrap y estilos personalizados
import './assets/css/bootstrap.min.css';
import './assets/css/style.css';
//import './assets/js/bootstrap.bundle.min.js';
import './assets/css/select2.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
//import './assets/plugins/fontawesome/css/fontawesome.min.css';
//import './assets/plugins/fontawesome/css/all.min.css';
//import 'bootstrap/dist/js/bootstrap.bundle.js';

// Renderizar la app
createRoot(document.getElementById('root')).render(
  <StrictMode>
     <UserProvider>
      <Approuter />
    </UserProvider>
  </StrictMode>
);
