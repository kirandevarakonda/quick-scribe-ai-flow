import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sparkles, Home, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <header className="border-b bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-black" />
            <span className="text-xl font-bold text-black">
              AI Content Writer
            </span>
          </Link>
          
          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" className="gap-2 text-gray-600 hover:text-black hover:bg-gray-50">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link to="/workflow">
              <Button variant="ghost" className="gap-2 text-gray-600 hover:text-black hover:bg-gray-50">
                <FileText className="h-4 w-4" />
                Start Writing
              </Button>
            </Link>
            {currentUser && (
              <div className="flex items-center gap-4 ml-4 border-l pl-4">
                <span className="text-sm text-gray-600">{currentUser.email}</span>
                <Button 
                  variant="ghost"
                  onClick={handleLogout}
                  className="gap-2 text-gray-600 hover:text-black hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
