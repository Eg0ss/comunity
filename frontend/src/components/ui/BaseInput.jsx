// src/components/ui/BaseInput.jsx
// Input générique et réutilisable pour TOUS les formulaires de l'app.

const BaseInput = ({ label, type = "text", value, onChange, error, ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-neutral-text mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
          ${error ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-primary/40"}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default BaseInput;
