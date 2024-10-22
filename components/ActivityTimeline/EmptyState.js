// components/EmptyState.js
import React from 'react';
import Link from 'next/link';

const EmptyState = () => {
    return (
        <div className="mt-4 bg-yellow-100 p-4 rounded-lg border border-yellow-300">
            <p className="text-yellow-800">
                У вас нет активных заказов.{' '}
                <Link href="/listings" className="text-blue-600 hover:underline">
                    Посмотреть объявления.
                </Link>
            </p>
        </div>
    );
};

export default EmptyState;
