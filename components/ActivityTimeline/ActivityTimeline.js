// components/ActivityTimeline.js
import React from 'react';
import UserRegistration from './UserRegistration';
import ActivityItem from './ActivityItem';
import EmptyState from './EmptyState';

const ActivityTimeline = ({ user, responses }) => {
    return (
        <div className="">
            {user && <UserRegistration user={user} />}
            
            {responses.length > 0 ? (
                responses
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5)
                    .reverse()
                    .map((response) => <ActivityItem key={response.id} response={response} />)
            ) : (
                <EmptyState />
            )}
        </div>
    );
};

export default ActivityTimeline;
