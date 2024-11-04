const Banner = ({ title, content, children }) => {
    return (
        <div className="hero  mb-5 bg-primary w-full shadow-sm rounded-lg p-5">
            <div className="hero-content">
                <h1 className="text-2xl font-bold mb-4 text-white">{title}</h1>
                <p className="mb-2">{content}</p>
            </div>

            {children}
        </div>
    );
};

export default Banner;
