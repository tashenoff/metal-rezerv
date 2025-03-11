import ListingInfo from '../../../components/publisher/listing/ListingInfo';

const Info = ({ listing }) => {
    if (!listing) {
        return <p>Объявление не найдено.</p>;
    }
    
    return <ListingInfo listing={listing} />;
};

export default Info;
