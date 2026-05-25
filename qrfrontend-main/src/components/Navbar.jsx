import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, User, Settings, Package, LayoutDashboard, QrCode } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const navLinks = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Profile', path: '/profile', icon: User },
        { name: 'Items', path: '/items', icon: Package },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8">
            <nav className="max-w-7xl mx-auto glass-card rounded-2xl overflow-hidden">
                <div className="px-4 sm:px-6">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center space-x-2">
                                <div className="p-2 accent-gradient rounded-xl shadow-lg accent-glow">
                                    <QrCode className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-semibold text-white tracking-tight hidden sm:block">
                                    Lost<span className="text-indigo-400">Found</span>
                                </span>
                            </div>
                            <div className="hidden sm:ml-10 sm:flex sm:space-x-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${isActive(link.path)
                                            ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <link.icon className={`w-4 h-4 ${isActive(link.path) ? 'text-indigo-400' : ''}`} />
                                        <span>{link.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:space-x-6">
                            <div className="flex items-center space-x-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                <img className="h-7 w-7 rounded-full border border-white/20" src={user?.avatar} alt={user?.name} />
                                <span className="text-sm font-medium text-gray-200">{user?.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 group"
                                title="Sign Out"
                            >
                                <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>

                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} sm:hidden transition-all duration-500 ease-in-out border-t border-white/5 overflow-hidden`}>
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center space-x-4 px-4 py-3 rounded-xl text-base font-medium transition-all ${isActive(link.path)
                                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <link.icon className="w-5 h-5" />
                                <span>{link.name}</span>
                            </Link>
                        ))}
                        <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <img className="h-10 w-10 rounded-full border border-white/20" src={user?.avatar} alt={user?.name} />
                                <div>
                                    <p className="text-sm font-semibold text-white">{user?.name}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
