// components/AuthorInfo.js
const AuthorInfo = ({ author, responses, userId }) => {
    return (
        <>
            {author && author.isCompanyVerified !== undefined ? (
                author.isCompanyVerified ? (
                    <div className='flex items-center'>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-5 mr-1 text-blue-500"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 21 12Z"
                            />
                        </svg>
                        <p className="text-blue-500">Компания верифицирована</p>
                    </div>
                ) : (
                    <p className="text-gray-500">Компания не верифицирована</p>
                )
            ) : (
                <p className="text-gray-500">(Нет информации о верификации)</p>
            )}

            {/* Отображение информации об авторе, если отклик принят */}
            {responses && responses.accepted === true ? (
                <p className="text-gray-600 flex flex-col mt-5">
                   <div className="w-full justify-between flex"> <strong className="mr-2">Автор:</strong> <span>{author.name}</span></div>


                   <div className="w-full justify-between flex"><strong className="mr-2">Компания:</strong> {author.company.name}</div>
                   <div className="w-full justify-between flex"> <strong className="mr-2">Телефон:</strong> {author.phoneNumber}</div>

                   <div className="w-full justify-between flex"> <strong className="mr-2">Email:</strong> {author.email}</div>
                </p>

            ) : (
                <p className="text-gray-600">
                    <strong className="mr-2">Автор:</strong> **
                </p>
            )}

            <div className='flex py-1 flex-col'>
                <p className="text-gray-600 w-full justify-between flex"><strong className="mr-2">Страна:</strong> {author.country}</p>
                <p className="text-gray-600 w-full justify-between flex"><strong className="mr-2">Город:</strong>  {author.city}</p>
            </div>

           
        </>
    );
};


export default AuthorInfo;
