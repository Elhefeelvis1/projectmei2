import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Nav from "../components/GlobalComps/Nav.jsx";
import BouncingLoader from '../components/GlobalComps/BouncingLoader';
import { supabase } from '../supabaseClient';
import BidItemCard from '../components/BodyComps/BidItemCard';
import ImageViewer from '../components/BodyComps/ImageViewer';
import { ChevronRight, ImageOff } from 'lucide-react';

export default function ItemDetails() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('all_items')
                    .select('*, users_info(display_name, school)')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setItem(data);
                console.log(data);
            } catch (error) {
                console.error("Error fetching item details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <BouncingLoader />
            </div>
        );
    }

    if (!item) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
                <Nav />
                <h2 className="text-2xl font-bold text-gray-700 mt-20">Item not found</h2>
                <Link to="/itemList" className="mt-4 text-blue-600 hover:underline">Return to items</Link>
            </div>
        );
    }

    const images = item.image_url || [];
    const hasImages = images.length > 0;

    // Format dates
    const listedDate = new Date(item.created_at).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });

    return (
        <div className="bg-white min-h-screen pb-12 font-sans">
            <Nav />

            <main className="max-w-6xl mx-auto px-4 py-6 md:py-10 pt-25 md:pt-25">
                {/* Breadcrumbs */}
                <nav className="flex items-center text-xs text-gray-500 mb-6">
                    <Link to="/" className="hover:underline">Home</Link>
                    <ChevronRight size={14} className="mx-1" />
                    <Link to="/itemList" className="hover:underline">Live Auctions & Bidding</Link>
                    <ChevronRight size={14} className="mx-1" />
                    <span className="text-gray-900 font-medium truncate">{item.item_name}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* LEFT: Image Gallery */}
                    <div className="w-full lg:w-[45%] flex flex-col md:flex-row-reverse gap-4">
                        {/* Main Image */}
                        <div className="w-full md:w-5/6 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden relative aspect-square border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => hasImages && setIsViewerOpen(true)}>
                            {hasImages ? (
                                <img
                                    src={images[mainImageIndex]}
                                    alt={item.item_name}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                    <ImageOff size={48} className="mb-2 opacity-50" />
                                    <span>No image available</span>
                                </div>
                            )}
                            {hasImages && (
                                <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur text-gray-700 text-xs px-2 py-1 rounded shadow-sm flex items-center gap-1 font-medium">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                                    Hover to zoom
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {hasImages && images.length > 1 && (
                            <div className="w-full md:w-1/6 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto no-scrollbar pb-2 md:pb-0 md:max-h-[500px]">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setMainImageIndex(idx)}
                                        className={`relative w-20 md:w-full aspect-square rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${mainImageIndex === idx ? 'border-blue-600 shadow-md' : 'border-gray-200 hover:border-gray-400'}`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* CENTER: Item Details */}
                    <div className="w-full lg:w-[30%] flex flex-col">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-2">
                            {item.item_name}
                        </h1>

                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm text-gray-600">Condition:</span>
                            <span className="text-sm font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">Pre-owned</span>
                        </div>

                        <div className="border-b border-t border-gray-200 py-3 mb-4">
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Quantity:</span>
                                    <span className="text-sm font-medium text-gray-900">{item.quantity_available} available</span>
                                </div>
                                <div className="flex justify-between items-center text-red-600 text-sm font-medium">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        Ending soon
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Price Details inline */}
                        <div className="mb-6">
                            <div className="flex items-baseline gap-2">
                                <span className="text-sm text-gray-600">Price:</span>
                                <span className="text-3xl font-bold text-gray-900 tracking-tight">₦{(item.item_value || 0).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Description Full Width below */}
                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300">Item description</h2>
                            <div className="prose max-w-none text-gray-700">
                                {item.description ? (
                                    typeof item.description === 'string' ? item.description.split('\n').map((line, i) => (
                                        <p key={i} className="mb-2">{line}</p>
                                    )) : item.description
                                ) : "No description provided by the seller."}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Buy Box (BidItemCard) */}
                    <div className="w-full lg:w-[25%] flex flex-col">
                        <div className="sticky top-24">
                            <BidItemCard
                                item={item}
                                onRefresh={(newQty, newStatus) => {
                                    setItem(prev => ({ ...prev, quantity_available: newQty, status: newStatus }));
                                }}
                            />

                            <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col gap-3">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Campus Delivery Guarantee</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Get the item you ordered or your money back.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seller Info */}
                <div className="mt-12 border-t border-gray-200 pt-8">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-2">About the Seller</h3>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg">
                                {item.users_info.display_name ? item.users_info.display_name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">
                                    {item.users_info.display_name || 'Unknown User'}
                                </p>
                                <p className="text-xs text-gray-500">Listed on {listedDate}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            {isViewerOpen && hasImages && (
                <ImageViewer
                    images={images}
                    initialIndex={mainImageIndex}
                    onClose={() => setIsViewerOpen(false)}
                />
            )}
        </div>
    );
}