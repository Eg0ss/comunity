const BaseInput = ({ label, type = 'text', value, onChange, placeholder, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-lg border ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default BaseInput
