import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import StatusDisplay from '../components/StatusDisplay';
import DateDisplay from '../components/DateDisplay';
import { useRouter } from 'next/router';
import { LinkIcon, UserIcon, BuildingOffice2Icon, PhoneIcon, IdentificationIcon, AtSymbolIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import TruncatedText from '../components/TruncatedText';
import TabbedNavigation from '../components/TabbedNavigation';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

const ResponsesPage = () => {
    const [responses, setResponses] = useState([]);
    const [feedback, setFeedback] = useState('');
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user, loading } = useAuth(); // Get user and loading state from AuthContext

    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            fetchResponses(user.id); // Fetch responses based on user ID from context
        } else if (!loading && !user) {
            setFeedback('Вы должны быть авторизованы для доступа к откликам.');
        }
    }, [loading, user]); // Dependencies updated

    const fetchResponses = async (responderId) => {
        const res = await fetch(`/api/responses/getResponses?responderId=${responderId}`);
        if (res.ok) {
            const data = await res.json();
            setResponses(data);
        } else {
            setFeedback('Ошибка при загрузке откликов.');
        }
    };

    const filteredResponses = responses.filter((response) => response.status === activeTab);

    const handleResponseClick = (response) => {
        setSelectedResponse(response);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedResponse(null);
    };

    const responseCounts = {
        pending: responses.filter(response => response.status === 'pending').length,
        processed: responses.filter(response => response.status === 'approved').length,
        rejected: responses.filter(response => response.status === 'rejected').length,
    };

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-4">Мои отклики</h1>
            {feedback && <p className="text-red-500 mb-4">{feedback}</p>}

            <TabbedNavigation
                onTabChange={setActiveTab}
                responseCounts={responseCounts}
                isSorted={true}
            />

            {filteredResponses.length > 0 ? (
                <div className="overflow-x-auto card bg-base-200">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-base-300">
                                <th></th>
                                <th>Название объявления</th>
                                <th>дата отклика</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResponses.map((response, index) => (
                                <tr
                                    key={response.id}
                                    className={`${index % 2 === 0 ? "bg-base-100" : "bg-base-200"} hover:bg-base-300 cursor-pointer`}
                                    onClick={() => handleResponseClick(response)}
                                >
                                    <th>{index + 1}</th>
                                    <td>{response.listing.title}</td>
                                    <td>
                                        <DateDisplay date={response.createdAt} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="mt-4 text-gray-600">Нет откликов в данной категории.</p>
            )}

            <Modal isOpen={isModalOpen} onClose={closeModal} modalMessage="Детали отклика">
                {selectedResponse && (
                    <>
                        <h2 className="text-xl font-bold mb-2">{selectedResponse.listing.title}</h2>
                        <DateDisplay label="Дата отклика:" date={selectedResponse.createdAt} />
                        <p className="my-2"><strong>Информация:</strong></p>
                        <p className="my-4 bg-base-200 card p-2">
                            <TruncatedText text={selectedResponse.listing.content} maxLength={100} />
                            <p className="my-2">
                                <Link href={`/listing/${selectedResponse.listing.id}`} className='link link-primary flex space-x-2 items-center'>
                                    <LinkIcon className="size-4" />
                                    <span>Посмотреть объявление</span>
                                </Link>
                            </p>
                        </p>
                        {selectedResponse.status === 'approved' ? (
                            <div className='bg-base-200 card p-2'>
                                <p className="mb-2"><strong>Контактная информация:</strong></p>
                                <ul className="list-disc list-inside mb-2">
                                    <li className='flex items-center mb-1'>
                                        <UserIcon className="w-5 h-5 mr-2 text-gray-600" />
                                        <strong>Контактное лицо:</strong> {selectedResponse.listing.author.name}
                                    </li>
                                    <li className='flex items-center mb-1'>
                                        <BuildingOffice2Icon className="w-5 h-5 mr-2 text-gray-600" />
                                        <strong>Компания:</strong> {selectedResponse.listing.author.companyName}
                                    </li>
                                    <li className='flex items-center mb-1'>
                                        <PhoneIcon className="w-5 h-5 mr-2 text-gray-600" />
                                        <strong>Телефон:</strong> {selectedResponse.listing.author.phoneNumber}
                                    </li>
                                    <li className='flex items-center mb-1'>
                                        <IdentificationIcon className="w-5 h-5 mr-2 text-gray-600" />
                                        <strong>BIN:</strong> {selectedResponse.listing.author.companyBIN}
                                    </li>
                                    <li className='flex items-center mb-1'>
                                        <AtSymbolIcon className="w-5 h-5 mr-2 text-gray-600" />
                                        <strong>Email:</strong> {selectedResponse.listing.author.email}
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <p className="my-5 alert alert-info">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 shrink-0 stroke-current"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span>Контактная информация доступна только для одобренных откликов.</span>
                            </p>
                        )}
                    </>
                )}
            </Modal>
        </Layout>
    );
};

export default ResponsesPage;
