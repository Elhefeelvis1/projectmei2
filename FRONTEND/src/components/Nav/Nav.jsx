// src/components/Nav/Nav.jsx
import { useState, useEffect } from "react";
import { Mail, Menu, Store, X, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../GlobalComps/Logo";
import NavMenu from "./NavMenu";
import NotificationsPanel from "./NotificationsPanel";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../AuthComps/CheckAuth.jsx";

export default function Nav() {
    const { session } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Fetch and subscribe to unread messages and notifications counts
    useEffect(() => {
        if (!session?.user?.id) {
            setUnreadMessagesCount(0);
            setUnreadNotificationsCount(0);
            return;
        }

        const userId = session.user.id;

        // 1. Fetch unread messages
        const fetchUnreadMessages = async () => {
            try {
                const { data, error } = await supabase
                    .from('conversations')
                    .select('unread_count')
                    .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
                    .gt('unread_count', 0);

                if (!error && data) {
                    const totalUnread = data.reduce((sum, c) => sum + (c.unread_count || 0), 0);
                    setUnreadMessagesCount(totalUnread);
                }
            } catch (err) {
                console.error("Error fetching unread messages count:", err);
            }
        };

        // 2. Fetch unread notifications
        const fetchUnreadNotifications = async () => {
            try {
                const { count, error } = await supabase
                    .from('notifications')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', userId)
                    .eq('is_read', false);

                if (!error) {
                    setUnreadNotificationsCount(count || 0);
                }
            } catch (err) {
                console.error("Error fetching unread notifications count:", err);
            }
        };

        fetchUnreadMessages();
        fetchUnreadNotifications();

        // 3. Real-time channel for conversations updates
        const convChannel = supabase
            .channel(`nav_conversations_${userId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'conversations'
                },
                () => {
                    fetchUnreadMessages();
                }
            )
            .subscribe();

        // 4. Real-time channel for notifications updates
        const notifChannel = supabase
            .channel(`nav_notifications_${userId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`
                },
                () => {
                    fetchUnreadNotifications();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(convChannel);
            supabase.removeChannel(notifChannel);
        };
    }, [session?.user?.id]);

    return (
        <nav className="relative z-50">
            <div className={`flex items-center justify-evenly sm:justify-between fixed bottom-2.5 sm:top-2.5 right-0 left-0 mx-2 sm:px-4 py-2 h-18 rounded-[60px] bg-white/40 backdrop-blur-md border-2 border-slate-100 shadow-md`}>
                <div className="contents sm:flex sm:items-center">
                    <Link to="/">
                        <Logo width='50px' height='50px' />
                    </Link>
                    <div className="text-center ml-1 hidden sm:block">
                        <Link to="/" className="no-underline">
                            <p className="text-green-600 font-extrabold font-nunito leading-tight m-0">Campus</p>
                            <p className="text-green-600 font-extrabold font-nunito leading-tight m-0">Mart</p>
                        </Link>
                    </div>
                </div>

                <div className="contents sm:flex sm:items-center sm:gap-2">
                    {session && (
                        <Link to="/create-post">
                            <button className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-colors shadow-sm cursor-pointer">
                                <span className="hidden md:block mr-2 text-sm font-medium">Sell Now</span>
                                <Store size={20} />
                            </button>
                        </Link>
                    )}

                    {session && (
                        <Link to="/messages">
                            <button className="relative p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors cursor-pointer" aria-label="message">
                                <Mail size={24} />
                                {unreadMessagesCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white ring-1 ring-red-500/30" />
                                )}
                            </button>
                        </Link>
                    )}

                    {session && (
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="relative p-2 rounded-full transition-colors cursor-pointer"
                            aria-label="notifications"
                        >
                            <Bell size={24} className={`${isNotificationsOpen ? "text-gray-600 bg-gray-100" : "text-green-600 hover:bg-green-50"} rounded-full transition-colors`} />
                            {unreadNotificationsCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white ring-1 ring-red-500/30" />
                            )}
                        </button>
                    )}

                    {/* Updated Menu Button */}
                    <button
                        className="p-2 rounded-full transition-colors cursor-pointer text-black hover:bg-gray-100"
                        aria-label="menu"
                        onClick={toggleMenu}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Integrated NavMenu */}
            <NavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            {/* Integrated NotificationsPanel */}
            <NotificationsPanel
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                session={session}
            />
        </nav>
    );
}