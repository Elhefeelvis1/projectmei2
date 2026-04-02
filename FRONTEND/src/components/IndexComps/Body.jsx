import React, { useState, useEffect, useRef } from 'react';
import { Card, CardLink } from "../BodyComps/Card";
import { 
    ShoppingCart, 
    ShieldCheck, 
    Zap, 
    Users, 
    ChevronDown, 
    ChevronUp,
    Store,
    Wallet
} from 'lucide-react';
import { Link } from 'react-router-dom';
import FeatureCarousel from './FeatureCarousel';
import ContactUs from './ContactUs';

// --- Helper Component for Scroll Animations ---
// Wraps any section to make it fade in and slide up when scrolled into view
const FadeInSection = ({ children, delay = "delay-0" }) => {
    const [isVisible, setVisible] = useState(false);
    const domRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    // Unobserve once it becomes visible so it doesn't animate out and in repeatedly
                    observer.unobserve(domRef.current);
                }
            });
        }, { threshold: 0.1 }); // Triggers when 10% of the element is visible

        if (domRef.current) observer.observe(domRef.current);
        
        return () => {
            if (domRef.current) observer.unobserve(domRef.current);
        };
    }, []);

    return (
        <div
            ref={domRef}
            className={`transition-all duration-700 ease-out transform ${delay} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
        >
            {children}
        </div>
    );
};

// --- FAQ Item Component ---
const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 py-4">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex justify-between items-center text-left focus:outline-none"
            >
                <span className="text-lg font-medium text-gray-900">{question}</span>
                {isOpen ? <ChevronUp className="text-green-600" /> : <ChevronDown className="text-gray-400" />}
            </button>
            <div className={`mt-2 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-600">{answer}</p>
            </div>
        </div>
    );
};


// --- Main Body Component ---
export default function Body({ session }) {
    
    // Placeholder FAQs
    const faqs = [
        { q: "How do I buy an item on the platform?", a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam." },
        { q: "Is my payment information secure?", a: "Placeholder answer: Yes, we use industry-standard encryption. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque." },
        { q: "How do I become a seller?", a: "Placeholder answer: Creating a seller profile is easy. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit." },
        { q: "What happens if an item doesn't match the description?", a: "Placeholder answer: We have a buyer protection policy. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur." },
        { q: "Can I offer services instead of physical products?", a: "Placeholder answer: Absolutely! You can list tutoring, cleaning, and other services. Excepteur sint occaecat cupidatat non proident." },
    ];

    return (
        <main className="bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* --- Hero Feature Cards Section --- */}
                <FadeInSection>
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                            The Ultimate Campus Marketplace
                        </h1>
                        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                            Buy, sell, and offer services securely within your campus community. Everything you need, right where you are.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 justify-center items-center my-16 flex-wrap">
                        <Card 
                            title="Buy & Sell Easily" 
                            imgUrl="/images/landingpage/cart.png" 
                            content="Marketplace tailored specifically for students. Find what you need fast." 
                        />
                        <Card 
                            title="Affordable Services" 
                            imgUrl="/images/landingpage/payment.png" 
                            content="Tutoring, printing, room cleaning, hair styling and more..." 
                        />
                        <Card 
                            title="Smart Campus Shopping" 
                            imgUrl="/images/landingpage/phonewithstand.svg" 
                            content="Cashless, fast, and efficient. No more campus bulletin boards." 
                        />
                    </div>
                </FadeInSection>

                <FadeInSection>
                    <FeatureCarousel />
                </FadeInSection>


                {/* --- How It Works Section --- */}
                <FadeInSection>
                    <div className="my-24 bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
                            <p className="mt-4 text-gray-600">Get started in three simple steps</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                            <div className="flex flex-col items-center">
                                <div className="bg-green-100 p-4 rounded-full text-green-600 mb-4">
                                    <Users size={32} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">1. Join the Community</h3>
                                <p className="text-gray-500">Sign up with your student email to access verified campus listings.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="bg-green-100 p-4 rounded-full text-green-600 mb-4">
                                    <Store size={32} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">2. Browse or List</h3>
                                <p className="text-gray-500">Find great deals from peers or list your own items and services in minutes.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="bg-green-100 p-4 rounded-full text-green-600 mb-4">
                                    <Wallet size={32} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">3. Transact Safely</h3>
                                <p className="text-gray-500">Pay securely through the app and meet up on campus to complete the exchange.</p>
                            </div>
                        </div>
                    </div>
                </FadeInSection>


                {/* --- Popular Categories Section --- */}
                <FadeInSection>
                    <div className="my-24">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Popular Categories</h2>
                                <p className="text-gray-600 mt-2">Explore what students are buying right now</p>
                            </div>
                        </div>
                        <div className="flex flex-row gap-6 justify-start overflow-x-auto whitespace-nowrap w-full pb-6 hide-scrollbar">
                            {/* Note: Ensure hide-scrollbar CSS is defined in your global styles */}
                            <CardLink title="Room Essentials" imgUrl="/images/landingpage/wardrobe.svg" href="/category/essentials" linkName="Explore" />
                            <CardLink title="Electronics" imgUrl="/images/landingpage/computer.svg" href="/category/electronics" linkName="Explore" />
                            <CardLink title="Personal Services" imgUrl="/images/landingpage/person.svg" href="/category/services" linkName="Explore" />
                            <CardLink title="Groceries" imgUrl="/images/landingpage/fruit.png" href="/category/groceries" linkName="Explore" />
                            <CardLink title="Toiletries" imgUrl="/images/landingpage/toiletries.png" href="/category/toiletries" linkName="Explore" />
                            <CardLink title="Tutoring" imgUrl="/images/landingpage/tutoring.png" href="/category/tutoring" linkName="Explore" />
                        </div>
                    </div>
                </FadeInSection>


                {/* --- Why Choose Us Section --- */}
                <FadeInSection>
                    <div className='flex flex-col lg:flex-row items-center justify-between lg:gap-2'>
                        <div className='border border-2 border-green-600 rounded-2xl p-4 w-full mt-12 lg:mt-0 shadow-xl'>
                            <div className='flex flex-col items-center text-center mb-8'>
                                <h2 className='text-3xl text-green-600 font-bold mb-4'>Intuitive Steps</h2>
                                <p className='text-md text-slate-700'>Simple steps to your
                                   next safe trade: From signup to completed transaction in minutes 
                                   — designed around how students actually operate.
                                </p>
                            </div>
                            <div className=''>
                                <div className='border border-2 border-slate-200 bg-stone-100 py-2 px-4 rounded-xl mb-4 text-slate-900'>
                                    1. Create Your Verified Account <br/>
                                    <span>
                                        Register with your .edu.ng email or matric number. 
                                        Your identity is confirmed before you can list or buy anything.
                                    </span>
                                </div>
                                <div className='border border-2 border-slate-200 bg-stone-100 py-2 px-4 rounded-xl mb-4 text-slate-900'>
                                    2. Browse or List Items <br/>
                                    <span>
                                        Post textbooks, gadgets, fashion, or services. 
                                        Browse campus-filtered listings from verified students near you.
                                    </span>
                                </div>
                                <div className='border border-2 border-slate-200 bg-stone-100 py-2 px-4 rounded-xl mb-4 text-slate-900'>
                                    3. Pay via Escrow <br/>
                                    <span>
                                        Your payment is held safely. 
                                        Funds are only released once you confirm delivery 
                                        — protecting both buyer and seller.
                                    </span>
                                </div>
                                <div className='border border-2 border-slate-200 bg-stone-100 py-2 px-4 rounded-xl mb-4 text-slate-900'>
                                    4. Rate & Build Trust <br/>
                                    <span>
                                        Leave a review. Build your reputation. 
                                        Discover who the trusted traders in your campus community are.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeInSection>

                {/* --- Featured Products Section (Commented Out as requested) --- */}
                {/* <FadeInSection>
                    <div className="text-center my-24">
                        <h2 className="text-3xl font-bold mb-8 text-gray-900">Featured Products</h2>
                        <div className="flex flex-row gap-8 justify-start overflow-x-auto whitespace-nowrap w-full pb-4 hide-scrollbar">
                            {items.map((item, index) => {
                            if (items.length === index + 1) {
                                return (
                                <div ref={lastItemElementRef} key={item.id}>
                                    <BidItemCard item={item} />
                                </div>
                                );
                            } else {
                                return (
                                    <div key={item.id}>
                                        <BidItemCard item={item} />
                                    </div>
                                );
                            }
                            })}
                        </div>
                    </div>
                </FadeInSection>
                */}

                {/* --- FAQ Section --- */}
                <FadeInSection>
                    <div className="my-24 max-w-3xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
                            <p className="mt-4 text-gray-600">Got questions? We've got answers.</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                            {faqs.map((faq, index) => (
                                <FaqItem key={index} question={faq.q} answer={faq.a} />
                            ))}
                        </div>
                    </div>
                </FadeInSection>

                {/* --- Contact Us Section --- */}
                <FadeInSection>
                    <ContactUs />
                </FadeInSection>

                {/* --- Call to Action Section --- */}
                {!session && (
                    <FadeInSection delay="delay-100">
                        <div className="mt-24 mb-12 bg-green-600 rounded-3xl p-12 text-center shadow-lg relative overflow-hidden">
                            {/* Decorative background circle */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500 rounded-full opacity-50 blur-3xl"></div>
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-green-700 rounded-full opacity-50 blur-3xl"></div>
                            
                            <div className="relative z-10">
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to simplify your campus life?</h3>
                                <p className="text-green-100 mb-8 max-w-2xl mx-auto text-lg">
                                    Join thousands of students who are already saving money and making campus life easier.
                                </p>
                                <Link to="/login">
                                    <button className="bg-white text-green-700 hover:bg-gray-50 hover:text-green-800 font-bold py-4 px-10 rounded-xl shadow-md transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 mx-auto">
                                        <ShoppingCart size={20} />
                                        Start Shopping Today
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </FadeInSection>
                )}

            </div>
        </main>
    );
}