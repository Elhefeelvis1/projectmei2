import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Header from "../components/IndexComps/Header.jsx";
import Body from "../components/IndexComps/Body.jsx";
import Footer from "../components/IndexComps/Footer.jsx";
import { useAuth } from "../components/AuthComps/CheckAuth.jsx";
import BouncingLoader from "../components/GlobalComps/BouncingLoader.jsx";

export default function Home(){
    const { session, loading } = useAuth();
    const [pageData, setPageData] = useState(null);
    const [isPageLoading, setIsPageLoading] = useState(true);

    if (loading) return <BouncingLoader />;  

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase.from('all_items').select('*');
            setPageData(data);
            
            setTimeout(() => setIsPageLoading(false), 500); 
        };

        fetchData();
        }, []);
        
    if (isPageLoading) return <BouncingLoader />;

    return (
        <div>
          <Header session={session} />
          <Body  session={session}/>
          <Footer />
        </div>
    )
}