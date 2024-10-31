// components/UserResponses.js
import Card from './Card'; // Импортируем компонент Card
import StatusDisplay from './StatusDisplay'; // Импортируем новый компонент

const UserResponses = ({ responses, userId }) => {
    return (
        <div className="mt-4">
            
            {responses
                .filter((response) => response.responderId === userId)
                .map((response) => (
                    <>
                        <Card key={response.id} title="Мой отклик" content={response.message}>
                            <div className="mt-2">
                                <p><strong>Дата отклика:</strong> {new Date(response.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="mt-2">
                                <StatusDisplay response={response} /> {/* Используем новый универсальный компонент */}
                            </div>
                        </Card>

                    </>
                ))}
        </div>
    );
};

export default UserResponses;
