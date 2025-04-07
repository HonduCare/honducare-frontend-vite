import React from 'react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';

// Enrutador personalizado
import Approuter from './approuter';

// Bootstrap y estilos personalizados
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/bootstrap.min.css';
import './assets/css/style.css';
import './assets/js/bootstrap.bundle.min.js';
import './assets/css/select2.min.css';
import './assets/plugins/fontawesome/css/fontawesome.min.css';
import './assets/plugins/fontawesome/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

// Renderizar la app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Approuter />
  </StrictMode>
);
