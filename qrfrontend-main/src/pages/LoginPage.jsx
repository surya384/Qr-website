import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ShieldCheck, QrCode } from 'lucide-react';

const LoginPage = () => {
    const { user, handleGoogleLogin } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const googleBtnRef = useRef(null);

    useEffect(() => {
        if (user) {
            const redirectPath = searchParams.get('redirect') || '/';
            navigate(redirectPath);
        }
    }, [user, navigate, searchParams]);

    useEffect(() => {
        const initializeGoogle = () => {
            if (window.google) {
                google.accounts.id.initialize({
                    client_id: "513990147685-1crthho46su9i2u1ibl0aktsvblk52hg.apps.googleusercontent.com",
                    callback: handleGoogleLogin,
                    auto_select: false,
                    ux_mode: 'popup',
                    use_fedcm_for_prompt: false,
                });

                if (googleBtnRef.current) {
                    google.accounts.id.renderButton(
                        googleBtnRef.current,
                        {
                            theme: "outline",
                            size: "large",
                            width: 400,
                        }
                    );
                }
            }
        };

        // Check if script is already loaded
        if (window.google) {
            initializeGoogle();
        } else {
            // Wait for script to load via onload or interval
            const interval = setInterval(() => {
                if (window.google) {
                    initializeGoogle();
                    clearInterval(interval);
                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, [handleGoogleLogin]);

    const handleTestConnection = async () => {
        const testUrl = import.meta.env.VITE_API_BASE_URL
        alert(`Diagnostic: Testing connection to ${testUrl}`);
        try {
            const response = await fetch(testUrl, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'ngrok-skip-browser-warning': '69420'
                }
            });
            alert(`Diagnostic: SUCCESS! Status: ${response.status}`);
        } catch (error) {
            alert(`Diagnostic: FAILED! ${error.message}\nCheck CORS/SSL.`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[150px] -z-10 rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] -z-10 rounded-full" />

            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Brand Side */}
                <div className="space-y-8 text-center md:text-left animate-in slide-in-from-left-8 duration-1000">
                    <div className="inline-flex p-4 accent-gradient rounded-[2rem] accent-glow shadow-2xl">
                        <QrCode className="w-12 h-12 text-white" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tighter leading-none">
                            LOST<br />
                            <span className="text-indigo-400">FOUND</span>
                        </h1>
                        <p className="text-xl text-gray-400 font-medium tracking-tight max-w-sm">
                            Protect your belongings with smart QR tags. Simple and secure.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-6 pt-4">
                        {[
                            { icon: ShieldCheck, text: 'Safe Storage' },
                            { icon: Sparkles, text: 'Easy Return' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center space-x-3 px-6 py-3 glass-card rounded-2xl border-white/5">
                                <item.icon className="w-5 h-5 text-indigo-400" />
                                <span className="text-sm font-semibold text-white tracking-wide">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Login Card Side */}
                <div className="glass-card p-12 rounded-[3.5rem] border-white/5 shadow-2xl animate-in slide-in-from-right-8 duration-1000 relative">
                    <div className="space-y-10">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-semibold text-white tracking-tight">Sign In</h2>
                            <p className="text-gray-500 font-medium">Sign in with Google to manage your items.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="relative w-full h-20 group overflow-hidden rounded-[2rem]">
                                {/* Our beautiful custom button, underneath but visible */}
                                <div className="absolute inset-0 z-10 accent-gradient text-white flex items-center justify-center space-x-4 transition-all duration-300 shadow-xl accent-glow border border-white/10 group-hover:brightness-110 pointer-events-none">
                                    <div className="bg-white p-2.5 rounded-full shadow-lg">
                                        <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                    </div>
                                    <span className="text-lg font-bold tracking-tight">Sign in with Google</span>
                                </div>

                                {/* The REAL official button, perfectly centered and essentially invisible but clickable */}
                                <div className="absolute inset-0 z-20 opacity-[0.01] cursor-pointer flex justify-center items-center pointer-events-auto">
                                    <div ref={googleBtnRef} className="w-full h-full" />
                                </div>
                            </div>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                                <div className="relative flex justify-center text-xs tracking-widest font-semibold text-gray-700">
                                    <span className="bg-midnight-deep px-4">Secure Sign In</span>
                                </div>
                            </div>

                            <button
                                onClick={handleTestConnection}
                                className="w-full py-3 px-6 rounded-2xl border border-white/5 bg-white/5 text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-white/10 transition-all active:scale-95"
                            >
                                Test API Connection
                            </button>

                            <p className="text-[10px] text-center text-gray-600 font-semibold tracking-wide leading-relaxed">
                                By signing in, you agree to our <br />
                                <span className="text-indigo-500/40">Terms of Service</span> & <span className="text-indigo-500/40">Privacy Policy</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
