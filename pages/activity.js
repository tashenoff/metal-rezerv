import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';

const UserActivityTimeline = () => {
    const [responses, setResponses] = useState([]);
    const [user, setUser] = useState(null);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchUserData = async () => {
                const response = await fetch('/api/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    fetchResponses(userData.id);
                } else {
                    setFeedback('Ошибка при загрузке данных пользователя.');
                }
            };
            fetchUserData();
        } else {
            setFeedback('Вы должны быть авторизованы для доступа к активности.');
        }
    }, []);

    const fetchResponses = async (responderId) => {
        const res = await fetch(`/api/responses/getResponses?responderId=${responderId}`);
        if (res.ok) {
            const data = await res.json();
            setResponses(data);
        } else {
            setFeedback('Ошибка при загрузке откликов.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="container mx-auto py-6 px-4">
                <h1 className="text-3xl font-bold mb-4">Моя активность</h1>
                {feedback && <p className="text-red-500 mb-4">{feedback}</p>}

                {/* Хронология активности */}
                <div className="relative border-l border-gray-200">
                    {user && (
                        <div className="mb-10 ml-6">
                            <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-200 ring-8 ring-white">
                                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zM10 18.25C5.35 18.25 1.75 14.65 1.75 10S5.35 1.75 10 1.75 18.25 5.35 18.25 10 14.65 18.25 10 18.25z"></path>
                                    <path d="M9.125 14.875L5.375 11.125l1.375-1.375L9.125 12l5.125-5.125L15.625 8.5z"></path>
                                </svg>
                            </span>
                            <div className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold">Регистрация на портале 🎉</h3>
                                    <time className="block text-sm text-gray-500">
                                        {new Date(user.registrationDate).toLocaleDateString()}
                                    </time>
                                </div>
                                <p className="text-gray-600">Пользователь {user.name} зарегистрировался на портале.</p>
                            </div>
                        </div>
                    )}

                    {responses.length > 0 ? (
                        responses
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .slice(0, 5)
                            .reverse()
                            .map((response) => (
                                <div key={response.id} className="mb-10 ml-6">
                                    <span className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ring-8 ring-white
                                        ${response.status === 'rejected' ? 'bg-red-200' : 
                                          response.status === 'pending' ? 'bg-orange-200' : 
                                          'bg-green-200'}`}>
                                        {response.status === 'rejected' ? (
                                            <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zM10 18.25C5.35 18.25 1.75 14.65 1.75 10S5.35 1.75 10 1.75 18.25 5.35 18.25 10 14.65 18.25 10 18.25z"></path>
                                                <path d="M13.41 8l-3.41 3.41L6.59 8 8 6.59l2 2 2-2L13.41 8z"></path>
                                            </svg>
                                        ) : response.status === 'pending' ? (
                                            <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                               <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zM10 18.25C5.35 18.25 1.75 14.65 1.75 10S5.35 1.75 10 1.75 18.25 5.35 18.25 10 14.65 18.25 10 18.25z"></path>
                                                <path d="M9.125 14.875L5.375 11.125l1.375-1.375L9.125 12l5.125-5.125L15.625 8.5z"></path>
                                            </svg>
                                        ) : (
                                            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zM10 18.25C5.35 18.25 1.75 14.65 1.75 10S5.35 1.75 10 1.75 18.25 5.35 18.25 10 14.65 18.25 10 18.25z"></path>
                                                <path d="M9.125 14.875L5.375 11.125l1.375-1.375L9.125 12l5.125-5.125L15.625 8.5z"></path>
                                            </svg>
                                        )}
                                    </span>
                                    <div className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-lg font-semibold">
                                                <Link href={`/listing/${response.listing.id}`} className="text-blue-600 hover:underline">
                                                    Отклик на объявление "{response.listing.title}"
                                                </Link>
                                            </h3>
                                            <time className="block text-sm text-gray-500">
                                                {new Date(response.createdAt).toLocaleDateString()}
                                            </time>
                                        </div>
                                        <p className="text-gray-600">Статус отклика: {response.status}</p>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <div className="mt-4 bg-yellow-100 p-4 rounded-lg border border-yellow-300">
                            <p className="text-yellow-800">
                                У вас нет активных заказов.{' '}
                                <Link href="/listings" className="text-blue-600 hover:underline">
                                    Посмотреть объявления.
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserActivityTimeline;
