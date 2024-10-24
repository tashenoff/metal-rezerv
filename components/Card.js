// components/Card.js
import Link from 'next/link';

const Card = ({ title, content, link, children }) => {
    return (
        <div className="card mb-5 bg-white w-full shadow-sm rounded-lg p-5">
            {link ? ( // Проверяем наличие ссылки
                <Link href={link}>
                    <h1 className="card-title text-2xl font-bold mb-4">{title}</h1>
                    <p className="mb-2">{content}</p>
                </Link>
            ) : (
                <>
                    <h1 className="card-title text-2xl font-bold mb-4">{title}</h1>
                    <p className="mb-2">{content}</p>
                </>
            )}

            {children}
        </div>
    );
};

export default Card;
