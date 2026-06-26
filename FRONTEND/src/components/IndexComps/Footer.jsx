import { Link, useNavigate, useLocation } from 'react-router-dom';
import Instagram from "../../assets/instagram.svg?react";
import Tiktok from "../../assets/tiktok.svg?react";
import X from "../../assets/x.svg?react";

export default function Footer({ faqsRef }) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <footer className="bg-green-700 text-white pt-8 pb-4 px-4 mx-2 mb-2 rounded-2xl">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm font-medium">
                    <Link onClick={() => faqsRef.current?.scrollIntoView({ behavior: 'smooth' })} className="hover:underline cursor-pointer">FAQs</Link>
                    <Link to="/legal" className="hover:underline">Privacy Policy</Link>
                    <Link to="/legal" className="hover:underline">Terms of Service</Link>
                    <button
                        onClick={() => {
                            if (location.pathname === "/") {
                                document.getElementById("contact-us")?.scrollIntoView({ behavior: "smooth" });
                            } else {
                                navigate("/", { state: { scrollTo: "contact-us" } });
                            }
                        }}
                        className="hover:underline cursor-pointer border-none bg-transparent p-0 m-0"
                    >
                        Contact Us
                    </button>
                </div>
                <div className="flex justify-center gap-12 mb-6 mt-4">
                    <a
                        href="https://x.com/campusmart_ng?s=21"
                        className="p-2 text-black transition-all duration-300 ease-out origin-center hover:scale-[2] hover:rotate-[20deg]"
                    >
                        <Tiktok fill="currentColor" className="size-6" />
                    </a>

                    <a
                        href="https://x.com/campusmart_ng1"
                        className="p-2 text-black transition-all duration-300 ease-out origin-center hover:scale-[2] hover:rotate-[20deg]"
                    >
                        <X fill="currentColor" className="size-6" />
                    </a>

                    <a
                        href="https://www.instagram.com/campus.mart_ng?igsh=Z3Nic3R6bjY2dTk0&utm_source=qr"
                        className="p-2 text-[#E1306C] transition-all duration-300 ease-out origin-center hover:scale-[2] hover:rotate-[20deg]"
                    >
                        <Instagram fill="currentColor" className="size-6" />
                    </a>
                </div>
                <p className="text-center text-sm text-green-100">
                    &copy; {new Date().getFullYear()} Campus Mart. All rights reserved.
                </p>
            </div>
        </footer>
    );
}