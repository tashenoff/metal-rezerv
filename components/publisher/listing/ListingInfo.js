// components/ListingInfo.js
import { useState, useEffect } from 'react';
import DateDisplay from '../../DateDisplay';
import Link from 'next/link';
import AttachmentList from '../../AttachmentList';
import { useAuth } from '../../../contexts/AuthContext';

const ListingInfo = ({ listing }) => {
    const { user } = useAuth();
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFullContent, setShowFullContent] = useState(false);

    useEffect(() => {
        // Если есть прикрепленные файлы в объявлении, используем их
        if (listing && listing.attachments) {
            setAttachments(listing.attachments);
        } else if (listing && listing.id) {
            // Иначе получаем прикрепленные файлы с сервера
            fetchAttachments(listing.id);
        }
    }, [listing]);

    const fetchAttachments = async (listingId) => {
        setLoading(true);
        try {
            // Получаем авторизационный токен
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const response = await fetch(`/api/attachments/listing/${listingId}`, {
                headers
            });
            
            if (response.ok) {
                const data = await response.json();
                setAttachments(data);
            }
        } catch (error) {
            console.error('Error fetching attachments:', error);
        } finally {
            setLoading(false);
        }
    };

    // Обработчик удаления вложения (только для автора объявления)
    const handleAttachmentDelete = async (attachmentId) => {
        try {
            // Обновляем стейт без необходимости перезагрузки данных
            setAttachments((prev) => prev.filter((att) => att.id !== attachmentId));
        } catch (error) {
            console.error('Error deleting attachment:', error);
        }
    };

    // Проверяем, является ли текущий пользователь автором объявления
    const isAuthor = user && listing.authorId === user.id;
    
    // Сокращаем содержимое, если оно слишком длинное
    const toggleContent = () => setShowFullContent(!showFullContent);
    const maxLength = 300; // Максимальная длина для сокращенного отображения
    const contentIsTooLong = listing.content.length > maxLength;
    const displayContent = !showFullContent && contentIsTooLong 
        ? `${listing.content.substring(0, maxLength)}...` 
        : listing.content;

    return (
        <div className='card rounded-lg bg-base-100 p-5' key={listing.id}>
            <div className='flex items-center justify-between'>
                <div className='card-title'>{listing.title} </div>

                <div className="py-2 px-4 text-center text-sm">
                    <span className="font-semibold">Цена за отклик:</span> {listing.responseCost || 'Не указан'} поинтов
                </div>
            </div>

            <div className='card-body'>
                <div className="whitespace-pre-wrap">
                    {displayContent}
                </div>
                
                {contentIsTooLong && (
                    <button 
                        onClick={toggleContent} 
                        className="text-blue-500 underline mt-2"
                    >
                        {showFullContent ? 'Показать меньше' : 'Показать больше'}
                    </button>
                )}
            </div>

            <DateDisplay label="Дата публикации" date={listing.publishedAt} />
            <div className="grid lg:grid-cols-3 gap-4 py-5">
                <div className="py-2 px-2 text-center text-sm rounded-full bg-base-300 shadow">
                    <DateDisplay label="Дата доставки" date={listing.deliveryDate} />
                </div>
                <div className="py-2 px-2 text-center text-sm rounded-full bg-base-300 shadow">
                    <DateDisplay label="Дата закупки" date={listing.purchaseDate} />
                </div>
                <div className="py-2 px-2 text-center text-sm rounded-full bg-base-300 shadow">
                    <DateDisplay label="Актуально до" date={listing.expirationDate} isExpirationDate />
                </div>
            </div>

            {/* Добавляем отображение новых полей */}
            <div className="py-2 px-2 text-center text-sm rounded-full bg-base-300 shadow mb-2">
                <span className="font-semibold">Метод закупки:</span> {listing.purchaseMethod || 'Не указан'}
            </div>
            <div className="py-2 px-2 text-center text-sm rounded-full bg-base-300 shadow mb-2">
                <span className="font-semibold">Условия оплаты:</span> {listing.paymentTerms || 'Не указаны'}
            </div>
            <div className="py-2 px-2 text-center text-sm rounded-full bg-base-300 shadow mb-4">
                <span className="font-semibold">Тип объявления:</span> {listing.type || 'Не указан'}
            </div>
            
            {/* Отображаем прикрепленные файлы */}
            {loading ? (
                <div className="text-center p-4">
                    <span className="loading loading-spinner loading-md"></span>
                    <p className="mt-2">Загрузка файлов...</p>
                </div>
            ) : (
                <AttachmentList 
                    attachments={attachments} 
                    canDelete={isAuthor} 
                    onDelete={handleAttachmentDelete}
                    token={localStorage.getItem('token')}
                />
            )}
        </div>
    );
};

export default ListingInfo;
