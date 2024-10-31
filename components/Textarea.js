// components/Textarea.js
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Textarea = ({ value, onChange, placeholder }) => {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange} // onChange принимает строку, а не событие
      placeholder={placeholder}
      className="textarea textarea-bordered h-80 textarea-lg w-full bg-white text-black"
      modules={{
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['link'],
          ['clean'],
        ],
      }}
    />
  );
};

export default Textarea;
