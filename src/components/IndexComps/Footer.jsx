import { Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-green-700 text-white mt-8 pt-8 pb-4 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm font-medium">
                    <a href="#" className="hover:underline">FAQs</a>
                    <a href="#" className="hover:underline">Privacy Policy</a>
                    <a href="#" className="hover:underline">Terms of Service</a>
                    <a href="#" className="hover:underline">Contact Us</a>
                </div>
                <div className="flex justify-center gap-6 mb-6">
                    <a href="#" className="p-2 hover:bg-green-800 rounded-full transition-colors"><Facebook size={24} /></a>
                    <a href="#" className="p-2 hover:bg-green-800 rounded-full transition-colors"><Twitter size={24} /></a>
                    <a href="#" className="p-2 hover:bg-green-800 rounded-full transition-colors"><Instagram size={24} /></a>
                </div>
                <p className="text-center text-sm text-green-100">
                    &copy; {new Date().getFullYear()} Campus Mart. All rights reserved.
                </p>
            </div>
        </footer>
    );
}