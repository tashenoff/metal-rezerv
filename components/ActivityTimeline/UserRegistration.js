// components/UserRegistration.js
import React from 'react';

const UserRegistration = ({ user }) => {
    return (
        <div className="mb-10 ml-6">

            <div className="flex flex-col justify-center p-6 bg-white rounded-lg border border-gray-200 shadow-sm">

                <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-200 ring-8 ring-white">
                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zM10 18.25C5.35 18.25 1.75 14.65 1.75 10S5.35 1.75 10 1.75 18.25 5.35 18.25 10 14.65 18.25 10 18.25z"></path>
                        <path d="M9.125 14.875L5.375 11.125l1.375-1.375L9.125 12l5.125-5.125L15.625 8.5z"></path>
                    </svg>
                </span>


                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Регистрация на портале 🎉</h3>
                    <time className="block text-sm text-gray-500">
                        {new Date(user.registrationDate).toLocaleDateString()}
                    </time>
                </div>
                <p className="text-gray-600">Пользователь {user.name} зарегистрировался на портале.</p>
            </div>
        </div>
    );
};

export default UserRegistration;
