import { useNavigate } from 'react-router-dom';

const MinimalItemCard = ({ item }) => {
    const navigate = useNavigate();
    // Supabase mapping provides name, askingPrice, and images (or original DB fields)
    const title = item.item_name || 'Untitled Item';
    const price = item.item_value || 0;

    // Try mapping the image array or fallback
    const images = item.image_url;
    const image = images.length > 0 ? images[0] : null;

    return (
        <div
            onClick={() => navigate(`/itemDetails/${item.id}`)}
            className="group flex flex-col bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 h-full"
        >
            <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden relative">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                        <svg className="w-10 h-10 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span className="text-xs font-semibold">No Image</span>
                    </div>
                )}
                {/* Subtle condition tag mimicking ebay */}
                <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-sm text-[11px] font-bold text-gray-800 shadow-sm border border-gray-100/50 uppercase tracking-wider">
                    Pre-owned
                </div>
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-gray-900 font-medium text-base line-clamp-2 leading-snug mb-3 group-hover:text-blue-700 group-hover:underline transition-colors decoration-blue-700/30 underline-offset-2">
                    {title}
                </h3>

                <div className="mt-auto">
                    <div className="text-xl font-bold text-gray-900 tracking-tight">
                        ₦{Number(price).toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5 font-medium">
                        <span className="font-bold text-green-700">Free pickup</span>
                        <span className="mx-1.5 text-gray-300">•</span>
                        from campus
                    </p>
                    <div className="flex items-center gap-1.5 mt-3 text-red-600 text-xs font-bold bg-red-50 w-fit px-2 py-1 rounded-md">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Ending Soon
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MinimalItemCard;