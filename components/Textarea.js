// components/Textarea.js
const Textarea = ({ label, value, onChange, required = false, id }) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor={id}>
          {label}
        </label>
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          className="input input-bordered w-full"
          rows="4"
        />
      </div>
    );
  };
  
  export default Textarea;
  