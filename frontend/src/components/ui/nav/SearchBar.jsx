// src/components/ui/nav/SearchBar.jsx
// Barre de recherche affichée dans la navbar, visible pour TOUT le monde
// (connecté ou non). Pour l'instant : juste l'apparence, aucune recherche
// réelle n'est déclenchée (pas de onChange, pas de onSubmit).

import { FiSearch } from 'react-icons/fi'

const SearchBar = () => {
  return (
    <div className="relative hidden md:block w-48 lg:w-64">
      <FiSearch
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        size={16}
      />
      <input
        type="text"
        placeholder="Rechercher..."
        className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-bg border border-gray-200 rounded-full
                   focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
      />
    </div>
  )
}

export default SearchBar