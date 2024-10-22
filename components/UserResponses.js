// components/UserResponses.js
const UserResponses = ({ responses, userId, getResponseStatus }) => {
    return (
        <div className="mt-4 border bg-white p-3 rounded shadow">
            <h3 className="text-lg font-semibold">Ваш отклик:</h3>
            {responses
                .filter((response) => response.responderId === userId)
                .map((response) => (
                    <div key={response.id} className="mt-2">
                        <p><strong>Сообщение:</strong> {response.message}</p>
                        <p><strong>Дата отклика:</strong> {new Date(response.createdAt).toLocaleDateString()}</p>
                        <p><strong>Статус:</strong> {getResponseStatus(response)}</p>
                    </div>
                ))}
        </div>
    );
};

export default UserResponses;
