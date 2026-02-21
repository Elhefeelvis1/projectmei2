import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Home, 
  Gamepad2, 
  Backpack, 
  User, 
  Smartphone, 
  Trophy, 
  Compass 
} from 'lucide-react'; // Replacing MUI Icons with Lucide
import MultiImageUploader from "../components/GlobalComps/MultiImageUploader";

export default function MakePost(props) {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    }

    return (
        <div className="max-w-4xl mx-auto px-4 mt-4">
            {/* Back Button */}
            <button 
                onClick={handleGoBack} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors mb-4"
                aria-label="Go back"
            >
                <ArrowLeft className="text-black" size={24} />
            </button>

            <div className="max-w-lg mx-auto">
                <MultiImageUploader />

                <form className="flex flex-col gap-6 mt-6 mb-8" autoComplete="off">
                    {/* Title Field */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Title</label>
                        <input 
                            type="text"
                            required
                            placeholder="What are you selling?"
                            className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-600 outline-none transition-all"
                        />
                    </div>

                    {/* Price Field */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Price (₦)</label>
                        <input 
                            type="number"
                            required
                            placeholder="0.00"
                            className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-600 outline-none transition-all"
                        />
                    </div>

                    {/* Category Selection */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Category</label>
                        <select 
                            required
                            className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-600 outline-none transition-all cursor-pointer"
                        >
                            <option value="" disabled selected>Select a category</option>
                            
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

                    {/* Condition Field */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Condition</label>
                        <select 
                            required
                            className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-600 outline-none transition-all cursor-pointer"
                        >
                            <option value="" disabled selected>Select condition</option>
                            <option value="new">New</option>
                            <option value="used-like-new">Used - like new</option>
                            <option value="used-good">Used - good</option>
                            <option value="used-fair">Used - fair</option>
                        </select>
                    </div>

                    {/* Description Field */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Description (Optional)</label>
                        <textarea 
                            rows="4"
                            placeholder="Tell us more about what you are selling..."
                            className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-600 outline-none transition-all resize-none"
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button 
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition-all active:scale-95"
                        >
                            Post Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}