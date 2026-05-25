import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
    Phone,
    MapPin,
    MessageCircle,
    Loader2,
    AlertTriangle,
    User,
    Navigation,
    Package,
    ArrowLeft,
    ShieldCheck,
    Copy,
    Check
} from 'lucide-react';

const LostItemPage = () => {
    const { id } = useParams();
    const { user: scanner } = useAuth();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchLostItem = async () => {
            try {
                const response = await api.get(`/item/lost/${id}`);
                setItem(response.data);
            } catch (err) {
                console.error('Failed to fetch lost item:', err);
                setError(err.response?.data?.message || 'Item not found or an error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchLostItem();
    }, [id]);

    const handleWhatsApp = () => {
        if (!item || !item.phone_number) return;

        const ownerPhone = item.phone_number.replace(/\D/g, '');
        const itemName = item.lost_item_name;
        const scannerAddress = scanner?.address || 'not provided';

        const message = `Hi, I found your lost item: ${itemName}. My address is ${scannerAddress}.`;
        const encodedMessage = encodeURIComponent(message);

        window.open(`https://wa.me/${ownerPhone}?text=${encodedMessage}`, '_blank');
    };

    const handleCopyAddress = () => {
        if (!item?.address) return;
        navigator.clipboard.writeText(item.address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
                <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
                <p className="text-gray-500 font-semibold tracking-widest text-xs">Searching...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto mt-10 p-12 glass-card rounded-[3rem] border-red-500/20 flex flex-col items-center text-center space-y-6">
                <div className="p-5 bg-red-500/10 rounded-full text-red-400 border border-red-500/20 shadow-2xl shadow-red-500/10">
                    <AlertTriangle className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-semibold text-white tracking-tighter">Item Not Found</h1>
                <p className="text-gray-500 font-medium">{error}</p>
                <Link to="/" className="inline-flex items-center text-indigo-400 font-semibold hover:text-indigo-300 transition-colors tracking-widest text-xs">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Return to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Found Item Header */}
            <div className="glass-card p-12 rounded-[3.5rem] border-white/5 flex flex-col items-center text-center space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-full accent-gradient opacity-10 blur-[120px] -z-10" />
                <div className="relative">
                    <img
                        src={item.avatar}
                        alt="Owner"
                        className="w-28 h-28 rounded-full border-4 border-white/10 shadow-2xl relative z-10"
                    />
                    <div className="absolute -bottom-2 -right-2 p-2.5 accent-gradient text-white rounded-2xl shadow-lg border border-white/20 z-20">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                </div>
                <div>
                    <h1 className="text-4xl font-semibold text-white tracking-tighter">Found an <span className="text-indigo-400">Item</span>?</h1>
                    <p className="text-gray-400 font-medium mt-2 max-w-sm mx-auto leading-relaxed">
                        "Your kindness in returning this item is deeply valued. Let's make sure it gets back to the owner."
                    </p>
                </div>
            </div>

            {/* Asset Details Container */}
            <div className="glass-card overflow-hidden rounded-[3rem] border-white/5 shadow-2xl group">
                <div className="p-8 bg-white/5 border-b border-white/5 flex items-center space-x-5">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-indigo-400 group-hover:accent-glow transition-all duration-500">
                        <Package className="w-7 h-7" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-semibold text-indigo-500 tracking-[0.1em]">Item Details</h2>
                        <h3 className="text-2xl font-bold text-white tracking-tight">{item.lost_item_name}</h3>
                    </div>
                </div>
                <div className="p-10">
                    <p className="text-gray-400 text-lg leading-relaxed italic border-l-4 border-indigo-500/30 pl-6 font-medium">
                        "{item.lost_item_note}"
                    </p>
                </div>
            </div>

            {/* Verification & Contact Info */}
            <div className="glass-card p-10 rounded-[3.5rem] border-white/5 space-y-10 shadow-2xl relative overflow-hidden">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg"><Phone className="w-5 h-5 text-indigo-400" /></div>
                    <h2 className="text-lg font-semibold text-white tracking-tight">Verified Owner Contact</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-4 p-6 bg-white/5 rounded-3xl border border-white/10 hover:border-indigo-500/30 transition-all duration-500">
                        <Phone className="w-6 h-6 text-gray-600" />
                        <div>
                            <p className="text-[10px] font-bold text-gray-600 tracking-widest">Phone Number</p>
                            <p className="text-lg font-semibold text-white tracking-tight">{item.phone_number}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10 hover:border-indigo-500/30 transition-all duration-500 group/address">
                        <div className="flex items-center space-x-4 flex-1">
                            <MapPin className="w-6 h-6 text-gray-600 shrink-0" />
                            <div>
                                <p className="text-[10px] font-bold text-gray-600 tracking-widest">Return Address</p>
                                <p className="text-lg font-semibold text-white tracking-tight leading-snug">{item.address}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleCopyAddress}
                            className={`p-3 rounded-xl border transition-all duration-300 ${copied
                                    ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white group-hover/address:border-indigo-500/50'
                                }`}
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {item.home_coordinates && (
                    <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-between group">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-all">
                                <Navigation className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-600 tracking-widest">Location Coordinates</p>
                                <p className="text-xl font-mono font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{item.home_coordinates}</p>
                            </div>
                        </div>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${item.home_coordinates}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 bg-white/5 text-indigo-400 rounded-2xl border border-indigo-500/20 hover:bg-indigo-500/10 transition-all active:scale-95 shadow-lg shadow-indigo-500/5 group"
                        >
                            <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                )}

                <div className="pt-4">
                    <button
                        onClick={handleWhatsApp}
                        className="w-full h-20 flex items-center justify-center space-x-4 bg-green-500 text-white font-semibold rounded-3xl hover:bg-green-600 hover:scale-[1.02] transition-all shadow-2xl shadow-green-500/20 active:scale-95 tracking-[0.1em]"
                    >
                        <MessageCircle className="w-8 h-8" />
                        <span>Contact Owner via WhatsApp</span>
                    </button>
                    <div className="text-center mt-6">
                        <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-[0.3em] flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4 mr-2 text-green-500/50" />
                            Secure and helpful return service
                        </p>
                    </div>
                </div>
            </div>

            <div className="text-center pt-8">
                <Link to="/" className="text-[10px] font-semibold text-gray-600 hover:text-white transition-all uppercase tracking-[0.4em]">
                    / Root Directory /
                </Link>
            </div>
        </div>
    );
};

export default LostItemPage;
