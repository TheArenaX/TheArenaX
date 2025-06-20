import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Home, Trophy, User, Wallet, LogOut, LogIn } from 'lucide-react';

export const FloatingNavigation = () => {
  const { isAuthenticated, logout, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/tournaments', icon: Trophy, label: 'Tournaments' },
    ...(isAuthenticated ? [
      { to: '/wallet', icon: Wallet, label: 'Wallet' },
      { to: '/profile', icon: User, label: 'Profile' },
    ] : [])
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-900/90' : 'bg-gray-900/70'
      } backdrop-blur-lg border border-gray-700/50 rounded-full px-6 py-3`}
    >
      <div className="flex items-center space-x-6">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          TheArenaX
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200 ${
                location.pathname === item.to
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}

          {/* User Actions */}
          <div className="flex items-center space-x-3 pl-3 border-l border-gray-700">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-300">
                  {profile?.wallet_balance || 0} Credits
                </span>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-full hover:bg-gray-800/50 transition-colors"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-4 md:hidden"
          >
            <div className="space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    location.pathname === item.to
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}

              <div className="border-t border-gray-700 pt-3 mt-3">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-300">
                      Credits: {profile?.wallet_balance || 0}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 w-full"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
