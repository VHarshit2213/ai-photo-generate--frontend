import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Image, Menu, User, Wand2, X } from 'lucide-react';
import { useState } from 'react';
import { getInitial, getProfileImageUrl } from '../../utils/profileImage';

const navItems = [
  { to: '/generate', label: 'Generate', icon: Wand2 },
  { to: '/gallery', label: 'Gallery', icon: Image },
  { to: '/profile', label: 'Profile', icon: User },
];

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const profileImage = getProfileImageUrl(user);

  if (!isAuthenticated) return null;

  return (
    <nav className="sticky top-0 z-40 border-b border-white/15 bg-neutral-bg/70 shadow-lg shadow-neutral-900/20 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/generate" className="flex items-center gap-3 text-xl font-bold text-white">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-primary-700 shadow-button">
              FS
            </span>
            Fashion Studio
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition ${isActive(to)
                  ? 'bg-white text-primary-700 shadow-card'
                  : 'text-primary-100 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-primary-100 text-sm font-bold text-primary-700">
              {profileImage ? (
                <img src={profileImage} alt={user?.name || 'Profile avatar'} className="h-full w-full object-cover" />
              ) : (
                getInitial(user)
              )}
            </div>
          </div>

          <button
            className="rounded-lg p-2 text-white hover:bg-white/10 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 font-medium ${isActive(to) ? 'bg-white text-primary-700' : 'text-primary-100 hover:bg-white/10'
                  }`}
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
