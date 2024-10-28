// components/FormSelect.js
const FormSelect = ({ label, value, onChange, options }) => (
    <div className="mb-4">
      <label className="block text-sm font-bold mb-2">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="input input-bordered w-full w-full"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
  
  export default FormSelect;
  