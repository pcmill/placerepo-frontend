import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app';
import SidebarProvider from './contexts/sidebar-context';
import Shell from './components/shell/shell';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <SidebarProvider>
      <Shell>
        <App />
      </Shell>
    </SidebarProvider>
  </React.StrictMode>
);
