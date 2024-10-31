// components/Notification.js
const Notification = ({ message, type }) => {
    return (
        <div className={`alert ${type === 'error' ? 'alert-error' : 'alert-success'}`}>
            {message}
        </div>
    );
};

export default Notification;
