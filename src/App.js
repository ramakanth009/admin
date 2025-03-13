import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import AppRoutes from './components/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;