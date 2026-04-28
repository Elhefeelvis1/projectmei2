import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import MultiImageUploader from "../components/GlobalComps/MultiImageUploader";
import Popup from "../components/GlobalComps/Popup";
import { supabase } from "../supabaseClient";
import { useAuth } from "../components/AuthComps/CheckAuth";

export default function MakePost({ mode }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [popup, setPopup] = useState({ show: false, feedback: "", content: "" });
    const [itemId, setItemId] = useState(null);
    const [images, setImages] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const { session, loading } = useAuth();
    //State for loading button
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        price: "",
        category: "",
        condition: "",
        description: "",
        quantity: 1,
    });

    const handleGoBack = () => navigate(-1);

    useEffect(() => {

        if (mode === "edit") {
            setIsEditing(true);
            if (location.state?.item) {
                const { item } = location.state;
                setItemId(item.id);
                setFormData({
                    title: item.item_name || "",
                    price: item.item_value || "",
                    category: item.category || "",
                    condition: item.condition || "",
                    description: item.description || "",
                    quantity: item.initial_qty || 1
                });
                // 3. If the item already has images from Supabase, load them!
                // (Assuming your database stores them as an array of URLs in an 'images' column)
                if (item.image_url && Array.isArray(item.image_url)) {
                    const formattedExistingImages = item.image_url.map(url => ({
                        file: null, // No raw file because it's already in the database
                        preview: url // The Supabase https link
                    }));
                    setImages(formattedExistingImages);
                }
            }
        }
    }, [mode, location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Prevent double-clicks

        if (images.length < 2) {
            setPopup({
                show: true,
                feedback: "error",
                content: "You need to upload atleast 2 pictures of the item"
            })
            setIsSubmitting(false)
            return
        }

        if (images.length > 5) {
            setPopup({
                show: true,
                feedback: "error",
                content: "You can upload a maximum of 5 pictures"
            })
            setIsSubmitting(false)
            return
        }

        try {

            if (!session?.user) {
                console.error("No user found!");
                return;
            }

            const finalImageUrls = [];

            // 1. Process and Upload Images
            const cloudinaryUrl = import.meta.env.VITE_CLOUDINARY_URL;
            const regex = /^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/;
            const match = cloudinaryUrl?.match(regex);

            if (!match) {
                throw new Error("Invalid or missing VITE_CLOUDINARY_URL env variable.");
            }

            const apiKey = match[1];
            const apiSecret = match[2];
            const cloudName = match[3];

            for (const img of images) {
                if (img.file) {
                    // It's a new file: Upload to Cloudinary

                    const timestamp = Math.round((new Date).getTime() / 1000);
                    const folder = 'uploads';

                    // signature string must be alphabetically sorted by parameter names
                    const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
                    const encoder = new TextEncoder();
                    const dataToSign = encoder.encode(stringToSign);
                    const hashBuffer = await window.crypto.subtle.digest('SHA-1', dataToSign);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

                    const formData = new FormData();
                    formData.append('file', img.file);
                    formData.append('api_key', apiKey);
                    formData.append('timestamp', timestamp);
                    formData.append('signature', signature);
                    formData.append('folder', folder);

                    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                        method: 'POST',
                        body: formData
                    });

                    const uploadData = await uploadRes.json();

                    if (!uploadRes.ok) {
                        console.error("Error uploading image:", uploadData);
                        throw new Error(uploadData.error?.message || "Failed to upload an image.");
                    }

                    finalImageUrls.push(uploadData.secure_url);
                } else {
                    // It's an existing image (Edit Mode): Just keep the URL
                    finalImageUrls.push(img.preview);
                }
            }

            // 2. Prepare the Database Payload
            const itemPayload = {
                item_name: formData.title,
                item_value: Number(formData.price), // Ensure it saves as a number
                category: formData.category,
                condition: formData.condition,
                description: formData.description,
                quantity_available: Number(formData.quantity), // Ensure it saves as a number
                initial_qty: Number(formData.quantity),
                image_url: finalImageUrls, // Save the array of URLs
                user_id: session?.user?.id, // Link the item to the seller
                status: "reviewing" // New items start as "reviewing"
            };

            // 3. Push to Database
            if (isEditing) {
                const { error: updateError } = await supabase
                    .from('all_items')
                    .update(itemPayload)
                    .eq('id', itemId);

                if (updateError) throw updateError;
                console.log("Item updated successfully!");

            } else {
                const { error: insertError } = await supabase
                    .from('all_items')
                    .insert([itemPayload]);

                if (insertError) throw insertError;
                console.log("New item created successfully!");
            }

            navigate('/my-items');

        } catch (error) {
            console.error("Submission error:", error);
            setPopup({
                show: true,
                feedback: "error",
                content: "item could not be uploaded"
            })
        } finally {
            // setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 mt-4 pb-12">
            {popup.show && (
                <Popup
                    feedback={popup.feedback}
                    content={popup.content}
                    onClose={() => setPopup({ show: false, feedback: "", content: "" })}
                />
            )}
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
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-600 outline-none transition-all cursor-pointer"
                        >
                            <option value="" disabled>Select a category</option>

                            <optgroup label="Home">
                                <option value="app">Appliances</option>
                                <option value="furniture">Furniture</option>
                                <option value="household">Household</option>
                                <option value="tools">Tools</option>
                            </optgroup>

                            <optgroup label="Entertainment">
                                <option value="video-games">Video Games</option>
                                <option value="books-films-music">Books, Films, Music</option>
                            </optgroup>

                            <optgroup label="Clothing and accessories">
                                <option value="jewellery-accessories">Jewellery & accessories</option>
                                <option value="bags-luggage">Bags & luggage</option>
                                <option value="mens-clothing-shoes">Men's clothing and shoes</option>
                                <option value="womens-clothing-shoes">Women's clothing and shoes</option>
                            </optgroup>

                            <optgroup label="Personal">
                                <option value="health-beauty">Health & beauty</option>
                                <option value="pet-supplies">Pet supplies</option>
                                <option value="toys-games">Toys and games</option>
                            </optgroup>

                            <optgroup label="Electronics">
                                <option value="mobile-phones">Mobile Phones</option>
                                <option value="electronics-computers">Electronics & computers</option>
                            </optgroup>

                            <optgroup label="Hobbies">
                                <option value="sport-outdoors">Sport & outdoors</option>
                                <option value="musical-instruments">Musical instruments</option>
                                <option value="arts-crafts">Arts & crafts</option>
                                <option value="antiques-collectibles">Antiques & collectibles</option>
                                <option value="car-parts">Car parts</option>
                                <option value="bicycles">Bicycles</option>
                            </optgroup>

                            <optgroup label="Classifieds">
                                <option value="garage-sales">Garage Sales</option>
                                <option value="miscellaneous">Miscellaneous</option>
                            </optgroup>
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
                        <label className="text-sm font-semibold text-gray-700">Quantity</label>
                        <input
                            type="number" name="quantity" value={formData.quantity} onChange={handleChange} required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none transition-all"
                        />
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
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-70 text-white font-bold py-3.5 rounded-lg shadow-md transition-all active:scale-95 mt-2"
                    >
                        {isSubmitting && (
                            <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/01/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}

                        <span>
                            {isSubmitting ? "Processing..." : (isEditing ? "Save Changes" : "Post Item")}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
}