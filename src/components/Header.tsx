import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sparkles, Home, FileText } from 'lucide-react';

export function Header() {
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
          </nav>
        </div>
      </div>
    </header>
  );
}
