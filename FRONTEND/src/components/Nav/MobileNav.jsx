import { Link, useLocation } from "react-router-dom";
import { X, Home, User, ListTodo, Gavel, Package, Menu, Heart } from "lucide-react";
import { useState } from "react";

export default function MobileNav({ isOpen, onClose }) {
    const [toggleNav, setToggleNav] = useState(false);
    const location = useLocation();

    const navItems = [
        { path: "/", label: "Home", icon: Home },
        { path: "/my-items", label: "My Items", icon: ListTodo },
        { path: "/my-bids", label: "My Bids", icon: Gavel },
        { path: "/pickups", label: "Pickups", icon: Package },
        { path: "/favorites", label: "Favorites", icon: Heart },
        { path: "/userDetails", label: "Profile", icon: User },
    ];

    const isItemActive = (path) => {
        if (path === "/") {
            return location.pathname === "/";
        }
        return location.pathname.startsWith(path);
    };

    const isRouteMessage = location.pathname.startsWith("/messages");

    const handleItemClick = () => {
        if (onClose) onClose();
    };

    return (
        <>
            {/* Expanded Bottom Dock - Centered Horizontally with Horizontal Slide Animation */}
            <div
                className={`fixed bottom-4 left-1/2 z-50 md:hidden w-max max-w-[calc(100vw-24px)] transition-all duration-300 ease-out origin-right ${isRouteMessage
                        ? "hidden"
                        : toggleNav
                            ? "opacity-100 scale-100 -translate-x-1/2 pointer-events-auto"
                            : "opacity-0 scale-0 translate-x-[calc(50vw-3.5rem)] pointer-events-none"
                    }`}
            >
                <nav className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-full bg-white/90 backdrop-blur-lg border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.15)]">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isItemActive(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={handleItemClick}
                                aria-label={item.label}
                                title={item.label}
                                className={`flex items-center justify-center w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-full transition-all duration-200 ${active
                                        ? "bg-green-600 text-white shadow-md shadow-green-600/30 scale-105"
                                        : "text-gray-600 hover:text-green-600 hover:bg-green-50/70 active:scale-95"
                                    }`}
                            >
                                <Icon size={18} />
                            </Link>
                        );
                    })}

                    <div className="h-5 w-px bg-gray-200 mx-0.5" />

                    <button
                        type="button"
                        onClick={() => setToggleNav(false)}
                        aria-label="Hide navigation"
                        title="Close"
                        className="flex items-center justify-center w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200 active:scale-90 cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </nav>
            </div>

            {/* Collapsed Floating Trigger Button */}
            <button
                type="button"
                onClick={() => setToggleNav(true)}
                aria-label="Show navigation"
                title="Menu"
                className={`fixed bottom-4 right-4 z-50 md:hidden flex items-center justify-center w-12 h-12 rounded-full bg-green-600 text-white shadow-lg shadow-green-600/35 hover:bg-green-700 active:scale-95 transition-all duration-300 ease-out cursor-pointer ${isRouteMessage || toggleNav
                        ? "opacity-0 scale-0 pointer-events-none rotate-90"
                        : "opacity-100 scale-100 pointer-events-auto rotate-0"
                    }`}
            >
                <Menu size={22} />
            </button>
        </>
    );
}


