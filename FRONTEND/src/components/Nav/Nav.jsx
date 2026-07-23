// src/components/Nav/Nav.jsx
import { useState } from "react";
import { Mail, Menu, Store, X, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../GlobalComps/Logo";
import NavMenu from "./NavMenu";
import NotificationsPanel from "./NotificationsPanel";

import { useAuth } from "../AuthComps/CheckAuth.jsx";

export default function Nav() {
    const { session } = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
                    {session && <Link to="/create-post">
                        <button className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-colors shadow-sm cursor-pointer">
                            <span className="hidden md:block mr-2 text-sm font-medium">Sell Now</span>
                            <Store size={20} />
                        </button>
                    </Link>}

                    {session && <Link to="/messages">
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors cursor-pointer" aria-label="message">
                            <Mail size={24} />
                        </button>
                    </Link>}

                    {session &&
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        >
                            <Bell size={24} className={`${isNotificationsOpen ? "text-gray-600 bg-gray-100" : "text-green-600 hover:bg-green-50"} rounded-full transition-colors cursor-pointer`} />
                        </button>
                    }

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