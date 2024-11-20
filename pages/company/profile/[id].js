import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../contexts/AuthContext';
import Layout from '../../../components/Layout';
import ReviewForm from '../../../components/ReviewForm';  // Импортируем форму для добавления отзыва
import ReviewsList from '../../../components/ReviewsList';  // Импортируем компонент для отображения отзывов

const CompanyProfile = () => {
    const { user, loading } = useAuth();  // Получаем данные пользователя из контекста
    const [company, setCompany] = useState(null);  // Состояние для хранения данных компании
    const [reviews, setReviews] = useState([]);  // Состояние для хранения отзывов
    const [isLoading, setIsLoading] = useState(true);  // Состояние для отслеживания загрузки данных
    const [error, setError] = useState(null);  // Состояние для ошибок
    const [successMessage, setSuccessMessage] = useState('');  // Состояние для сообщения об успешной отправке
    const [canLeaveReview, setCanLeaveReview] = useState(false);  // Состояние для проверки возможности оставить отзыв
    const router = useRouter();
    const { id } = router.query;  // Получаем id из URL

    // Функция для загрузки информации о компании и отзывов1
    useEffect(() => {
        if (!loading && user?.isLoggedIn && id) {
            const fetchData = async () => {
                try {
                    // Получение информации о компании
                    const companyResponse = await fetch(`/api/companies/${id}`);
                    const companyData = await companyResponse.json();

                    if (companyData.company) {
                        setCompany(companyData.company);  // Сохраняем данные о компании
                    } else {
                        setError('Компания не найдена');
                    }

                    // Получение отзывов о компании
                    const reviewsResponse = await fetch(`/api/reviews?id=${id}`);
                    const reviewsData = await reviewsResponse.json();
                    setReviews(reviewsData);  // Сохраняем отзывы

                    // Проверка на возможность оставить отзыв
                    const responseCheck = await fetch(`/api/responses/check?companyId=${id}&userId=${user.id}`);
                    const responseCheckData = await responseCheck.json();

                    if (responseCheckData.canLeaveReview) {
                        setCanLeaveReview(true);  // Если отклик был принят, разрешаем оставлять отзыв
                    } else {
                        setCanLeaveReview(false);  // Если отклик не был принят, не разрешаем оставлять отзыв
                    }
                } catch (err) {
                    setError('Ошибка при получении данных о компании или отзывах');
                } finally {
                    setIsLoading(false);  // Завершаем загрузку
                }
            };

            fetchData();  // Вызываем функцию для загрузки данных
        }
    }, [user, id, loading]);

    const handleReviewSubmit = async ({ rating, comment, companyId }) => {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ rating, comment, companyId }),
        });

        if (response.ok) {
            const data = await response.json();
            setReviews([data.newReview, ...reviews]);  // Добавляем новый отзыв в список
            setSuccessMessage('Отзыв успешно отправлен!');  // Устанавливаем сообщение об успехе
            setTimeout(() => {
                setSuccessMessage('');  // Скрываем сообщение через 3 секунды
            }, 3000);
        } else {
            setError('Ошибка при добавлении отзыва');
        }
    };

    // Если данные еще загружаются, показываем прелоадер
    if (isLoading) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="loader">Загрузка...</div> {/* Прелоадер */}
                </div>
            </Layout>
        );
    }

    // Если произошла ошибка, показываем сообщение об ошибке
    if (error) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-screen">
                    <p className="text-red-500">{error}</p>
                </div>
            </Layout>
        );
    }

    // Рендерим данные компании и форму/список отзывов, если компания загружена
    return (
        <Layout>
            <div className="container mx-auto p-4">
                {company && (
                    <>
                        <h1 className="text-2xl font-bold">{company.name}</h1>
                        <p><strong>Регион:</strong> {company.region}</p>
                        <p><strong>Директор:</strong> {company.director}</p>
                        <p><strong>Рейтинг:</strong> {company.rating ?? 'Не установлен'}</p>
                        <p><strong>Контакты:</strong> {company.contacts ?? 'Не указаны'}</p>

                        {/* Показываем форму отзыва только если можно оставить отзыв */}
                        {user?.isLoggedIn && canLeaveReview && (
                            <ReviewForm companyId={company.id} onSubmit={handleReviewSubmit} />
                        )}

                        {/* Сообщение об успешной отправке отзыва */}
                        {successMessage && (
                            <div className="mt-4 p-2 bg-green-500 text-white rounded">
                                {successMessage}
                            </div>
                        )}

                        {/* Список отзывов */}
                        <ReviewsList companyId={company.id} reviews={reviews} />
                    </>
                )}
            </div>
        </Layout>
    );
};

export default CompanyProfile;
