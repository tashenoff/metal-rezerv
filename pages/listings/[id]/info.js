import ListingInfo from '../../../components/publisher/listing/ListingInfo';
import Link from 'next/link';

const Info = ({ listing }) => {

    if (!listing) {
        return <p>Объявление не найдено.</p>;
    }

    
    return (
        <>
            <ListingInfo listing={listing} />
     
        </>
    );
};

export default Info;
