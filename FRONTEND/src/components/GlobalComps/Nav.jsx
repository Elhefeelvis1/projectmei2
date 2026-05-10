// src/components/GlobalComps/Nav.jsx
import { useState } from "react"; // Added useState
import Logo from "./Logo";
import NavMenu from "./NavMenu"; // Import the new menu component
import { Mail, Menu, Store, X } from "lucide-react"; // Added X for close icon
import { Link } from "react-router-dom";

export default function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="relative z-50">
            <div className="flex items-center justify-between fixed top-2.5 right-0 left-0 mx-2 px-4 py-2 rounded-[30px] bg-white/40 backdrop-blur-md border-2 border-slate-100 shadow-md"> {/* Added relative here */}
                <div className="flex items-center">
                    <Link to="/">
                        <Logo width='50px' height='50px' />
                    </Link>
                    <div className="text-center ml-1">
                        <Link to="/" className="no-underline">
                            <p className="text-green-600 font-extrabold font-nunito leading-tight m-0">Campus</p>
                            <p className="text-green-600 font-extrabold font-nunito leading-tight m-0">Mart</p>
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link to="/create-post">
                        <button className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-colors shadow-sm cursor-pointer">
                            <span className="hidden md:block mr-2 text-sm font-medium">Sell Now</span>
                            <Store size={20} />
                        </button>
                    </Link>

                    <Link to="/messages">
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors cursor-pointer" aria-label="message">
                            <Mail size={24} />
                        </button>
                    </Link>

                    {/* Updated Menu Button */}
                    <button
                        className={`p-2 rounded-full transition-colors cursor-pointer ${isMenuOpen ? 'bg-gray-100 text-green-600' : 'text-black hover:bg-gray-100'}`}
                        aria-label="menu"
                        onClick={toggleMenu}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Integrated NavMenu */}
                    <NavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
                </div>
            </div>
        </nav>
    );
}