// src/components/ui/GoogleButton.jsx
// PAS un bouton classique avec onClick + fetch : une vraie navigation de page
// (balise <a>) est nécessaire, car le navigateur doit suivre la redirection
// vers Google puis en revenir — un simple appel API ne peut pas faire ça.

import { FcGoogle } from 'react-icons/fc'

const GoogleButton = ({ label = 'Continuer avec Google' }) => {
  const googleLoginUrl = `${import.meta.env.VITE_API_URL}/auth/google/login`

  return (
    
     <a href={googleLoginUrl}
      className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-300 rounded-lg font-medium text-neutral-text hover:bg-gray-50 transition-colors"
    >
      <FcGoogle size={20} />
      {label}
    </a>
  )
}

export default GoogleButton