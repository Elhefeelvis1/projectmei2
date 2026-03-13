import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from 'lucide-react'; 
import MultiImageUploader from "../components/GlobalComps/MultiImageUploader";
import { supabase } from "../supabaseClient";

export default function MakePost({ mode }) {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [itemId, setItemId] = useState(null);
    const [images, setImages] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        category: "",
        condition: "",
        description: ""
    });

    const handleGoBack = () => navigate(-1);

    useEffect(() => {
        
        if (mode === "edit") {
            setIsEditing(true);
            if (location.state?.item) {
                const { item } = location.state;
                setItemId(item.id);
                setFormData({
                    title: item.title || "",
                    price: item.price || "",
                    category: item.category || "",
                    condition: item.condition || "",
                    description: item.description || ""
                });
            }
            // 3. If the item already has images from Supabase, load them!
            // (Assuming your database stores them as an array of URLs in an 'images' column)
            if (item.images && Array.isArray(item.images)) {
                // Format existing string URLs into the object structure our Uploader expects
                const formattedExistingImages = item.images.map(url => ({
                    file: null, // No raw file because it's already in the database
                    preview: url // The Supabase https link
                }));
                setImages(formattedExistingImages);
            }
        }
    }, [mode, location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(isEditing) {
            console.log(`Updating item ID: ${itemId}`);
            
            // --- SUPABASE UPDATE LOGIC ---
            // const { data, error } = await supabase
            //     .from('items_table_name')
            //     .update({ ...formData, images: images }) // Push updated form and image data
            //     .eq('id', itemId); // <--- Here is where the ID is used!
            
            // if (!error) navigate('/my-items');

        } else {
            console.log("Inserting new item...");
            
            // --- SUPABASE INSERT LOGIC ---
            // const { data, error } = await supabase
            //     .from('items_table_name')
            //     .insert([{ ...formData, images: images }]);
            
            // if (!error) navigate('/my-items');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 mt-4 pb-12">
            <div className="flex items-center gap-4 mb-6">
                <button 
                    onClick={handleGoBack} 
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="text-gray-800" size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                    {isEditing ? "Edit Your Listing" : "Create New Listing"}
                </h1>
            </div>

            <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <MultiImageUploader 
                    images={images} 
                    setImages={setImages} 
                />

                <form className="flex flex-col gap-6 mt-6 mb-2" autoComplete="off" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Title</label>
                        <input 
                            type="text" name="title" value={formData.title} onChange={handleChange} required
                            placeholder="What are you selling?"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Price (₦)</label>
                        <input 
                            type="number" name="price" value={formData.price} onChange={handleChange} required
                            placeholder="0.00"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Category</label>
                        <select 
                            name="category" value={formData.category} onChange={handleChange} required
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-600 outline-none transition-all cursor-pointer"
                        >
                            <option value="" disabled>Select a category</option>
                            <optgroup label="Electronics">
                                <option value="mobile-phones">Mobile Phones</option>
                                <option value="electronics-computers">Electronics & computers</option>
                            </optgroup>
                            <optgroup label="Home">
                                <option value="furniture">Furniture</option>
                                <option value="appliances">Appliances</option>
                            </optgroup>
                            {/* ... Add the rest of your categories back here ... */}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Condition</label>
                        <select 
                            name="condition" value={formData.condition} onChange={handleChange} required
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-600 outline-none transition-all cursor-pointer"
                        >
                            <option value="" disabled>Select condition</option>
                            <option value="new">New</option>
                            <option value="used-like-new">Used - like new</option>
                            <option value="used-good">Used - good</option>
                            <option value="used-fair">Used - fair</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Description (Optional)</label>
                        <textarea 
                            name="description" value={formData.description} onChange={handleChange} rows="4"
                            placeholder="Tell us more about what you are selling..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none transition-all resize-none"
                        ></textarea>
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-lg shadow-md transition-all active:scale-95 mt-2"
                    >
                        {isEditing ? "Save Changes" : "Post Item"}
                    </button>
                </form>
            </div>
        </div>
    );
}