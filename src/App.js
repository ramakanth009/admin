// src/App.js
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import AppRoutes from './components/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;