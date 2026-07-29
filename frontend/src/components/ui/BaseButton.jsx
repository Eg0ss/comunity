// src/components/ui/BaseButton.jsx
// Bouton générique. variant "primary" (orange) ou "secondary" (bleu).

const BaseButton = ({ children, variant = "primary", loading = false, ...props }) => {
  const baseStyle = "w-full py-2 rounded-lg font-semibold transition disabled:opacity-60";
  const variants = {
    primary: "bg-primary hover:bg-primary-dark text-white",
    secondary: "bg-secondary hover:bg-secondary-dark text-white",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]}`}
      disabled={loading}
      {...props}
    >
      {loading ? "Chargement..." : children}
    </button>
  );
};

export default BaseButton;