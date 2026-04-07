import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CarFront, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success("Logged out safely");
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
                        <div className="bg-brand text-white p-2 rounded-xl shadow-lg shadow-brand/20">
                            <CarFront size={24} />
                        </div>
                        {/* Title Updated Here */}
                        <span className="font-bold text-xl tracking-tight text-white">Campus Travel Buddy</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        {token ? (
                            <>
                                <Link to="/dashboard" className="text-slate-400 hover:text-white font-medium transition">Dashboard</Link>
                                {/* Profile Link Added Here */}
                                <Link to="/profile" className="flex items-center gap-1 text-slate-400 hover:text-brand font-medium transition">
                                    <User size={18} /> Profile
                                </Link>
                                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-full transition border border-red-500/20 ml-2">
                                    <LogOut size={16} /> Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-slate-400 hover:text-white font-medium transition">Login</Link>
                                <Link to="/signup" className="px-5 py-2 bg-brand text-white text-sm font-medium rounded-full hover:bg-indigo-500 transition shadow-lg shadow-brand/20">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;