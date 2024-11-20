import UserResponses from '../../../components/UserResponses';
import ResponsesList from '../../../components/ResponsesList';

const Responses = ({ responses, user, listing, reviews, handleAcceptResponse, handleDeclineResponse, handleReviewSubmit }) => {
    const hasResponded = responses.some(response => response.responderId === user?.id);

    return (
        <div>
            {user?.role !== 'PUBLISHER' && hasResponded && <UserResponses responses={responses} userId={user.id} />}
            {user?.role === 'PUBLISHER' && listing.authorId === user.id && responses.length > 0 && (
                <ResponsesList
                    responses={responses}
                    onAccept={handleAcceptResponse}
                    onDecline={handleDeclineResponse}
                    listingId={listing.id}
                    reviews={reviews}
                    onReviewSubmit={handleReviewSubmit}
                />
            )}
        </div>
    );
};

export default Responses;
