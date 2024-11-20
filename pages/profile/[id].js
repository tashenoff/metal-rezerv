import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';

const ProfilePage = () => {
    const { user, loading, logout } = useAuth();  // Получаем данные пользователя из контекста
    const [profile, setProfile] = useState(null);
    const [deleting, setDeleting] = useState(false);  // Состояние для удаления аккаунта
    const [fetchingProfile, setFetchingProfile] = useState(true);  // Состояние для загрузки профиля
    const router = useRouter();
    const { id } = router.query; // Получаем id из URL

    useEffect(() => {
        if (!loading && user?.isLoggedIn && id) {
            const fetchProfile = async () => {
                setFetchingProfile(true);  // Начинаем загрузку профиля
                try {
                    console.log('Fetching profile for ID:', id);  // Логируем, какой ID запрашиваем
                    const res = await fetch(`/api/profile/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Токен из localStorage
                        },
                    });
                    const data = await res.json();
                    console.log('Profile data response:', data);  // Логируем ответ от сервера

                    if (res.status === 200) {
                        setProfile(data);  // Сохраняем профиль пользователя
                    } else {
                        console.error(data.message);  // Если ошибка, выводим сообщение
                    }
                } catch (error) {
                    console.error('Ошибка при получении профиля:', error);
                } finally {
                    setFetchingProfile(false);  // Завершаем загрузку профиля
                }
            };

            fetchProfile();  // Загружаем профиль при рендере
        }
    }, [user, id, loading]);

    if (loading) return <div>Загрузка...</div>;

    const handleDeleteAccount = async () => {
        if (window.confirm('Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.')) {
            setDeleting(true);

            try {
                const res = await fetch(`/api/profile/deleteProfile`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (res.status === 200) {
                    alert('Ваш аккаунт был успешно удалён.');
                    logout();  // Выйти из аккаунта после удаления
                    router.push('/');  // Перенаправить на главную страницу
                } else {
                    const data = await res.json();
                    alert(`Ошибка при удалении аккаунта: ${data.message}`);
                }
            } catch (error) {
                console.error('Ошибка при удалении аккаунта:', error);
                alert('Произошла ошибка при удалении аккаунта.');
            } finally {
                setDeleting(false);
            }
        }
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto mt-8 p-6">
                <h1 className="text-3xl font-bold text-center text-gray-800">Профиль пользователя</h1>
                {fetchingProfile ? (
                    <div className="flex justify-center mt-6">
                        <span className="loading loading-bars loading-lg"></span>  {/* Индикатор загрузки */}
                    </div>
                ) : profile ? (
                    <div className="mt-6">
                        <div className="space-y-4">
                            {/* Карточка с данными пользователя */}
                            <div className="card bg-base-100 shadow-md">
                                <div className="card-body">
                                    <p><strong>Мой ID:</strong> {profile.user?.id || 'ID не указан'}</p>
                                </div>
                            </div>

                            <div className="card bg-base-100 shadow-md">
                                <div className="card-body">
                                    <h2 className="card-title">{profile.user?.name || 'Имя не указано'}</h2>
                                    <p><strong>Email:</strong> {profile.user?.email || 'Email не указан'}</p>
                                    <p><strong>Телефон:</strong> {profile.user?.phoneNumber || 'Телефон не указан'}</p>
                                    <p><strong>Город:</strong> {profile.user?.city || 'Город не указан'}</p>
                                    <p><strong>Страна:</strong> {profile.user?.country || 'Страна не указана'}</p>
                                    <p><strong>Потраченные баллы:</strong> {profile.totalPointsSpent || 0}</p>
                                </div>
                            </div>

                            {/* Информация о компании */}
                            <div className="card bg-base-100 shadow-md">
                                <div className="card-body">
                                    <h3 className="card-title">Компания</h3>
                                    {profile.company ? (
                                        <>
                                            <p><strong>Название компании:</strong> {profile.company.name || 'Не указано'}</p>
                                            <p><strong>Адрес компании:</strong> {profile.company.address || 'Не указан'}</p>
                                        </>
                                    ) : (
                                        <p>Пользователь не состоит в компании</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Кнопка для редактирования профиля */}
                        <div className="mt-6 text-center">
                            <button className="btn btn-primary">Редактировать профиль</button>
                        </div>

                        {/* Кнопка для удаления аккаунта */}
                        <div className="mt-6 text-center">
                            <button
                                className="btn btn-error"
                                onClick={handleDeleteAccount}
                                disabled={deleting}
                            >
                                {deleting ? 'Удаление...' : 'Удалить аккаунт'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="mt-4 text-center text-red-500">Данные профиля не найдены.</p>
                )}
            </div>
        </Layout>
    );
};

export default ProfilePage;