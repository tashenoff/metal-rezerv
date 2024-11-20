// listingHandlers.js


export const onUnpublish = async (listingId, setListing, setError) => {
    try {
        const updatedListing = await unpublishListing(listingId);
        setListing(updatedListing);
    } catch (err) {
        setError(err.message); // обработка ошибки с setError
    }
};

export const onPublish = async (listingId, setListing, setError) => {
    try {
        const updatedListing = await publishListing(listingId);
        setListing(updatedListing);
    } catch (err) {
        setError(err.message); // обработка ошибки с setError
    }
};


