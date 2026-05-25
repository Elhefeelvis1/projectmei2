import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState({ type: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);

    const handleResetRequest = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ type: "", message: "" });

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                // This tells Supabase where to send the user after they click the email link
                redirectTo: `${window.location.origin}/update-password`,
            });

            if (error) throw error;

            setStatus({
                type: "success",
                message: "Password reset instructions sent! Please check your email.",
            });
            setEmail(""); // Clear the input
        } catch (error) {
            console.error("Reset error:", error);
            setStatus({ type: "error", message: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
                <p className="text-sm text-gray-500 mb-6">Enter your email address and we'll send you a link to reset your password.</p>

                {status.message && (
                    <div className={`p-3 mb-4 rounded-md text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleResetRequest} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="you@student.edu"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !email}
                        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/login" className="text-sm text-green-600 hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}