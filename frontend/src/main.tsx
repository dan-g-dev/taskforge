import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import { AppShell } from './components/AppShell';
import { AuthProvider } from './context/AuthContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Marketing / landing page — untouched */}
        <Route path="/" element={<App />} />

        {/* The real product: dashboard, kanban, projects, teams, etc. */}
        <Route
          path="/app/*"
          element={
            <AuthProvider>
              <AppShell />
            </AuthProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
