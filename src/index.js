import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app';
import SidebarProvider from './contexts/sidebar-context';
import { AuthProvider } from './contexts/auth-context';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </AuthProvider>
  </React.StrictMode>
);
