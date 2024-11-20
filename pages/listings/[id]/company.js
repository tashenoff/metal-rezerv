import Link from 'next/link';

const Company = ({ company }) => {
    return (
        <div>
            <Link className='text-blue-500 hover:underline' href={`/company/profile/${company?.id}`}>
                {company?.name}
            </Link>
        </div>
    );
};

export default Company;
