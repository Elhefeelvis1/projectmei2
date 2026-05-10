import { useState } from "react";
import { ArrowRightCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient.js";

export default function Login() {
    const location = useLocation();
    const navigate = useNavigate();
    const [input, setInput] = useState({
        email: "",
        password: "",
        passwordRepeat: "",
        fullName: "",
        school: "",
        username: "",
        phone: ""
    });
    const [newAccount, setNewAccount] = useState(false);
    const [showHelper, setShowHelper] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState('');

    //State for loading button
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get the URL they came from, or default to "/"
    const from = location.state?.from?.pathname || "/";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
        if (name === "password") setShowHelper(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setLoginError(''); // Clear any previous errors when trying again

        try {
            if (newAccount) {
                if (input.password !== input.passwordRepeat) {
                    throw new Error("Passwords do not match");
                }
                const { data, error } = await supabase.auth.signUp({
                    email: input.email,
                    password: input.password,
                    options: {
                        data: {
                            display_name: input.username,
                            full_name: input.fullName,
                            school: input.school,
                            phone: input.phone
                        }
                    }
                });
                if (error) throw error;

                setInput({ ...input, password: "", passwordRepeat: "" });
                setShowHelper(false);
                setNewAccount(false);
                setLoginSuccess("Account created successfully! Verify your email before logging in.");

            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: input.email,
                    password: input.password,
                });
                if (error) throw error;

                if (data?.user) {
                    // 2. Securely ask the database: Is this user an admin?
                    const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin');

                    if (rpcError) {
                        console.error("Failed to verify admin status");
                        return;
                    }

                    // 3. Route them based on the secure database response
                    if (isAdmin) {
                        navigate('/admin');
                    } else {
                        // Redirect back to where they were trying to go, or to the homepage
                        navigate(from, { replace: true });
                    }
                }
            }
        } catch (error) {
            console.error("Error during authentication:", error);
            setLoginSuccess('');
            setLoginError(error.message || "An error occurred. Please try again.");
        } finally {
            // FIXED: This ensures the button stops spinning no matter what happens
            setIsSubmitting(false);
        }
    }

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

                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    {loginError !== '' && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-md font-medium text-sm">
                            {loginError}
                        </div>
                    )}
                    {loginSuccess !== '' && (
                        <div className="bg-green-100 text-green-700 p-3 rounded-md font-medium text-sm">
                            {loginSuccess}
                        </div>
                    )}
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
                        <>
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
                            <div>
                                <label className="text-sm font-medium text-gray-700">Select School</label>
                                <select
                                    name="school"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 outline-none mb-2"
                                    value={input.school}
                                    onChange={handleChange}
                                >
                                    <option value="">Select your school</option>
                                    <option value="Ahmadu Bello University Zaria">Ahmadu Bello University Zaria</option>
                                    <option value="School B">School B</option>
                                    <option value="School C">School C</option>
                                </select>
                                <span className="text-amber-800 bg-amber-100 p-2 text-xs rounded">Note: This cannot be changed later.</span>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 outline-none mb-2"
                                    value={input.fullName}
                                    onChange={handleChange}
                                />
                                <span className="text-amber-800 bg-amber-100 p-2 text-xs rounded">Note: This name will be used for any withdrawal</span>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Display Name/ Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 outline-none mb-2"
                                    value={input.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 outline-none mb-2"
                                    value={input.phone}
                                    onChange={handleChange}
                                    placeholder="e.g. 0803 123 4567"
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-70 text-white p-3 rounded-md font-bold transition-colors mt-2"
                    >
                        {isSubmitting ? "" : newAccount ? "Sign Up" : "Log In"}
                        {isSubmitting ? (
                            <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/01/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : <ArrowRightCircle size={20} />}
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