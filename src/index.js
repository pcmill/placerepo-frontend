import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app';
import SidebarProvider from './contexts/sidebar-context';
import Shell from './components/shell/shell';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SidebarProvider>
        <Shell>
          <App />
        </Shell>
      </SidebarProvider>
    </BrowserRouter>
  </React.StrictMode>
);
