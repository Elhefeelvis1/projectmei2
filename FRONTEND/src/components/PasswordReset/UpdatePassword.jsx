import { useState, useEffect } from "react";
import { EyeOff, Eye, AlertCircle } from "lucide-react"; // Added AlertCircle for the error UI
import { supabase } from "../../supabaseClient";
import { useNavigate, Link } from "react-router-dom"; // Added Link for the fallback button

export default function UpdatePassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [status, setStatus] = useState({ type: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);

    // States for password visibility toggles
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // New state strictly for fatal URL errors (like expired links)
    const [linkError, setLinkError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAccess = async () => {
            // 1. FIRST check the URL for Supabase error parameters
            const searchParams = new URLSearchParams(window.location.search);
            const hashParams = new URLSearchParams(window.location.hash.substring(1));

            const error = searchParams.get("error") || hashParams.get("error");
            const errorDescription = searchParams.get("error_description") || hashParams.get("error_description");

            if (error || errorDescription) {
                console.error("Link Error:", error, errorDescription);
                const isExpired = error === "access_denied" || errorDescription?.toLowerCase().includes("expired") || error === "otp_expired";

                setLinkError(isExpired
                    ? "This reset link has expired or is invalid. Please request a new one."
                    : (errorDescription || "There was an issue verifying your secure link.")
                );

                // Clean the URL so the error string doesn't linger on refresh
                window.history.replaceState(null, "", window.location.pathname);
                return; // Stop executing here so we don't instantly redirect them to /login!
            }

            // 2. IF no URL errors, check if they actually have a valid temporary session
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/login');
            }
        };

        verifyAccess();
    }, [navigate]);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ type: "", message: "" });

        if (newPassword !== confirmPassword) {
            setStatus({ type: "error", message: "Passwords do not match. Please try again." });
            setIsLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            setStatus({
                type: "success",
                message: "Password updated successfully! Redirecting..."
            });

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error("Update error:", error);
            setStatus({ type: "error", message: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md">
                {linkError ? (
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <AlertCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                        <p className="text-sm text-gray-500 mb-6">{linkError}</p>

                        <Link
                            to="/forgot-password"
                            className="w-full block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            Request New Link
                        </Link>
                    </div>
                ) : (
                    // Otherwise, render the normal Update Password form
                    <>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Password</h2>

                        {status.message && (
                            <div className={`p-3 mb-4 rounded-md text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {status.message}
                            </div>
                        )}

                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        minLength={6}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none pr-10"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>

                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        minLength={6}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none pr-10"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !newPassword || !confirmPassword}
                                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors mt-2"
                            >
                                {isLoading ? "Updating..." : "Update Password"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}