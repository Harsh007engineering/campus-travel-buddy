import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('https://campus-travel-buddy.vercel.app/api/auth/login', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            toast.success("Welcome back!");
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-800">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-brand text-white rounded-2xl mb-4 shadow-lg shadow-brand/20">
                        <LogIn size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Sign In</h2>
                    <p className="text-slate-400 mt-2">Enter your VIT credentials to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-slate-500" size={20} />
                        <input type="email" placeholder="College Email" required onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-brand outline-none transition text-white placeholder-slate-500" />
                    </div>
                    
                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-slate-500" size={20} />
                        <input type="password" placeholder="Password" required onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-brand outline-none transition text-white placeholder-slate-500" />
                    </div>

                    <button disabled={loading} type="submit" className="w-full bg-brand text-white font-bold py-4 rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-brand/20 active:scale-[0.98]">
                        {loading ? 'Authenticating...' : 'Login to Dashboard'}
                    </button>
                </form>

                <p className="text-center mt-8 text-slate-400">
                    New here? <Link to="/signup" className="text-brand font-bold hover:text-indigo-400 transition">Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;