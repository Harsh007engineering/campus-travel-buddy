import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Calendar, Clock, Search, ShieldCheck, Car, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [trips, setTrips] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [newTrip, setNewTrip] = useState({
        source: '', destination: '', date: '', time: '', availableSeats: '', costPerPerson: ''
    });

    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => { fetchTrips(); }, []);

    const fetchTrips = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/trips/all');
            setTrips(res.data);
        } catch (err) {
            toast.error("Failed to load trips");
        }
    };

    const handlePostTrip = async (e) => {
        e.preventDefault();
        setIsPosting(true);
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/trips/create', newTrip, { headers: { 'Authorization': token }});
            toast.success("Trip posted successfully!");
            setNewTrip({source: '', destination: '', date: '', time: '', availableSeats: '', costPerPerson: ''});
            fetchTrips();
        } catch (err) {
            toast.error("Failed to post trip.");
        } finally {
            setIsPosting(false);
        }
    };

    const handleJoinTrip = async (tripId) => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.post(`http://localhost:5000/api/trips/join/${tripId}`, {}, { headers: { 'Authorization': token }});
            toast.success(res.data.message);
            fetchTrips();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to join trip");
        }
    };

    const filteredTrips = trips.filter(trip =>
        trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.source.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const inputClass = "w-full px-4 py-2 border border-purple-900/30 bg-[#161233] rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition text-white placeholder-indigo-300/30";

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            <div className="grid md:grid-cols-3 gap-8">
                
                {/* POST TRIP CARD */}
                <div className="md:col-span-1 bg-[#1a1635]/80 backdrop-blur-md p-6 rounded-3xl border border-purple-900/40 shadow-2xl h-fit sticky top-24">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Car size={20} className="text-brand"/> Offer a Ride
                    </h3>
                    <form onSubmit={handlePostTrip} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-purple-300/70 uppercase tracking-wider mb-1 block">From</label>
                            <input type="text" placeholder="e.g. VIT Campus" required value={newTrip.source} onChange={e => setNewTrip({...newTrip, source: e.target.value})} className={inputClass} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-purple-300/70 uppercase tracking-wider mb-1 block">To</label>
                            <input type="text" placeholder="e.g. Railway Station" required value={newTrip.destination} onChange={e => setNewTrip({...newTrip, destination: e.target.value})} className={inputClass} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-bold text-purple-300/70 uppercase tracking-wider mb-1 block">Date</label>
                                <input type="date" required value={newTrip.date} onChange={e => setNewTrip({...newTrip, date: e.target.value})} className={inputClass} style={{colorScheme: 'dark'}}/>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-purple-300/70 uppercase tracking-wider mb-1 block">Time</label>
                                <input type="time" required value={newTrip.time} onChange={e => setNewTrip({...newTrip, time: e.target.value})} className={inputClass} style={{colorScheme: 'dark'}}/>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-bold text-purple-300/70 uppercase tracking-wider mb-1 block">Seats</label>
                                <input type="number" min="1" max="6" required value={newTrip.availableSeats} onChange={e => setNewTrip({...newTrip, availableSeats: e.target.value})} className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-purple-300/70 uppercase tracking-wider mb-1 block">Cost (₹)</label>
                                <input type="number" min="0" required value={newTrip.costPerPerson} onChange={e => setNewTrip({...newTrip, costPerPerson: e.target.value})} className={inputClass} />
                            </div>
                        </div>
                        <button disabled={isPosting} type="submit" className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-purple-500 transition shadow-lg shadow-brand/20 disabled:opacity-70 mt-2 active:scale-95">
                            {isPosting ? 'Posting...' : 'Publish Ride'}
                        </button>
                    </form>
                </div>

                {/* TRIP LIST SECTION */}
                <div className="md:col-span-2 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 text-purple-400" size={20} />
                        <input type="text" placeholder="Where do you want to go?" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-[#1a1635] border border-purple-900/40 rounded-2xl shadow-lg focus:ring-2 focus:ring-brand outline-none transition text-lg font-medium text-white placeholder-purple-300/40" />
                    </div>

                    <div className="space-y-4">
                        {filteredTrips.map(trip => {
                            const isCreator = currentUser && trip.creator && trip.creator._id === currentUser.id;
                            const isPassenger = currentUser && trip.passengers.some(p => p._id === currentUser.id);
                            const hasJoinedOrCreated = isCreator || isPassenger;

                            // THE MATH FIX IS HERE
                            // Filled = Passengers + 1 (The Driver)
                            const filledSeats = (trip.passengers?.length || 0) + 1;
                            // Total = Available Remaining + Passengers + 1 (The Driver)
                            const totalSeats = trip.availableSeats + (trip.passengers?.length || 0) + 1;
                            const fillPercentage = totalSeats > 0 ? (filledSeats / totalSeats) * 100 : 0;

                            return (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} whileHover={{ y: -4, scale: 1.01 }} key={trip._id} className={`bg-[#1a1635]/80 backdrop-blur-md p-6 rounded-3xl border transition-all duration-300 shadow-xl ${isCreator ? 'border-brand ring-1 ring-brand/40 shadow-brand/10' : 'border-purple-900/40 hover:border-purple-700/50'}`}>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-[#110c2e] p-3 rounded-2xl border border-purple-900/50 text-brand shadow-inner"><Car size={24} /></div>
                                            <div>
                                                <div className="flex items-center gap-2 text-xl font-extrabold text-white tracking-tight"><span>{trip.source}</span><span className="text-purple-500/50">➔</span><span>{trip.destination}</span></div>
                                                <div className="flex items-center gap-4 text-sm text-purple-200/70 font-medium mt-1"><span className="flex items-center gap-1.5"><Calendar size={16} className="text-brand"/> {trip.date}</span><span className="flex items-center gap-1.5"><Clock size={16} className="text-brand"/> {trip.time}</span></div>
                                            </div>
                                        </div>
                                        <div className="text-right bg-brand text-white px-4 py-2 rounded-2xl shadow-lg shadow-brand/30 border border-purple-400"><div className="text-xl font-bold">₹{trip.costPerPerson}</div></div>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex justify-between text-xs font-bold text-purple-300/70 uppercase tracking-wider mb-2"><span>Seats Filled</span><span className="text-white">{filledSeats} / {totalSeats}</span></div>
                                        <div className="w-full bg-[#110c2e] rounded-full h-2.5 overflow-hidden border border-purple-900/50">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${fillPercentage}%` }} transition={{ duration: 1, delay: 0.2 }} className={`h-full rounded-full ${trip.availableSeats === 0 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]' : 'bg-brand shadow-[0_0_10px_rgba(139,92,246,0.8)]'}`}></motion.div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center bg-[#110c2e] p-4 rounded-2xl border border-purple-900/30 shadow-inner">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center font-bold shadow-md">{trip.creator?.name?.charAt(0) || '?'}</div>
                                            <div><p className="text-sm font-bold text-white">{trip.creator?.name || 'Unknown Driver'}</p><p className="text-xs text-emerald-400 font-medium flex items-center gap-1"><ShieldCheck size={14}/> Verified Student</p></div>
                                        </div>
                                        <div>
                                            {!isCreator && !isPassenger && trip.availableSeats > 0 && <button onClick={() => handleJoinTrip(trip._id)} className="px-6 py-2.5 bg-brand text-white font-semibold rounded-full hover:bg-purple-500 transition-all shadow-lg shadow-brand/30 active:scale-95">Request Ride</button>}
                                            {!isCreator && isPassenger && <div className="px-4 py-2 bg-emerald-500/10 text-emerald-400 font-bold rounded-full text-sm flex items-center gap-2 border border-emerald-500/20"><ShieldCheck size={16}/> Riding</div>}
                                            {isCreator && <div className="px-4 py-2 bg-purple-900/40 text-purple-200 font-bold rounded-full text-sm border border-purple-700/50">Your Car</div>}
                                            {trip.availableSeats === 0 && !isPassenger && !isCreator && <div className="px-4 py-2 bg-rose-500/10 text-rose-400 font-bold rounded-full text-sm border border-rose-500/20">Full</div>}
                                        </div>
                                    </div>

                                    {hasJoinedOrCreated && trip.creator && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-[#0b0914] text-white p-5 rounded-2xl mt-4 shadow-inner border border-purple-900/30">
                                            <h5 className="text-sm font-bold text-brand mb-3 flex items-center gap-2 uppercase tracking-wider"><Lock size={16}/> Private Contact Details</h5>
                                            <div className="text-sm space-y-2">
                                                <p className="flex justify-between border-b border-purple-900/30 pb-2"><span className="text-purple-300/70">Driver Phone:</span><span className="font-mono text-emerald-400">{trip.creator.phone}</span></p>
                                                {trip.passengers.length > 0 && (
                                                    <div className="pt-2"><strong className="text-xs uppercase text-purple-400/50 block mb-2">Co-Passengers:</strong><ul className="space-y-2">{trip.passengers.map(p => (<li key={p._id} className="flex justify-between bg-[#161233] p-3 rounded-lg border border-purple-900/40"><span className="font-medium">{p.name}</span> <span className="font-mono text-emerald-400">{p.phone}</span></li>))}</ul></div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;