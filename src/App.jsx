import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Signup from './components/Signup';
import Workflow from './pages/Workflow';
import NotFound from './pages/NotFound';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes */}
            <Route
              path="/workflow"
              element={
                <PrivateRoute>
                  <Workflow />
                </PrivateRoute>
              }
            />
            
            {/* Redirect root to workflow if authenticated, otherwise to login */}
            <Route path="/" element={<Navigate to="/workflow" replace />} />
            
            {/* Catch all other routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App; 