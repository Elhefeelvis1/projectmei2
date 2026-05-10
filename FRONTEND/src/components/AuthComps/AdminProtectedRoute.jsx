import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const AdminProtectedRoute = ({ children }) => {
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAdminAccess = async () => {
            // 1. Check if they are even logged in
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                navigate('/login');
                return;
            }

            // 2. Securely check the database
            const { data: isAdmin } = await supabase.rpc('is_admin');

            if (isAdmin) {
                // Let them in!
                setIsVerified(true);
            } else {
                // Kick them back to the marketplace
                navigate('/');
            }
            setIsLoading(false);
        };

        verifyAdminAccess();
    }, [navigate]);

    // Show a loading spinner while checking the database
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>Verifying secure access...</p>
            </div>
        );
    }

    // If verified, render the admin dashboard pages
    return isVerified ? children : null;
};

export default AdminProtectedRoute;