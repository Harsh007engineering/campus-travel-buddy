import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserPlus, User, Mail, Lock, Phone } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('https://campus-travel-buddy.vercel.app/api/auth/signup', formData);
            toast.success("Account created! Please login.");
            navigate('/login'); 
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-brand outline-none transition text-white placeholder-slate-500";

    return (
        <div className="flex items-center justify-center min-h-[85vh]">
            <div className="w-full max-w-md bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-800">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-brand text-white rounded-2xl mb-4 shadow-lg shadow-brand/20">
                        <UserPlus size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Join the Club</h2>
                    <p className="text-slate-400 mt-2">The carpooling network for VIT students</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-4 top-3.5 text-slate-500" size={20} />
                        <input type="text" placeholder="Full Name" required onChange={(e) => setFormData({...formData, name: e.target.value})} className={inputClass} />
                    </div>
                    
                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-slate-500" size={20} />
                        <input type="email" placeholder="harsh...24bce@vitapstudent.ac.in" required onChange={(e) => setFormData({...formData, email: e.target.value})} className={inputClass} />
                    </div>

                    <div className="relative">
                        <Phone className="absolute left-4 top-3.5 text-slate-500" size={20} />
                        <input type="tel" placeholder="Phone Number" required onChange={(e) => setFormData({...formData, phone: e.target.value})} className={inputClass} />
                    </div>
                    
                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-slate-500" size={20} />
                        <input type="password" placeholder="Create Password" required onChange={(e) => setFormData({...formData, password: e.target.value})} className={inputClass} />
                    </div>

                    <button disabled={loading} type="submit" className="w-full bg-brand text-white font-bold py-4 rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-brand/20 active:scale-[0.98] mt-2">
                        {loading ? 'Creating Account...' : 'Get Started'}
                    </button>
                </form>

                <p className="text-center mt-6 text-slate-400">
                    Already registered? <Link to="/login" className="text-brand font-bold hover:text-indigo-400 transition">Sign in instead</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;