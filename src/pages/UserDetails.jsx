import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';

export default function UserDetails(props) {
    const [editStatus, setEdit] = useState(false);
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="max-w-4xl mx-auto mt-4 px-4">
            {/* Back Button */}
            <button 
                onClick={handleGoBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors mb-4 focus:outline-none"
                aria-label="Go back"
            >
                <ArrowLeft className="text-black" size={24} />
            </button>

            {/* Avatar Section */}
            <div className="flex justify-center mb-8">
                <img
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                    src="/static/images/avatar/1.jpg"
                    alt={props.username || "User avatar"}
                />
            </div>
            
            <div className="max-w-md mx-auto">
                {/* Profile Form */}
                <form 
                    autoComplete="off" 
                    className="flex flex-col gap-5 mb-8"
                    onSubmit={(e) => e.preventDefault()}
                >
                    {/* Username Field */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Username</label>
                        <input
                            type="text"
                            disabled={!editStatus}
                            defaultValue={props.username}
                            className={`w-full p-3 rounded-t-md border-b-2 bg-gray-100 transition-all outline-none
                                ${!editStatus ? 'text-gray-500 border-gray-300' : 'text-gray-900 border-green-600 focus:bg-gray-200'}`}
                        />
                    </div>

                    {/* Full Name Field (Always Disabled) */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                        <input
                            type="text"
                            disabled
                            defaultValue={props.fullName}
                            className="w-full p-3 rounded-t-md border-b-2 border-gray-300 bg-gray-100 text-gray-500 outline-none"
                        />
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email</label>
                        <input
                            type="email"
                            disabled={!editStatus}
                            defaultValue={props.email}
                            className={`w-full p-3 rounded-t-md border-b-2 bg-gray-100 transition-all outline-none
                                ${!editStatus ? 'text-gray-500 border-gray-300' : 'text-gray-900 border-green-600 focus:bg-gray-200'}`}
                        />
                    </div>

                    {/* Phone Number Field */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                        <input
                            type="tel"
                            disabled={!editStatus}
                            defaultValue={props.phoneNumber}
                            className={`w-full p-3 rounded-t-md border-b-2 bg-gray-100 transition-all outline-none
                                ${!editStatus ? 'text-gray-500 border-gray-300' : 'text-gray-900 border-green-600 focus:bg-gray-200'}`}
                        />
                    </div>

                    {/* School Field (Always Disabled) */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">School</label>
                        <input
                            type="text"
                            disabled
                            defaultValue={props.schoolName}
                            className="w-full p-3 rounded-t-md border-b-2 border-gray-300 bg-gray-100 text-gray-500 outline-none"
                        />
                    </div>
                </form>

                {/* Action Button */}
                <div className="mb-8">
                    {editStatus ? (
                        <button 
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded shadow-md transition-all active:scale-95"
                            onClick={() => setEdit(false)}
                        >
                            Save Changes
                        </button> 
                    ) : (
                        <button 
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded shadow-md transition-all active:scale-95"
                            onClick={() => setEdit(true)}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}