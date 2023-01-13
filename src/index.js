import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app';
import SidebarProvider from './contexts/sidebar-context';
import { AuthProvider } from './contexts/auth-context';
import NotificationProvider from './contexts/notification-context';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);
