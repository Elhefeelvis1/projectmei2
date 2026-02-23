import { useState } from "react";
import { ArrowRightCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
    const [input, setInput] = useState({
        email: "",
        password: "",
        passwordRepeat: "",
    });
    const [newAccount, setNewAccount] = useState(false);
    const [showHelper, setShowHelper] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
        if (name === "password") setShowHelper(true);
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center p-4">
            <div className="w-full flex justify-start mb-8">
                <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="text-black" />
                </Link>
            </div>

            <div className="w-full max-w-[450px] px-4">
                <div className="flex items-center mb-8 gap-4">
                    <h2 className="text-3xl sm:text-5xl font-bold flex-1">
                        {newAccount ? "Create Account" : "Welcome Back!"}
                    </h2>
                    <div className="w-[150px] sm:w-[200px]">
                        <img 
                            src="/images/other/loginHeader.svg" 
                            alt="Login header" 
                            className="w-full h-auto block" 
                        />
                    </div>
                </div>

                <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 outline-none"
                            value={input.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 outline-none"
                            value={input.password}
                            onChange={handleChange}
                        />
                        {showHelper && (
                            <p className="text-xs text-gray-500 mt-1">
                                Your password must be 8-20 characters long and contain letters and numbers.
                            </p>
                        )}
                    </div>

                    {newAccount && (
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Repeat Password</label>
                            <input
                                type="password"
                                name="passwordRepeat"
                                required
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 outline-none"
                                value={input.passwordRepeat}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <button className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-md font-bold transition-colors">
                        {newAccount ? "Sign Up" : "Log In"}
                        <ArrowRightCircle size={20} />
                    </button>

                    <button 
                        type="button"
                        onClick={() => setNewAccount(!newAccount)}
                        className="text-blue-600 hover:underline text-sm font-medium w-full text-center"
                    >
                        {newAccount ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
}