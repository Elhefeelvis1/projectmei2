import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import Header from "../components/IndexComps/Header.jsx";
import Body from "../components/IndexComps/Body.jsx";
import Footer from "../components/IndexComps/Footer.jsx";
import { useAuth } from "../components/AuthComps/CheckAuth.jsx";
import BouncingLoader from "../components/GlobalComps/BouncingLoader.jsx";
import { useLocation } from "react-router-dom";

export default function Home() {
    const { session, loading } = useAuth();
    const [pageData, setPageData] = useState(null);
    const faqsRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        if (location.state?.scrollTo) {
            const id = location.state.scrollTo;
            const timer = setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }, 300);
            window.history.replaceState({}, document.title);
            return () => clearTimeout(timer);
        }
    }, [location]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <BouncingLoader />
            </div>
        );
    }

    return (
        <div>
            <Header session={session} />
            <Body faqsRef={faqsRef} session={session} />
            <Footer faqsRef={faqsRef} />
        </div>
    )
}