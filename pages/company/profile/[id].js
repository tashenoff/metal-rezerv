import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../contexts/AuthContext';
import Layout from '../../../components/Layout';
import { getCompanyDetails } from '../../../services/api';

const CompanyProfile = () => {
    const { user, loading } = useAuth();
    const [company, setCompany] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (!loading && user?.isLoggedIn && id) {
            const fetchData = async () => {
                try {
                    // Получение информации о компании
                    const companyData = await getCompanyDetails(id);
                    if (companyData.company) {
                        setCompany(companyData.company);
                    }
                } catch (err) {
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchData();
        }
    }, [user, id, loading]);

    if (isLoading) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="loading loading-spinner loading-lg"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto p-6">
                {company ? (
                    <>
                        {/* Заголовок и основная информация */}
                        <div className="bg-base-200 p-6 rounded-lg shadow-md mb-6">
                            <h1 className="text-3xl font-bold mb-4">{company.name}</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-lg">
                                        <strong>Регион:</strong> {company.region}
                                    </p>
                                    <p className="text-lg">
                                        <strong>Директор:</strong> {company.director}
                                    </p>
                                    <p className="text-lg">
                                        <strong>Рейтинг:</strong> {company.rating ?? 'Не установлен'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-lg">
                                        <strong>Контакты:</strong> {company.contacts ?? 'Не указаны'}
                                    </p>
                                    <p className="text-lg">
                                        <strong>Веб-сайт:</strong> {company.website ? (
                                            <a
                                                href={company.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline"
                                            >
                                                {company.website}
                                            </a>
                                        ) : 'Не указан'}
                                    </p>
                                    <p className="text-lg">
                                        <strong>Адрес:</strong> {company.address ?? 'Не указан'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Описание компании */}
                        <div className="bg-base-200 p-6 rounded-lg shadow-md mb-6">
                            <h2 className="text-2xl font-bold mb-4">Описание компании</h2>
                            <p className="text-lg">
                                {company.description ?? 'Описание отсутствует.'}
                            </p>
                        </div>

                        {/* Реквизиты компании */}
                        <div className="bg-base-200 p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold mb-4">Реквизиты компании</h2>
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-center">BIN/IIN</th>
                                            <th className="text-center">Регион</th>
                                            <th className="text-center">Контакты</th>
                                            <th className="text-center">Директор</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="text-center">{company.binOrIin}</td>
                                            <td className="text-center">{company.region}</td>
                                            <td className="text-center">{company.contacts}</td>
                                            <td className="text-center">{company.director}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-600">
                        <p>Информация о компании недоступна.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default CompanyProfile;