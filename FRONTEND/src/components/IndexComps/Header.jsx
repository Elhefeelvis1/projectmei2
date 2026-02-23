import Logo from "../GlobalComps/Logo"
import Nav from "../GlobalComps/Nav.jsx";
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header>
            <Nav />
            <div className="max-w-7xl mx-auto py-8 md:py-20 px-4 md:px-12">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8">
                    <div className="flex-1">
                        <div className="flex flex-row items-center gap-4 mb-4">
                            <Logo width='150px' height='150px' />
                            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight">
                                One-time Solution for Campus Needs
                            </h1>
                        </div>
                        <p className="text-lg text-gray-600 mb-6">
                            Buy and sell goods, find services and connect with fellow students.
                        </p>
                        <div className="flex gap-4">
                            <Link to="/login">
                                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
                                    Get Started
                                </button>
                            </Link>
                            <Link to="/itemList">
                                <button className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-6 py-2 rounded-md font-medium transition-colors">
                                    Browse Products
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <img 
                            src="/images/landingpage/womanpushingcart.svg" 
                            alt="Shopping illustration" 
                            className="w-full max-w-[400px] h-auto" 
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}