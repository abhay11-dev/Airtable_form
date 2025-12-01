import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Auth/Login';
import AuthSuccess from './components/Auth/AuthSuccess';
import Dashboard from './components/Dashboard/Dashboard';
import FormBuilder from './components/FormBuilder/FormBuilder';
import FormViewer from './components/FormViewer/FormViewer';
import ResponseList from './components/Responses/ResponseList';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/form-builder" element={<ProtectedRoute><FormBuilder /></ProtectedRoute>} />
        <Route path="/form/:formId" element={<FormViewer />} />
        <Route path="/forms/:formId/responses" element={<ProtectedRoute><ResponseList /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}