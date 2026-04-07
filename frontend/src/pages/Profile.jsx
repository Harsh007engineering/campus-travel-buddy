import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Calendar, Clock, Edit2, Trash2, X, UserMinus, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const [trips, setTrips] = useState([]);
    const [editingTrip, setEditingTrip] = useState(null);
    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => { fetchTrips(); }, []);

    const fetchTrips = async () => {
        try {
            const res = await axios.get('https://campus-travel-buddy.vercel.app/api/trips/all');
            setTrips(res.data);
        } catch (err) {
            toast.error("Failed to load your profile data");
        }
    };

    const handleDelete = async (tripId) => {
        if (!window.confirm("Are you sure you want to delete this trip?")) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`https://campus-travel-buddy.vercel.app/api/trips/delete/${tripId}`, { headers: { 'Authorization': token }});
            toast.success("Trip deleted!");
            fetchTrips();
        } catch (err) {
            toast.error("Failed to delete trip");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put(`https://campus-travel-buddy.vercel.app/api/trips/edit/${editingTrip._id}`, editingTrip, { headers: { 'Authorization': token }});
            toast.success("Trip updated successfully!");
            setEditingTrip(null);
            fetchTrips();
        } catch (err) {
            toast.error("Failed to update trip");
        }
    };

    // NEW: Function to leave a trip you joined
    const handleLeaveTrip = async (tripId) => {
        if (!window.confirm("Are you sure you want to cancel your seat on this ride?")) return;
        const token = localStorage.getItem('token');
        try {
            await axios.post(`https://campus-travel-buddy.vercel.app/api/trips/leave/${tripId}`, {}, { headers: { 'Authorization': token }});
            toast.success("You have successfully canceled your seat.");
            fetchTrips(); // Refresh to update the UI
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to leave trip");
        }
    };

    // Filter trips for the specific user
    const myPostedTrips = trips.filter(trip => trip.creator?._id === currentUser.id);
    const myJoinedTrips = trips.filter(trip => trip.passengers?.some(p => p._id === currentUser.id));

    const inputClass = "w-full px-4 py-2 border border-purple-900/30 bg-[#161233] rounded-lg focus:ring-2 focus:ring-brand outline-none transition text-white";

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            
            {/* Header */}
            <div className="bg-[#1a1635]/80 backdrop-blur-md p-8 rounded-3xl border border-purple-900/40 shadow-xl flex items-center gap-6">
                <div className="w-20 h-20 bg-brand text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg shadow-brand/20">
                    {currentUser.name.charAt(0)}
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-white">{currentUser.name}</h1>
                    <p className="text-purple-300/70">{currentUser.email}</p>
                    <p className="text-emerald-400 font-mono mt-1">{currentUser.phone}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* MY POSTED TRIPS */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white border-b border-purple-900/40 pb-2 flex items-center gap-2">🚗 Trips I'm Driving</h2>
                    {myPostedTrips.length === 0 && <p className="text-slate-500">You haven't posted any trips yet.</p>}
                    
                    {myPostedTrips.map(trip => (
                        <div key={trip._id} className="bg-[#1a1635]/80 p-5 rounded-2xl border border-brand/30 shadow-lg">
                            <div className="flex justify-between items-start mb-3">
                                <div className="font-bold text-lg text-white">{trip.source} ➔ {trip.destination}</div>
                                <div className="text-brand font-bold">₹{trip.costPerPerson}</div>
                            </div>
                            <div className="flex gap-4 text-sm text-purple-200/70 mb-4">
                                <span className="flex items-center gap-1"><Calendar size={14}/> {trip.date}</span>
                                <span className="flex items-center gap-1"><Clock size={14}/> {trip.time}</span>
                            </div>

                            {/* NEW: Display Passengers for the Driver */}
                            <div className="mb-4 bg-[#110c2e] p-3 rounded-lg border border-purple-900/40">
                                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <Users size={14}/> Passengers ({trip.passengers.length})
                                </h4>
                                {trip.passengers.length > 0 ? (
                                    <ul className="space-y-2">
                                        {trip.passengers.map(p => (
                                            <li key={p._id} className="flex justify-between items-center text-sm">
                                                <span className="text-white font-medium">{p.name}</span>
                                                <span className="font-mono text-emerald-400">{p.phone}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-slate-500 italic">No one has joined yet.</p>
                                )}
                            </div>
                            
                            <div className="flex gap-2 border-t border-purple-900/40 pt-4">
                                <button onClick={() => setEditingTrip(trip)} className="flex-1 bg-purple-900/40 text-purple-200 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-brand transition text-sm font-bold">
                                    <Edit2 size={16} /> Edit
                                </button>
                                <button onClick={() => handleDelete(trip._id)} className="flex-1 bg-rose-500/10 text-rose-400 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-rose-500 hover:text-white transition text-sm font-bold border border-rose-500/20">
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* MY JOINED TRIPS */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white border-b border-purple-900/40 pb-2 flex items-center gap-2">🎒 Trips I've Joined</h2>
                    {myJoinedTrips.length === 0 && <p className="text-slate-500">You haven't joined any trips yet.</p>}

                    {myJoinedTrips.map(trip => (
                        <div key={trip._id} className="bg-[#110c2e] p-5 rounded-2xl border border-emerald-500/20 shadow-lg">
                            <div className="flex justify-between items-start mb-3">
                                <div className="font-bold text-lg text-white">{trip.source} ➔ {trip.destination}</div>
                                <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">Confirmed</div>
                            </div>
                            <div className="flex gap-4 text-sm text-purple-200/70 mb-4">
                                <span className="flex items-center gap-1"><Calendar size={14}/> {trip.date}</span>
                                <span className="flex items-center gap-1"><Clock size={14}/> {trip.time}</span>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg border border-purple-900/30 mb-4">
                                <p className="text-xs text-slate-400 uppercase mb-1">Driver Details</p>
                                <p className="text-sm text-white font-medium">{trip.creator?.name}</p>
                                <p className="text-sm font-mono text-brand mt-1">{trip.creator?.phone}</p>
                            </div>

                            {/* NEW: Cancel Seat Button */}
                            <button onClick={() => handleLeaveTrip(trip._id)} className="w-full bg-rose-500/10 text-rose-400 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-rose-500 hover:text-white transition text-sm font-bold border border-rose-500/20">
                                <UserMinus size={16} /> Cancel Seat
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* EDIT TRIP MODAL (Pop-up) */}
            {editingTrip && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#1a1635] p-6 rounded-3xl border border-brand w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Edit Trip</h3>
                            <button onClick={() => setEditingTrip(null)} className="text-slate-400 hover:text-white"><X size={24}/></button>
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-purple-300/70 block mb-1">Date</label>
                                    <input type="date" required value={editingTrip.date} onChange={e => setEditingTrip({...editingTrip, date: e.target.value})} className={inputClass} style={{colorScheme: 'dark'}}/>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-purple-300/70 block mb-1">Time</label>
                                    <input type="time" required value={editingTrip.time} onChange={e => setEditingTrip({...editingTrip, time: e.target.value})} className={inputClass} style={{colorScheme: 'dark'}}/>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-purple-300/70 block mb-1">Available Seats</label>
                                    <input type="number" min="1" max="6" required value={editingTrip.availableSeats} onChange={e => setEditingTrip({...editingTrip, availableSeats: e.target.value})} className={inputClass} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-purple-300/70 block mb-1">Cost (₹)</label>
                                    <input type="number" min="0" required value={editingTrip.costPerPerson} onChange={e => setEditingTrip({...editingTrip, costPerPerson: e.target.value})} className={inputClass} />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-purple-500 transition mt-4">Save Changes</button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Profile;