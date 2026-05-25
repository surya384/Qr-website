import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Trash2, Package, Loader2, X, QrCode } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const ItemsPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [adding, setAdding] = useState(false);

    const [formData, setFormData] = useState({ name: '', notes: '' });
    const [error, setError] = useState('');

    const fetchItems = async () => {
        try {
            const response = await api.get('/items/get');
            setItems(response.data.items || []);
        } catch (err) {
            console.error('Failed to fetch items:', err);
            setError('Could not load items. Check your connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.notes) return;

        setAdding(true);
        setError('');
        try {
            await api.post('/items/add', {
                item_name: formData.name,
                item_notes: formData.notes,
            });
            setFormData({ name: '', notes: '' });
            setShowModal(false);
            await fetchItems();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add item');
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/items/delete/${id}`);
            setItems(items.filter((item) => item.item_id !== id));
        } catch (err) {
            setError('Failed to delete item');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center glass-card p-8 rounded-[2rem] border-white/5 gap-6">
                <div className="text-center sm:text-left">
                    <h1 className="text-3xl font-semibold text-white flex items-center justify-center sm:justify-start tracking-tight">
                        <Package className="w-8 h-8 mr-3 text-indigo-400" />
                        Your Items
                    </h1>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Manage and secure your belongings</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full sm:w-auto px-8 py-3 accent-gradient text-white font-semibold rounded-2xl accent-glow active:scale-95 transition-all flex items-center justify-center"
                >
                    <Plus className="w-6 h-6 mr-2" />
                    Add Item
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl flex items-center space-x-2">
                    <X className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}

            {/* Items List Card */}
            <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
                <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <h3 className="text-xs font-semibold text-indigo-400 tracking-[0.1em]">
                        Items List
                    </h3>
                    <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {items.length} Total
                    </span>
                </div>

                {loading ? (
                    <div className="p-24 flex flex-col items-center justify-center space-y-6">
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                        <p className="text-gray-500 font-bold tracking-widest text-xs">Loading items...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="p-24 text-center flex flex-col items-center">
                        <div className="p-6 bg-white/5 rounded-full mb-6 border border-white/10">
                            <Package className="w-12 h-12 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">No items registered</h3>
                        <p className="text-gray-500 mt-2 max-w-xs mx-auto">Start securing your items by creating your first registration.</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="mt-8 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            + Register First Item
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {items.map((item) => (
                            <div key={item.item_id} className="p-8 hover:bg-white/5 transition-all flex items-center justify-between group">
                                <div className="flex items-center space-x-6">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-indigo-500/30 transition-all duration-500">
                                        <Package className="w-7 h-7 text-gray-500 group-hover:text-indigo-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold text-white tracking-tight">{item.item_name}</h4>
                                        <p className="text-sm text-gray-400 mt-1 max-w-[200px] sm:max-w-md truncate">{item.item_notes}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => {
                                            setSelectedItem(item);
                                            setShowQRModal(true);
                                        }}
                                        className="p-3 bg-white/5 text-gray-400 hover:text-indigo-400 hover:border-indigo-500/30 border border-white/10 rounded-xl transition-all active:scale-95 group-hover:opacity-100 sm:opacity-0"
                                        title="QR Code"
                                    >
                                        <QrCode className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.item_id)}
                                        className="p-3 bg-white/5 text-gray-400 hover:text-red-400 hover:border-red-500/30 border border-white/10 rounded-xl transition-all active:scale-95 group-hover:opacity-100 sm:opacity-0"
                                        title="Delete Item"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* QR Code Modal rendering */}
            {
                showQRModal && selectedItem && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-midnight-base/80 backdrop-blur-xl animate-in fade-in" onClick={() => setShowQRModal(false)} />
                        <div className="relative glass-card w-full max-w-sm rounded-[3rem] border-white/10 animate-in zoom-in-95 p-10 flex flex-col items-center space-y-8">
                            <div className="flex items-center justify-between w-full">
                                <h3 className="text-2xl font-semibold text-white tracking-tighter">Item <span className="text-indigo-400">QR Code</span></h3>
                                <button onClick={() => setShowQRModal(false)} className="p-2 text-gray-500 hover:text-white rounded-xl hover:bg-white/5 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 bg-white rounded-[2.5rem] shadow-2xl accent-glow border-8 border-white/5">
                                <QRCodeCanvas
                                    value={`${window.location.origin}/item/lost/${selectedItem.item_id}`}
                                    size={200}
                                    level="H"
                                    includeMargin={true}
                                    bgColor="#ffffff"
                                    fgColor="#050508"
                                />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-2xl font-semibold text-white tracking-tight">{selectedItem.item_name}</p>
                                <p className="text-sm text-gray-500 font-medium">Scan this code to view item details.</p>
                            </div>
                            <button
                                onClick={() => window.print()}
                                className="w-full py-4 bg-white text-midnight-base font-black rounded-2xl hover:bg-gray-200 transition-all active:scale-95 shadow-lg shadow-white/5 uppercase tracking-widest text-xs"
                            >
                                Print QR Tag
                            </button>
                        </div>
                    </div>
                )
            }

            {/* Add Item Modal Overlay */}
            {
                showModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
                        <div className="fixed inset-0 bg-midnight-base/80 backdrop-blur-xl" onClick={() => setShowModal(false)} />
                        <div className="relative glass-card w-full max-w-lg rounded-[3rem] border-white/10 animate-in zoom-in-95 duration-300 overflow-hidden shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-1 accent-gradient" />
                            <div className="flex items-center justify-between p-10 border-b border-white/5">
                                <div>
                                    <h3 className="text-3xl font-semibold text-white tracking-tighter">Add New <span className="text-indigo-400">Item</span></h3>
                                    <p className="text-sm text-gray-500 mt-1 font-medium">Register a new item to your list.</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-3 text-gray-500 hover:text-white rounded-2xl hover:bg-white/5 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleAdd} className="p-10 space-y-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold text-gray-500 tracking-wide ml-1">Item Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="block w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium"
                                        placeholder="e.g. MacBook Pro"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold text-gray-500 tracking-wide ml-1">Notes</label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="block w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium"
                                        placeholder="Add some notes about this item..."
                                        rows="4"
                                        required
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={adding}
                                        className="w-full h-16 accent-gradient text-white font-semibold rounded-2xl accent-glow active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center shadow-xl"
                                    >
                                        {adding ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm Add Item'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ItemsPage;
