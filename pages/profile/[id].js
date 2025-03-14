import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import UsernameDisplay from '../../components/UsernameDisplay';
import Link from 'next/link';
import { generateGoogleStyleAvatar } from '../../utils/avatar';
import { useSession } from 'next-auth/react';

const ProfilePage = () => {
    const { user, loading, logout } = useAuth();  // Получаем данные пользователя из контекста
    const { data: session } = useSession();  // Получаем сессию NextAuth
    
    // NextAuth теперь всегда используется

    // Проверяем наличие username перед генерацией аватара
    const avatarUrl = user?.username ? generateGoogleStyleAvatar(user.username) : null;

    const [profile, setProfile] = useState(null);
    const [deleting, setDeleting] = useState(false);  // Состояние для удаления аккаунта
    const [fetchingProfile, setFetchingProfile] = useState(true);  // Состояние для загрузки профиля
    const router = useRouter();
    const { id } = router.query; // Получаем id из URL

    useEffect(() => {
        if (!loading && user?.isLoggedIn && id && session) {
            const fetchProfile = async () => {
                setFetchingProfile(true);  // Начинаем загрузку профиля
                try {
                    console.log('Fetching profile for ID:', id);  // Логируем, какой ID запрашиваем
                    console.log('Session available:', !!session);  // Проверяем наличие сессии
                    
                    const res = await fetch(`/api/profile/${id}`);
                    
                    if (!res.ok) {
                        console.error('Ошибка при запросе профиля:', res.status, res.statusText);
                        const errorText = await res.text();
                        console.error('Текст ошибки:', errorText);
                        return;
                    }
                    
                    const data = await res.json();
                    console.log('Получены данные профиля:', data);
                    setProfile(data);  // Сохраняем профиль пользователя
                } catch (error) {
                    console.error('Ошибка при получении профиля:', error);
                } finally {
                    setFetchingProfile(false);  // Завершаем загрузку профиля
                }
            };

            fetchProfile();  // Загружаем профиль при рендере
        }
    }, [user, id, loading, session]);

    if (loading) return <div>Загрузка...</div>;

    const handleDeleteAccount = async () => {
        // Токен будет получен из сессии NextAuth автоматически

        if (window.confirm('Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.')) {
            setDeleting(true);

            try {
                const res = await fetch(`/api/profile/deleteProfile`, {
                    method: 'DELETE',
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
                <div className='hidden lg:block'>
                    {/* Передаем avatarUrl в UsernameDisplay */}
                    <UsernameDisplay username={user?.username} avatarUrl={avatarUrl} />
                </div>

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
                            <Link href="/profile/edit-profile" className="block px-4 py-2 hover:bg-base-300">
                                Редактировать профиль
                            </Link>
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

// Проверка авторизации на сервере
export async function getServerSideProps(context) {
    const { getServerSession } = await import('next-auth/next');
    const { authOptions } = await import('../../pages/api/auth/[...nextauth]');
    
    const session = await getServerSession(context.req, context.res, authOptions);
    
    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }
    
    // Sanitize the session to ensure all undefined values are replaced with null
    const sanitizedSession = JSON.parse(JSON.stringify(session || {}));
    
    return {
        props: {
            session: sanitizedSession,
        },
    };
}

export default ProfilePage;
