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
                    <div className="loader">Загрузка...</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto p-4">
                {company ? (
                    <>
                        <h1 className="text-2xl font-bold">{company.name}</h1>
                        <p><strong>Регион:</strong> {company.region}</p>
                        <p><strong>Директор:</strong> {company.director}</p>
                        <p><strong>Рейтинг:</strong> {company.rating ?? 'Не установлен'}</p>
                        <p><strong>Контакты:</strong> {company.contacts ?? 'Не указаны'}</p>
                        <p><strong>Веб-сайт:</strong> {company.website ?? 'Не указан'}</p>
                        <p><strong>Адрес</strong> {company.address ?? 'Не указан'}</p>
                        <p><strong>Описание</strong> {company.description ?? 'Не указа1н'}</p>



                        <div className="mt-10">
                        <h3 className="text-xl font-semibold my-6">Реквизиты компании</h3>
                            <div className="overflow-x-auto bg-base-100 col-span-8">
                                <table className="table w-full table-compact">
                                    <thead>
                                        <tr>
                                            <th className="text-center">BIN/IIN</th>
                                            <th className="text-center">Регион</th>
                                            <th className="text-center">Контакты</th>
                                            <th className="text-center">Директор</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="hover">
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
                    <p className="text-center text-gray-600">Информация о компании недоступна.</p>
                )}
            </div>
        </Layout>
    );
};

export default CompanyProfile;
