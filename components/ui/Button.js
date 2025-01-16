// components/Button.js
const Button = ({ children, onClick, className, type = 'button' }) => {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`btn ${className}`}
      >
        {children}
      </button>
    );
  };
  
  export default Button;
  