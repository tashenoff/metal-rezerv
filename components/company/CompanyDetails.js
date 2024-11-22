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


            <div className="grid lg:grid-cols-3 gap-4 w-full my-5">
                <div className="card w-full p-5 bg-base-100 rounded-lg">
                    Название компании: {company.name}
                </div>

                <div className="card w-full p-5 bg-base-100 rounded-lg">
                    <Link className="text-blue-600 hover:underline" href={`/company/profile/${company.id}`}>
                        ID компании: {company.id}
                    </Link>
                </div>

                <div className="card flex flex-row justify-between w-full p-5 bg-base-100 rounded-lg">
                    <span>Статус компании:</span>
                    <StatusBadge
                        status={moderationBadge.status}
                        color={moderationBadge.color}
                    />
                </div>
            </div>

        </div>
    );
};

export default CompanyDetails;
