// components/UserRegistration.js
import React from 'react';
import DateDisplay from '../DateDisplay';


const UserRegistration = ({ user }) => {
    return (
        <div className="mb-10">

            <div className="card bg-base-100">



                <div className="card-body items-center">
                <DateDisplay date={user.registrationDate} />
                    <h3 className="card-title">Регистрация на портале 🎉</h3>
                    <p className="text-gray-600">Пользователь {user.name} зарегистрировался на портале.</p>
                   
                       
                   
                </div>
               
            </div>
        </div>
    );
};

export default UserRegistration;
