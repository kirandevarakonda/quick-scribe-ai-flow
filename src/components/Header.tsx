
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PenTool, User, LogOut } from "lucide-react";

export const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PenTool className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">ContentAI</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">user@example.com</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsAuthenticated(false)}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => setIsAuthenticated(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
