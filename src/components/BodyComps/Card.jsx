import { Link } from "react-router-dom";

function CardLink({ imgUrl, title, href, linkName }) {
    return (
        <div className="w-[200px] md:w-[250px] shrink-0 mx-2 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-[140px] flex items-center justify-center bg-white">
                <img
                    className="max-h-[120px] object-contain"
                    src={imgUrl}
                    alt={title}
                />
            </div>
            <div className="p-4">
                <h6 className="text-lg font-semibold mb-4 leading-tight">{title}</h6>
                <Link to={href}>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded text-sm transition-colors">
                        {linkName}
                    </button>
                </Link>
            </div>
        </div>
    );
}

function Card({ imgUrl, title, content }) {
    return (
        <div className="w-[300px] sm:w-[30%] md:w-[250px] bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div className="h-[140px] flex items-center justify-center bg-white p-4">
                <img
                    className="max-h-[120px] object-contain"
                    src={imgUrl}
                    alt={title}
                />
            </div>
            <div className="p-4 text-center">
                <h6 className="text-lg font-semibold mb-2 leading-tight">{title}</h6>
                <p className="text-sm text-gray-600">{content}</p>
            </div>
        </div>
    );
}

export { CardLink, Card };