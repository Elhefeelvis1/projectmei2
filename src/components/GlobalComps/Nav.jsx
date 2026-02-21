import Logo from "./Logo";
import { Mail, User, Menu, Store } from "lucide-react";
import { Link } from "react-router-dom";

export default function Nav(props) {
    return (
        <nav className="sticky top-2.5 z-[100] mx-2 px-4 py-2 rounded-[30px] bg-white/40 backdrop-blur-md border border-white/20 shadow-md">
            <div className="flex items-center justify-between">
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
                    <Link to="/makePost">
                        <button className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-colors shadow-sm">
                            <span className="hidden md:block mr-2 text-sm font-medium">Sell Now</span>
                            <Store size={20} />
                        </button>
                    </Link>
                    
                    <Link to="/messages">
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors" aria-label="message">
                            <Mail size={24} />
                        </button>
                    </Link>

                    <Link to="">
                        <button className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors" aria-label="menu">
                            <Menu size={24} />
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}