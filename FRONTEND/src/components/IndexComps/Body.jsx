import { Card, CardLink } from "../BodyComps/Card";
import { ShoppingCart } from 'lucide-react'; // Replacing MUI Icon with Lucide
import { Link } from 'react-router-dom';

export default function Body(props) {
    return (
        <main>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Feature Cards Section */}
                <div className="flex flex-col sm:flex-row gap-8 justify-center items-center my-20 flex-wrap">
                    <Card 
                        title="Buy & Sell Easily" 
                        imgUrl="/images/landingpage/cart.png" 
                        content="Market place tailored for students" 
                    />
                    <Card 
                        title="Affordable Services" 
                        imgUrl="/images/landingpage/payment.png" 
                        content="Tutoring, printing, room cleaning and more..." 
                    />
                    <Card 
                        title="Smart Campus Shopping" 
                        imgUrl="/images/landingpage/phonewithstand.svg" 
                        content="Cashless, Fast and Efficient" 
                    />
                </div>

                {/* Popular Categories Section */}
                <div className="text-center my-20">
                    <h2 className="text-3xl font-bold mb-8 text-gray-900">Popular Categories</h2>
                    <div className="flex flex-row gap-8 justify-start overflow-x-auto whitespace-nowrap w-full pb-4 scrollbar-hide">
                        <CardLink title="Room Essentials" imgUrl="/images/landingpage/wardrobe.svg" href="" linkName="Explore" />
                        <CardLink title="Electronics" imgUrl="/images/landingpage/computer.svg" href="" linkName="Explore" />
                        <CardLink title="Personal Services" imgUrl="/images/landingpage/person.svg" href="" linkName="Explore" />
                        <CardLink title="Groceries" imgUrl="/images/landingpage/fruit.png" href="" linkName="Explore" />
                        <CardLink title="Toiletries" imgUrl="/images/landingpage/toiletries.png" href="" linkName="Explore" />
                        <CardLink title="Tutoring" imgUrl="/images/landingpage/tutoring.png" href="" linkName="Explore" />
                    </div>
                </div>

                {/* Call to Action Section */}
                <div className="text-center my-20">
                    <h3 className="text-2xl font-semibold text-gray-800">Ready to simplify your Campus life?</h3>
                    <Link to="/login">
                        <button className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow-lg transition duration-200">
                            Sign Up Today
                        </button>
                    </Link>
                </div>
            </div>
        </main>
    );
}