import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Sparkles, QrCode, ShieldCheck } from 'lucide-react';

const DashboardPage = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-10 py-4 animate-in fade-in duration-700">
            {/* Hero Welcome */}
            <div className="relative overflow-hidden glass-card rounded-[2rem] p-10 sm:p-16 text-center border-white/5">
                <div className="absolute top-0 left-0 w-full h-full accent-gradient opacity-5 blur-[100px] -z-10" />
                <div className="inline-flex p-4 rounded-3xl bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                    <Sparkles className="w-8 h-8 text-indigo-400" />
                </div>
                <h1 className="text-4xl sm:text-6xl font-normal text-white mb-6 tracking-tight">
                    Welcome, <span className="text-gradient font-semibold">{user?.name.split(' ')[0]}</span>
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Manage your items, track lost belongings, and secure your property with
                    our smart QR tagging system. Simple tools for your peace of mind.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: LayoutDashboard, label: 'Secure Items', desc: 'Manage your tagged properties' },
                    { icon: QrCode, label: 'QR Tags', desc: 'Securely linked to your profile' },
                    { icon: ShieldCheck, label: 'Profile Verified', desc: 'Protected by Google Auth' },
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-8 rounded-3xl group hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-2">
                        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl w-fit mb-6 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-colors">
                            <stat.icon className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">{stat.label}</h3>
                        <p className="text-gray-500">{stat.desc}</p>
                    </div>
                ))}
            </div>

            {/* Quick Guide Container */}
            <div className="glass-card rounded-[2.5rem] p-10 relative border-white/5">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="max-w-md space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Need a new tag?</h2>
                        <p className="text-gray-400">Head over to the Items section to add a new item and generate a QR tag for it.</p>
                        <button
                            onClick={() => window.location.href = '/items'}
                            className="px-8 py-3 accent-gradient text-white font-semibold rounded-2xl accent-glow active:scale-95 transition-all"
                        >
                            Add Now
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="w-32 h-32 glass-morphism rounded-3xl rotate-12 flex items-center justify-center border-white/20">
                            <QrCode className="w-12 h-12 text-white/20" />
                        </div>
                        <div className="w-32 h-32 glass-morphism rounded-3xl -rotate-12 flex items-center justify-center border-white/20 -translate-y-4">
                            <Sparkles className="w-12 h-12 text-white/20" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
