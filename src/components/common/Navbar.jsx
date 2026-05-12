import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  if (!isAuthenticated) return null;

  return (
    <nav className="sticky top-0 z-40 border-b border-primary-200 bg-white/85 shadow-sm backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/generate" className="text-2xl font-bold text-neutral-900 hover:text-accent-olive">
            AI-photo
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/generate"
              className={`font-medium transition ${
                isActive('/generate')
                  ? 'text-neutral-900 border-b-2 border-accent-olive'
                  : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              Generate
            </Link>
            <Link
              to="/gallery"
              className={`font-medium transition ${
                isActive('/gallery')
                  ? 'text-neutral-900 border-b-2 border-accent-olive'
                  : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              Gallery
            </Link>
            <Link
              to="/profile"
              className={`font-medium transition ${
                isActive('/profile')
                  ? 'text-neutral-900 border-b-2 border-accent-olive'
                  : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              Profile
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-neutral-900 hover:bg-primary-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/generate"
              className="block px-4 py-2 text-neutral-700 hover:bg-primary-100 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              Generate
            </Link>
            <Link
              to="/gallery"
              className="block px-4 py-2 text-neutral-700 hover:bg-primary-100 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link
              to="/profile"
              className="block px-4 py-2 text-neutral-700 hover:bg-primary-100 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
