import StatusBadge from '../StatusBadge';
import Link from 'next/link';

const CompanyDetails = ({ company, user }) => {
    // Функция для сопоставления статусов
    const mapModerationStatusToBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return { status: 'На модерации', color: 'pending' };
            case 'APPROVED':
                return { status: 'Одобрено', color: 'accepted' };
            case 'REJECTED':
                return { status: 'Отклонено', color: 'rejected' };
            default:
                return { status: 'Неизвестно', color: 'default' };
        }
    };

    const moderationBadge = mapModerationStatusToBadge(company.moderationStatus);

    return (
        <div className="">
            <div className="my-5">
                {user?.role !== 'PUBLISHER' && (
                    <div className="w-full rounded-lg p-5 flex items-center justify-between bg-base-100">
                        <span>Баланс компании: {company.balance}</span>
                        <span>Пополнить</span>
                    </div>
                )}
            </div>

            <div className="grid lg:grid-cols-3 gap-4 w-full my-5">
                <div className="card w-full p-5 bg-base-100 rounded-lg">
                    Название компании: {company.name}
                </div>

                <div className="card w-full p-5 bg-base-100 rounded-lg">
                    <Link className="text-blue-600 hover:underline" href={`/company/profile/${company.id}`}>
                        ID компании: {company.id}
                    </Link>
                </div>

                <div className="card w-full p-5 bg-base-100 rounded-lg">
                    Статус компании:
                    <StatusBadge
                        status={moderationBadge.status}
                        color={moderationBadge.color}
                    />
                </div>
            </div>

            <div className="">
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
        </div>
    );
};

export default CompanyDetails;
