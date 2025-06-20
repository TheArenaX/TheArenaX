import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export const Navigation = () => {
  const { profile, login, signup, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ username: '', email: '', password: '' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await login(loginForm.email, loginForm.password);
    if (!error) {
      setIsLoginOpen(false);
      toast.success('Welcome to TheArenaX!');
      setLoginForm({ email: '', password: '' });
    } else {
      toast.error(error);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await signup(signupForm.username, signupForm.email, signupForm.password);
    if (!error) {
      setIsSignupOpen(false);
      toast.success('Welcome to TheArenaX! Please check your email to confirm your account.');
      setSignupForm({ username: '', email: '', password: '' });
    } else {
      toast.error(error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Public pages visible to everyone
  const publicNavItems = [
    { path: '/', label: 'Home' },
    { path: '/tournaments', label: 'Tournaments' },
    { path: '/about', label: 'About' },
    { path: '/terms', label: 'Terms' },
    { path: '/privacy', label: 'Privacy' },
    { path: '/contact', label: 'Contact' },
  ];

  // Authenticated user pages
  const authNavItems = [
    { path: '/wallet', label: 'Wallet' },
    { path: '/profile', label: 'Profile' },
  ];

  const navItems = isAuthenticated 
    ? [...publicNavItems, ...authNavItems]
    : publicNavItems;

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`relative transition-colors hover:text-blue-400 ${
            location.pathname === item.path ? 'text-blue-400' : 'text-white'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {item.label}
          {location.pathname === item.path && (
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-600 animate-fade-in" />
          )}
        </Link>
      ))}
    </>
  );

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto px-4 py-3 bg-black/20 backdrop-blur-md border border-white/10 rounded-full shadow-lg">
      <div className="flex items-center gap-4 md:gap-8 justify-between w-full">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
          TheArenaX
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <NavLinks />
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 lg:gap-4">
              <span className="text-yellow-400 font-semibold whitespace-nowrap">{profile?.wallet_balance || 0} Credits</span>
              <Button variant="outline" onClick={handleLogout} className="border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-full">
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full mr-2">
                  Login
                </Button>
              </Link>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 rounded-full" onClick={() => setIsSignupOpen(true)}>
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-gray-900/95 border-gray-700">
              <div className="flex flex-col space-y-6 mt-8">
                <NavLinks />
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-4 pt-4 border-t border-gray-700">
                    <div className="text-yellow-400 font-semibold px-4">
                      {profile?.wallet_balance || 0} Credits
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleLogout} 
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-full"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full mb-2 w-full">
                        Login
                      </Button>
                    </Link>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 rounded-full w-full" onClick={() => { setIsSignupOpen(true); setIsMobileMenuOpen(false); }}>
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {/* Signup Dialog */}
      <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
        <DialogContent className="max-w-md w-full bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>Sign Up for TheArenaX</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-gray-200">Username</Label>
              <Input id="username" value={signupForm.username} onChange={e => setSignupForm({ ...signupForm, username: e.target.value })} required className="bg-gray-800 border-gray-700 text-white placeholder-gray-400" placeholder="Enter your username" />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-200">Email</Label>
              <Input id="email" type="email" value={signupForm.email} onChange={e => setSignupForm({ ...signupForm, email: e.target.value })} required className="bg-gray-800 border-gray-700 text-white placeholder-gray-400" placeholder="Enter your email" />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-200">Password</Label>
              <Input id="password" type="password" value={signupForm.password} onChange={e => setSignupForm({ ...signupForm, password: e.target.value })} required className="bg-gray-800 border-gray-700 text-white placeholder-gray-400" placeholder="Enter your password" />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 rounded-full">Sign Up</Button>
          </form>
        </DialogContent>
      </Dialog>
    </nav>
  );
};
