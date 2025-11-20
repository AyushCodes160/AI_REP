import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Drafts from './pages/Drafts';
import CreateDraft from './pages/CreateDraft';
import ConnectAccounts from './pages/ConnectAccounts';
import Schedule from './pages/Schedule';
import Analytics from './pages/Analytics';
import Layout from './components/Layout';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-bg">
        <div className="text-dark-text-muted">Loading...</div>
      </div>
    );
  }
  
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
}

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/drafts"
        element={
          <PrivateRoute>
            <Drafts />
          </PrivateRoute>
        }
      />
      <Route
        path="/drafts/create"
        element={
          <PrivateRoute>
            <CreateDraft />
          </PrivateRoute>
        }
      />
      <Route
        path="/connect-accounts"
        element={
          <PrivateRoute>
            <ConnectAccounts />
          </PrivateRoute>
        }
      />
      <Route
        path="/schedule"
        element={
          <PrivateRoute>
            <Schedule />
          </PrivateRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <PrivateRoute>
            <Analytics />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
