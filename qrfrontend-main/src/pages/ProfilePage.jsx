import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
    Phone,
    MapPin,
    Navigation,
    AlertTriangle,
    CheckCircle2,
    Loader2,
    X,
    ExternalLink,
    LocateFixed,
    User
} from 'lucide-react';

const ProfilePage = () => {
    const { user, checkAuth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showCoordModal, setShowCoordModal] = useState(false);

    // Form States
    const [phone, setPhone] = useState(user?.phone_number || '');
    const [address, setAddress] = useState(user?.address || '');
    const [coordinates, setCoordinates] = useState(user?.home_coordinates || '');

    // Status States
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        if (user) {
            setPhone(user.phone_number || '');
            setAddress(user.address || '');
            setCoordinates(user.home_coordinates || '');
        }
    }, [user]);

    const isPhoneValid = (num) => num.startsWith('+');

    const handleUpdate = async (type, value) => {
        setLoading(true);
        setStatus({ type: '', message: '' });

        let endpoint = '';
        let payload = {};

        if (type === 'phone') {
            endpoint = '/user/change/phone';
            payload = { phone: value };
        } else if (type === 'address') {
            endpoint = '/user/change/address';
            payload = { home_address: value };
        } else if (type === 'coordinates') {
            endpoint = '/user/change/home_coordinates';
            payload = { hcoordinates: value };
        }

        try {
            const response = await api.post(endpoint, payload);
            if (response.data && response.data.ok === false) {
                setStatus({ type: 'error', message: response.data.message || `Failed to update ${type}` });
                return;
            }
            setStatus({ type: 'success', message: `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!` });
            if (typeof checkAuth === 'function') {
                await checkAuth();
            }
        } catch (err) {
            console.error('Update failed:', err);
            setStatus({ type: 'error', message: err.response?.data?.message || `Failed to update ${type}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Profile Header */}
            <div className="glass-card p-10 rounded-[2.5rem] border-white/5 flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 accent-gradient opacity-5 blur-[80px] -z-10" />
                <div className="relative">
                    <img src={user?.avatar} alt={user?.name} className="w-24 h-24 rounded-full border-4 border-white/10 shadow-2xl" />
                    <div className="absolute -bottom-2 -right-2 p-2 accent-gradient rounded-xl shadow-lg border border-white/20">
                        <User className="w-5 h-5 text-white" />
                    </div>
                </div>
                <div className="text-center sm:text-left">
                    <h1 className="text-4xl font-semibold text-white tracking-tighter">{user?.name}</h1>
                    <p className="text-lg text-indigo-400/60 font-medium mt-1 tracking-widest text-xs uppercase">{user?.email}</p>
                    <div className="mt-4 flex items-center justify-center sm:justify-start space-x-2">
                        <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-[10px] font-semibold uppercase tracking-widest">Verified</span>
                    </div>
                </div>
            </div>

            {status.message && (
                <div className={`p-6 rounded-2xl flex items-center space-x-4 border animate-in slide-in-from-top-4 ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                    {status.type === 'success' ? <CheckCircle2 className="w-6 h-6 flex-shrink-0" /> : <AlertTriangle className="w-6 h-6 flex-shrink-0" />}
                    <p className="text-sm font-semibold tracking-tight">{status.message}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Phone Section */}
                <div className="glass-card p-8 rounded-[2rem] border-white/5 space-y-6 relative overflow-hidden group">
                    <div className="flex items-center space-x-3 text-white/50 font-semibold tracking-wide text-xs mb-2">
                        <div className="p-2 bg-indigo-500/10 rounded-lg"><Phone className="w-4 h-4 text-indigo-400" /></div>
                        <span>Phone Number</span>
                    </div>
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+XX XXXXXXXXXX"
                            className={`w-full px-6 py-4 bg-white/5 rounded-2xl border transition-all font-mono font-bold text-white placeholder-gray-700 outline-none ${!isPhoneValid(phone) && phone !== '' ? 'border-amber-500/50 focus:ring-2 focus:ring-amber-500/20' : 'border-white/10 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50'
                                }`}
                        />
                        {!isPhoneValid(phone) && phone !== '' && (
                            <div className="flex items-center space-x-2 text-amber-500 text-[10px] font-semibold uppercase tracking-widest px-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Require regional indicator (e.g. +91)</span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => handleUpdate('phone', phone)}
                        disabled={loading || !isPhoneValid(phone)}
                        className="w-full py-4 accent-gradient text-white font-semibold rounded-2xl accent-glow hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 shadow-xl"
                    >
                        Update Phone
                    </button>
                </div>

                {/* Address Section */}
                <div className="glass-card p-8 rounded-[2rem] border-white/5 space-y-6 group relative overflow-hidden">
                    <div className="flex items-center space-x-3 text-white/50 font-semibold tracking-wide text-xs mb-2">
                        <div className="p-2 bg-indigo-500/10 rounded-lg"><MapPin className="w-4 h-4 text-indigo-400" /></div>
                        <span>Home Address</span>
                    </div>
                    <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your home address..."
                        className="w-full px-6 py-4 bg-white/5 rounded-2xl border border-white/10 text-white placeholder-gray-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-semibold outline-none min-h-[140px]"
                    />
                    <button
                        onClick={() => handleUpdate('address', address)}
                        disabled={loading}
                        className="w-full py-4 accent-gradient text-white font-semibold rounded-2xl accent-glow hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 shadow-xl"
                    >
                        Update Address
                    </button>
                </div>
            </div>

            {/* Coordinates Section */}
            <div className="glass-card p-10 rounded-[3rem] border-white/5 flex flex-col items-center space-y-8 relative overflow-hidden text-center">
                <div className="absolute inset-0 accent-gradient opacity-[0.02] -z-10" />
                <div className="space-y-4">
                    <div className="inline-flex p-5 bg-white/5 border border-white/10 rounded-3xl text-indigo-400 shadow-2xl">
                        <Navigation className="w-10 h-10" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-semibold text-white tracking-tighter">Home Coordinates</h3>
                        <p className="text-gray-500 max-w-sm mt-2 font-medium tracking-tight">
                            Set your home coordinates to help people return your items.
                        </p>
                    </div>
                </div>

                <div className="bg-midnight-base/50 px-10 py-5 rounded-[2rem] border border-white/5 font-mono text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    {coordinates || 'NOT SET'}
                </div>

                <button
                    onClick={() => setShowCoordModal(true)}
                    className="flex items-center space-x-3 px-10 py-5 bg-white/5 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all active:scale-95 border border-white/10 text-xs"
                >
                    <LocateFixed className="w-5 h-5 text-indigo-400" />
                    <span>Get Coordinates</span>
                </button>
            </div>

            {/* Coordinates Modal Rendering */}
            {showCoordModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-midnight-base/80 backdrop-blur-xl animate-in fade-in" onClick={() => setShowCoordModal(false)} />
                    <div className="relative glass-card w-full max-w-md rounded-[3rem] border-white/10 animate-in zoom-in-95 p-10 flex flex-col space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-semibold text-white tracking-tighter">Update <span className="text-indigo-400">Coordinates</span></h3>
                            <button onClick={() => setShowCoordModal(false)} className="p-2 text-gray-500 hover:text-white rounded-xl hover:bg-white/5 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                            <p className="text-xs text-indigo-300 font-bold leading-relaxed tracking-wide">
                                Enter coordinates manually or fetch using GPS.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.2em] ml-1">Manual Input</label>
                                <input
                                    type="text"
                                    value={coordinates}
                                    onChange={(e) => setCoordinates(e.target.value)}
                                    className="w-full px-6 py-4 bg-white/5 rounded-2xl border border-white/10 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-mono font-semibold text-white text-sm"
                                    placeholder="Lat, Long"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleUpdate('coordinates', coordinates)}
                                    className="flex items-center justify-center space-x-2 px-4 py-4 accent-gradient text-white font-semibold rounded-2xl accent-glow transition-all active:scale-95 text-[10px]"
                                >
                                    <LocateFixed className="w-4 h-4" />
                                    <span>Use GPS</span>
                                </button>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${coordinates || 'my+location'}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center space-x-2 px-4 py-4 bg-white/5 text-gray-400 font-semibold rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-[10px] uppercase tracking-widest"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    <span>Google Maps</span>
                                </a>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                handleUpdate('coordinates', coordinates);
                                setShowCoordModal(false);
                            }}
                            className="w-full py-5 bg-white text-midnight-base font-semibold rounded-2xl hover:bg-gray-200 transition-all shadow-xl active:scale-95 text-xs"
                        >
                            Save Coordinates
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
