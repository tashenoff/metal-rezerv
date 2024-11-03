// components/ClientControls.js
import AuthorInfo from './AuthorInfo';

const ClientControls = ({ user, listing, responses, onOpenResponseForm, hasResponded, isExpired }) => {
    const hasResponse = responses.find(response => response.responderId === user?.id) || {};

    return (
        <div className="p-4 card bg-base-100 rounded-lg shadow-md">
            {user?.role !== 'PUBLISHER' && (
                <>
                    <AuthorInfo 
                        author={listing.author} 
                        responses={hasResponse} 
                        expirationDate={listing.expirationDate} 
                    />
                    {!isExpired && !hasResponded && (
                        <button
                            className="btn btn-primary mt-5 w-full text-white p-2 rounded transition duration-200 hover:bg-blue-600"
                            onClick={onOpenResponseForm}
                        >
                            Откликнуться
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default ClientControls;
